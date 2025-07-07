// Script para crear posts de prueba directamente en la base de datos
const mongoose = require('mongoose');
const Post = require('./backend/models/Post');
const User = require('./backend/models/User');

async function createTestPosts() {
  try {
    // Conectar a MongoDB
    await mongoose.connect('mongodb://admin:password@localhost:27017/gaugram_db?authSource=admin');
    console.log('✅ Conectado a MongoDB');

    // Buscar usuario de prueba
    const user = await User.findOne({ username: 'usuario001' });
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log('✅ Usuario encontrado:', user.username);

    // Crear posts de prueba
    const testPosts = [
      {
        userId: user._id,
        content: 'Este es mi primer post de solo texto en Gaugram!',
        caption: 'Probando la funcionalidad de posts de texto',
        location: 'Lima, Perú'
      },
      {
        userId: user._id,
        content: 'Otro post de texto para probar la funcionalidad',
        caption: 'Segunda prueba',
        location: 'Miraflores, Lima'
      },
      {
        userId: user._id,
        content: 'Post de texto sin ubicación',
        caption: 'Tercer post de prueba'
      }
    ];

    for (const postData of testPosts) {
      const post = new Post(postData);
      await post.save();
      console.log('✅ Post creado:', post._id);
    }

    console.log('✅ Todos los posts de prueba creados');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}

createTestPosts();
