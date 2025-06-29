const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const { validationResult } = require('express-validator');

// Crear nuevo post
const createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Datos inválidos', 
        errors: errors.array() 
      });
    }

    const { caption, location } = req.body;
    const userId = req.user._id;

    // En una implementación real, aquí manejarías la subida de imagen
    // Por ahora usaremos una imagen placeholder
    const imageUrl = req.body.imageUrl || 'https://via.placeholder.com/600x600?text=Gaugram+Post';

    const post = new Post({
      userId,
      imageUrl,
      caption: caption || '',
      location: location || ''
    });

    await post.save();

    // Actualizar contador de posts del usuario
    await User.findByIdAndUpdate(userId, { $inc: { postsCount: 1 } });

    // Poblar información del usuario para la respuesta
    await post.populate('userId', 'username fullName profileImage isVerified');

    res.status(201).json({
      message: 'Post creado exitosamente',
      post
    });

  } catch (error) {
    console.error('Error creando post:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener feed de posts
const getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user._id;

    // Obtener IDs de usuarios que sigue
    const user = await User.findById(userId).select('following');
    const followingIds = user.following;

    // Obtener posts del feed
    const posts = await Post.getFeedPosts(userId, followingIds, page, limit);

    // Agregar información de si el usuario actual dio like
    const postsWithLikeInfo = posts.map(post => ({
      ...post,
      isLiked: post.likes.includes(userId),
      likes: undefined // No enviar array completo de likes por performance
    }));

    res.json({
      posts: postsWithLikeInfo,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit
      }
    });

  } catch (error) {
    console.error('Error obteniendo feed:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener posts de un usuario específico
const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Encontrar usuario
    const user = await User.findOne({ username }).select('_id isPrivate');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si puede ver los posts (perfil público o es el mismo usuario)
    const canViewPosts = !user.isPrivate || 
                        (req.user && req.user._id.toString() === user._id.toString());

    if (!canViewPosts) {
      return res.status(403).json({ message: 'Este perfil es privado' });
    }

    const posts = await Post.find({ userId: user._id, isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('imageUrl caption likesCount commentsCount createdAt')
      .lean();

    res.json({
      posts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit
      }
    });

  } catch (error) {
    console.error('Error obteniendo posts del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener un post específico
const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const post = await Post.findById(postId)
      .populate('userId', 'username fullName profileImage isVerified')
      .lean();

    if (!post || !post.isActive) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Verificar si el usuario actual dio like
    const isLiked = req.user ? post.likes.includes(req.user._id) : false;

    // Obtener comentarios del post
    const comments = await Comment.find({ postId, isActive: true, parentComment: null })
      .populate('userId', 'username fullName profileImage isVerified')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({
      post: {
        ...post,
        isLiked,
        likes: undefined // No enviar array completo
      },
      comments
    });

  } catch (error) {
    console.error('Error obteniendo post:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Dar/quitar like a un post
const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post || !post.isActive) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    const isLiked = post.likes.includes(userId);
    
    if (isLiked) {
      // Quitar like
      post.likes.pull(userId);
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      // Dar like
      post.likes.push(userId);
      post.likesCount += 1;
      
      // Crear notificación si no es el propio post
      if (post.userId.toString() !== userId.toString()) {
        await Notification.createNotification({
          recipientId: post.userId,
          senderId: userId,
          type: 'like',
          postId: post._id,
          message: `${req.user.username} le gustó tu publicación`
        });
      }
    }

    await post.save();

    res.json({
      message: isLiked ? 'Like eliminado' : 'Like agregado',
      isLiked: !isLiked,
      likesCount: post.likesCount
    });

  } catch (error) {
    console.error('Error toggle like:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar post
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Verificar que el usuario sea el propietario del post
    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'No tienes permisos para eliminar este post' });
    }

    // Soft delete
    post.isActive = false;
    await post.save();

    // Actualizar contador de posts del usuario
    await User.findByIdAndUpdate(userId, { $inc: { postsCount: -1 } });

    res.json({ message: 'Post eliminado exitosamente' });

  } catch (error) {
    console.error('Error eliminando post:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  createPost,
  getFeed,
  getUserPosts,
  getPost,
  toggleLike,
  deletePost
};
