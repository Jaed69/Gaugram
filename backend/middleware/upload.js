const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Crear directorios si no existen
const createDirectories = () => {
  const dirs = [
    path.join(__dirname, '../uploads'),
    path.join(__dirname, '../uploads/posts'),
    path.join(__dirname, '../uploads/profiles'),
    path.join(__dirname, '../uploads/temp')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createDirectories();

// Configuración de almacenamiento temporal
const storage = multer.memoryStorage();

// Filtro para validar tipos de archivo
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

// Configuración de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
  }
});

// Middleware para procesar imagen de post
const processPostImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }

  try {
    const filename = `post_${uuidv4()}.jpg`;
    const filepath = path.join(__dirname, '../uploads/posts', filename);

    // Procesar imagen: redimensionar y optimizar
    await sharp(req.file.buffer)
      .resize(1080, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 90 })
      .toFile(filepath);

    // Agregar información de archivo procesado al request
    req.processedImage = {
      filename: filename,
      path: filepath,
      url: `/uploads/posts/${filename}`
    };

    next();
  } catch (error) {
    console.error('Error procesando imagen:', error);
    res.status(500).json({ error: 'Error procesando imagen' });
  }
};

// Middleware para procesar imagen de perfil
const processProfileImage = async (req, res, next) => {
  if (!req.file) {
    return next(); // Imagen de perfil es opcional
  }

  try {
    const filename = `profile_${uuidv4()}.jpg`;
    const filepath = path.join(__dirname, '../uploads/profiles', filename);

    // Procesar imagen: hacer cuadrada y optimizar
    await sharp(req.file.buffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toFile(filepath);

    // Agregar información de archivo procesado al request
    req.processedImage = {
      filename: filename,
      path: filepath,
      url: `/uploads/profiles/${filename}`
    };

    next();
  } catch (error) {
    console.error('Error procesando imagen de perfil:', error);
    res.status(500).json({ error: 'Error procesando imagen de perfil' });
  }
};

// Función para eliminar archivo
const deleteFile = (filepath) => {
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
};

module.exports = {
  upload,
  processPostImage,
  processProfileImage,
  deleteFile
};
