const express = require('express');
const router = express.Router();
const { upload, processPostImage, processProfileImage } = require('../middleware/upload');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// Subir imagen para post
router.post('/post', auth, upload.single('image'), processPostImage, async (req, res) => {
  try {
    const { caption, location } = req.body;
    const userId = req.userId;

    if (!req.processedImage) {
      return res.status(400).json({ error: 'No se procesó la imagen correctamente' });
    }

    // Crear el post con la imagen
    const post = new Post({
      userId,
      imageUrl: req.processedImage.url,
      caption: caption || '',
      location: location || ''
    });

    await post.save();

    // Actualizar contador de posts del usuario
    await User.findByIdAndUpdate(userId, { $inc: { postsCount: 1 } });

    // Poblar información del usuario
    await post.populate('userId', 'username fullName profileImage isVerified');

    res.status(201).json({
      message: 'Post creado exitosamente',
      post,
      imageUrl: req.processedImage.url
    });
  } catch (error) {
    console.error('Error creando post:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Subir imagen de perfil
router.post('/profile', auth, upload.single('profileImage'), processProfileImage, async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.processedImage) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }

    // Actualizar la imagen de perfil del usuario
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: req.processedImage.url },
      { new: true, select: '-password' }
    );

    res.json({
      message: 'Imagen de perfil actualizada',
      profileImage: req.processedImage.url,
      user
    });
  } catch (error) {
    console.error('Error actualizando imagen de perfil:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Obtener imagen (servir archivos estáticos)
router.get('/posts/:filename', (req, res) => {
  const { filename } = req.params;
  const path = require('path');
  const filePath = path.join(__dirname, '../uploads/posts', filename);
  
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Imagen no encontrada' });
    }
  });
});

router.get('/profiles/:filename', (req, res) => {
  const { filename } = req.params;
  const path = require('path');
  const filePath = path.join(__dirname, '../uploads/profiles', filename);
  
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Imagen no encontrada' });
    }
  });
});

module.exports = router;
