const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// Buscar usuarios
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ message: 'La búsqueda debe tener al menos 2 caracteres' });
    }

    const searchRegex = new RegExp(query.trim(), 'i');
    
    const users = await User.find({
      $or: [
        { username: searchRegex },
        { fullName: searchRegex }
      ]
    })
    .select('username fullName profileImage isVerified followersCount')
    .skip(skip)
    .limit(limit)
    .lean();

    res.json({
      users,
      pagination: {
        page,
        limit,
        hasMore: users.length === limit
      }
    });

  } catch (error) {
    console.error('Error buscando usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener perfil de usuario por username
const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user?._id;

    const user = await User.findOne({ username })
      .select('-password -email')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el usuario actual sigue a este usuario
    const isFollowing = currentUserId ? user.followers.includes(currentUserId) : false;
    
    // Verificar si este usuario sigue al usuario actual
    const followsYou = currentUserId ? user.following.includes(currentUserId) : false;

    // Si es perfil privado y no lo sigue, no mostrar información completa
    const isOwnProfile = currentUserId && currentUserId.toString() === user._id.toString();
    const canViewFullProfile = !user.isPrivate || isFollowing || isOwnProfile;

    const profileData = {
      ...user,
      isFollowing,
      followsYou,
      isOwnProfile,
      canViewPosts: canViewFullProfile
    };

    // Si no puede ver el perfil completo, limitar información
    if (!canViewFullProfile) {
      profileData.postsCount = 0;
      profileData.bio = '';
    }

    res.json({ user: profileData });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Seguir/dejar de seguir usuario
const toggleFollow = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user._id;

    const targetUser = await User.findOne({ username });
    if (!targetUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (targetUser._id.toString() === currentUserId.toString()) {
      return res.status(400).json({ message: 'No puedes seguirte a ti mismo' });
    }

    const currentUser = await User.findById(currentUserId);
    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      // Dejar de seguir
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUserId);
      currentUser.followingCount = Math.max(0, currentUser.followingCount - 1);
      targetUser.followersCount = Math.max(0, targetUser.followersCount - 1);
    } else {
      // Seguir
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUserId);
      currentUser.followingCount += 1;
      targetUser.followersCount += 1;

      // Crear notificación
      await Notification.createNotification({
        recipientId: targetUser._id,
        senderId: currentUserId,
        type: 'follow',
        message: `${currentUser.username} comenzó a seguirte`
      });
    }

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.json({
      message: isFollowing ? 'Usuario no seguido' : 'Usuario seguido',
      isFollowing: !isFollowing,
      followersCount: targetUser.followersCount
    });

  } catch (error) {
    console.error('Error toggle follow:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener seguidores de un usuario
const getFollowers = async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ username }).select('followers isPrivate');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar permisos de privacidad
    const canView = !user.isPrivate || 
                   (req.user && req.user._id.toString() === user._id.toString());

    if (!canView) {
      return res.status(403).json({ message: 'Este perfil es privado' });
    }

    const followers = await User.find({ _id: { $in: user.followers } })
      .select('username fullName profileImage isVerified followersCount')
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      followers,
      pagination: {
        page,
        limit,
        hasMore: followers.length === limit
      }
    });

  } catch (error) {
    console.error('Error obteniendo seguidores:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener usuarios seguidos
const getFollowing = async (req, res) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ username }).select('following isPrivate');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar permisos de privacidad
    const canView = !user.isPrivate || 
                   (req.user && req.user._id.toString() === user._id.toString());

    if (!canView) {
      return res.status(403).json({ message: 'Este perfil es privado' });
    }

    const following = await User.find({ _id: { $in: user.following } })
      .select('username fullName profileImage isVerified followersCount')
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      following,
      pagination: {
        page,
        limit,
        hasMore: following.length === limit
      }
    });

  } catch (error) {
    console.error('Error obteniendo seguidos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener usuarios sugeridos
const getSuggestedUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    const currentUser = await User.findById(currentUserId).select('following');
    const followingIds = currentUser.following;

    // Buscar usuarios que no sigue y que tienen seguidores en común
    const suggestedUsers = await User.find({
      _id: { 
        $nin: [...followingIds, currentUserId] // Excluir usuarios que ya sigue y a sí mismo
      },
      followersCount: { $gte: 1 } // Usuarios con al menos 1 seguidor
    })
    .select('username fullName profileImage isVerified followersCount')
    .sort({ followersCount: -1 }) // Ordenar por popularidad
    .limit(limit)
    .lean();

    res.json({ suggestedUsers });

  } catch (error) {
    console.error('Error obteniendo usuarios sugeridos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  searchUsers,
  getUserProfile,
  toggleFollow,
  getFollowers,
  getFollowing,
  getSuggestedUsers
};
