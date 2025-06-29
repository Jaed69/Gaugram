const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const { validationResult } = require('express-validator');

// Crear comentario
const createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Datos inválidos', 
        errors: errors.array() 
      });
    }

    const { postId } = req.params;
    const { text, parentComment } = req.body;
    const userId = req.user._id;

    // Verificar que el post existe
    const post = await Post.findById(postId);
    if (!post || !post.isActive) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Si es una respuesta, verificar que el comentario padre existe
    if (parentComment) {
      const parentCommentDoc = await Comment.findById(parentComment);
      if (!parentCommentDoc || !parentCommentDoc.isActive) {
        return res.status(404).json({ message: 'Comentario padre no encontrado' });
      }
    }

    const comment = new Comment({
      postId,
      userId,
      text,
      parentComment: parentComment || null
    });

    await comment.save();

    // Actualizar contador de comentarios del post
    post.commentsCount += 1;
    await post.save();

    // Crear notificación para el dueño del post
    if (post.userId.toString() !== userId.toString()) {
      await Notification.createNotification({
        recipientId: post.userId,
        senderId: userId,
        type: 'comment',
        postId: post._id,
        commentId: comment._id,
        message: `${req.user.username} comentó tu publicación`
      });
    }

    // Si es una respuesta, crear notificación para el dueño del comentario padre
    if (parentComment) {
      const parentCommentDoc = await Comment.findById(parentComment);
      if (parentCommentDoc.userId.toString() !== userId.toString()) {
        await Notification.createNotification({
          recipientId: parentCommentDoc.userId,
          senderId: userId,
          type: 'comment_reply',
          postId: post._id,
          commentId: comment._id,
          message: `${req.user.username} respondió a tu comentario`
        });
      }
    }

    // Poblar información del usuario para la respuesta
    await comment.populate('userId', 'username fullName profileImage isVerified');

    res.status(201).json({
      message: 'Comentario creado exitosamente',
      comment
    });

  } catch (error) {
    console.error('Error creando comentario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener comentarios de un post
const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Verificar que el post exists
    const post = await Post.findById(postId);
    if (!post || !post.isActive) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Obtener comentarios principales (no respuestas)
    const comments = await Comment.find({ 
      postId, 
      isActive: true, 
      parentComment: null 
    })
    .populate('userId', 'username fullName profileImage isVerified')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

    // Para cada comentario, obtener algunas respuestas
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentComment: comment._id,
          isActive: true
        })
        .populate('userId', 'username fullName profileImage isVerified')
        .sort({ createdAt: 1 })
        .limit(3)
        .lean();

        const repliesCount = await Comment.countDocuments({
          parentComment: comment._id,
          isActive: true
        });

        return {
          ...comment,
          replies,
          repliesCount,
          hasMoreReplies: repliesCount > 3
        };
      })
    );

    res.json({
      comments: commentsWithReplies,
      pagination: {
        page,
        limit,
        hasMore: comments.length === limit
      }
    });

  } catch (error) {
    console.error('Error obteniendo comentarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener respuestas de un comentario
const getReplies = async (req, res) => {
  try {
    const { commentId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const replies = await Comment.getReplies(commentId, page, limit);

    res.json({
      replies,
      pagination: {
        page,
        limit,
        hasMore: replies.length === limit
      }
    });

  } catch (error) {
    console.error('Error obteniendo respuestas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Dar/quitar like a un comentario
const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment || !comment.isActive) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    const isLiked = comment.likes.includes(userId);
    
    if (isLiked) {
      // Quitar like
      comment.likes.pull(userId);
      comment.likesCount = Math.max(0, comment.likesCount - 1);
    } else {
      // Dar like
      comment.likes.push(userId);
      comment.likesCount += 1;
    }

    await comment.save();

    res.json({
      message: isLiked ? 'Like eliminado' : 'Like agregado',
      isLiked: !isLiked,
      likesCount: comment.likesCount
    });

  } catch (error) {
    console.error('Error toggle like comentario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar comentario
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    // Verificar que el usuario sea el propietario del comentario
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'No tienes permisos para eliminar este comentario' });
    }

    // Soft delete
    comment.isActive = false;
    await comment.save();

    // Actualizar contador de comentarios del post
    const post = await Post.findById(comment.postId);
    if (post) {
      post.commentsCount = Math.max(0, post.commentsCount - 1);
      await post.save();
    }

    res.json({ message: 'Comentario eliminado exitosamente' });

  } catch (error) {
    console.error('Error eliminando comentario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  createComment,
  getComments,
  getReplies,
  toggleCommentLike,
  deleteComment
};
