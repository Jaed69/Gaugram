// Script para verificar posts en la base de datos
const mongoose = require('mongoose');

// Definir esquemas básicos
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  fullName: String,
  postsCount: { type: Number, default: 0 }
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  caption: String,
  imageUrl: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

async function checkDatabase() {
  try {
    // Conectar a MongoDB
    await mongoose.connect('mongodb://admin:password@localhost:27017/gaugram_db?authSource=admin');
    console.log('✅ Conectado a MongoDB');

    // Listar todos los usuarios
    const users = await User.find({}).select('username email fullName postsCount');
    console.log('\n=== USUARIOS ===');
    users.forEach(user => {
      console.log(`- ${user.username} (${user.email}) - Posts: ${user.postsCount || 0} - ID: ${user._id}`);
    });

    // Listar todos los posts
    const posts = await Post.find({ isActive: true }).populate('userId', 'username email');
    console.log('\n=== POSTS ===');
    console.log(`Total posts activos: ${posts.length}`);
    
    posts.forEach(post => {
      console.log(`- Post ID: ${post._id}`);
      console.log(`  Usuario: ${post.userId?.username || 'N/A'} (${post.userId?._id || 'N/A'})`);
      console.log(`  Contenido: ${post.content?.substring(0, 50) || 'Sin contenido'}...`);
      console.log(`  Caption: ${post.caption?.substring(0, 50) || 'Sin caption'}...`);
      console.log(`  Imagen: ${post.imageUrl ? 'Sí' : 'No'}`);
      console.log(`  Fecha: ${post.createdAt}`);
      console.log('---');
    });

    // Verificar posts por usuario
    console.log('\n=== POSTS POR USUARIO ===');
    for (const user of users) {
      const userPosts = await Post.find({ userId: user._id, isActive: true });
      console.log(`${user.username}: ${userPosts.length} posts`);
      
      if (userPosts.length !== user.postsCount) {
        console.log(`  ⚠️  Inconsistencia: BD dice ${userPosts.length}, usuario dice ${user.postsCount}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDesconectado de MongoDB');
  }
}

checkDatabase();
