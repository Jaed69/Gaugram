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

    // Crear el post con la imagen almacenada en Base64
    const post = new Post({
      userId,
      imageData: req.processedImage.data,
      imageType: req.processedImage.type,
      imageName: req.processedImage.name,
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

    // Actualizar la imagen de perfil del usuario con datos Base64
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        profileImageData: req.processedImage.data,
        profileImageType: req.processedImage.type,
        profileImageName: req.processedImage.name
      },
      { new: true, select: '-password' }
    );

    res.json({
      message: 'Imagen de perfil actualizada',
      profileImage: `data:${req.processedImage.type};base64,${req.processedImage.data}`,
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

// Servir imagen de post desde la base de datos
router.get('/post/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).select('imageData imageType imageName');
    
    if (!post || !post.imageData) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    // Convertir Base64 a Buffer
    const imageBuffer = Buffer.from(post.imageData, 'base64');
    
    // Configurar headers
    res.set({
      'Content-Type': post.imageType || 'image/jpeg',
      'Content-Length': imageBuffer.length,
      'Cache-Control': 'public, max-age=86400' // Cache por 24 horas
    });

    res.send(imageBuffer);
  } catch (error) {
    console.error('Error sirviendo imagen de post:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Servir imagen de perfil desde la base de datos
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('profileImageData profileImageType profileImageName');
    
    if (!user || !user.profileImageData) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    // Convertir Base64 a Buffer
    const imageBuffer = Buffer.from(user.profileImageData, 'base64');
    
    // Configurar headers
    res.set({
      'Content-Type': user.profileImageType || 'image/jpeg',
      'Content-Length': imageBuffer.length,
      'Cache-Control': 'public, max-age=86400' // Cache por 24 horas
    });

    res.send(imageBuffer);
  } catch (error) {
    console.error('Error sirviendo imagen de perfil:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
