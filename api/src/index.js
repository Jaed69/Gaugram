// api/src/index.js
// Cargar variables de entorno
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Importar rutas
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const commentRoutes = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB URI - usar variable de entorno o default para Docker
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/gaugram';

// Middleware de seguridad
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 requests por ventana por IP
  message: 'Demasiadas solicitudes, intenta de nuevo más tarde'
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Conectar a MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('🍃 MongoDB conectado exitosamente');
    console.log('🌐 Base de datos: gaugram');
  })
  .catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err);
    process.exit(1);
  });

// Configuración de mongoose
mongoose.set('strictQuery', false);

// --- RUTAS DE LA API ---

// Ruta de estado/salud
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Gaugram API está funcionando!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      posts: '/api/posts',
      users: '/api/users',
      comments: '/api/comments'
    }
  });
});

// Ruta de estado de la base de datos
app.get('/api/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    res.json({
      status: 'OK',
      database: dbStates[dbState],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Configurar rutas
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

// Ruta de posts legacy (compatibilidad con la versión anterior)
app.get('/api/posts', async (req, res) => {
  res.json({
    message: 'Esta ruta ha sido movida. Usa /api/posts/feed para obtener el feed de posts',
    newEndpoint: '/api/posts/feed'
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      message: 'Error de validación',
      errors
    });
  }
  
  // Error de cast de Mongoose (ObjectId inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'ID inválido'
    });
  }
  
  // Error de duplicado (unique constraint)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      message: `El ${field} ya está en uso`
    });
  }
  
  // Error genérico
  res.status(500).json({
    message: 'Error interno del servidor'
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada',
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/profile',
      'GET /api/posts/feed',
      'POST /api/posts',
      'GET /api/users/:username',
      'POST /api/comments/post/:postId'
    ]
  });
});

// Manejar cierre graceful
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM recibido, cerrando servidor...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT recibido, cerrando servidor...');
  await mongoose.connection.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Gaugram corriendo en puerto ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:4200'}`);
  console.log(`🔗 API Health Check: http://localhost:${PORT}/api/health`);
});
