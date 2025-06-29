// api/src/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Post = require('./models/Post');

const app = express();
const PORT = process.env.PORT || 3000;
// ¡Importante! 'mongo' es el nombre del servicio en docker-compose.yml
const MONGO_URI = 'mongodb://mongo:27017/socialdb';

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB conectado exitosamente.'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// --- RUTAS DE LA API ---

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡La API está funcionando!');
});

// Obtener todos los posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un nuevo post
app.post('/api/posts', async (req, res) => {
  const post = new Post({
    content: req.body.content,
    author: req.body.author || 'Usuario Anónimo'
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
