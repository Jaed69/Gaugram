const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

// Configuración de almacenamiento temporal en memoria
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

// Middleware para procesar imagen de post y convertir a Base64
const processPostImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }

    // Procesar imagen con Sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(1080, 1080, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Convertir a Base64
    const base64Image = processedImage.toString('base64');
    
    // Agregar datos de imagen procesada al request
    req.processedImage = {
      data: base64Image,
      type: 'image/jpeg',
      name: req.file.originalname,
      size: processedImage.length
    };

    next();
  } catch (error) {
    console.error('Error procesando imagen de post:', error);
    res.status(500).json({ error: 'Error procesando la imagen' });
  }
};

// Middleware para procesar imagen de perfil y convertir a Base64
const processProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(); // Imagen de perfil es opcional
    }

    // Procesar imagen con Sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(400, 400, { 
        fit: 'cover',
        position: 'center' 
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Convertir a Base64
    const base64Image = processedImage.toString('base64');
    
    // Agregar datos de imagen procesada al request
    req.processedImage = {
      data: base64Image,
      type: 'image/jpeg',
      name: req.file.originalname,
      size: processedImage.length
    };

    next();
  } catch (error) {
    console.error('Error procesando imagen de perfil:', error);
    res.status(500).json({ error: 'Error procesando la imagen' });
  }
};

module.exports = {
  upload,
  processPostImage,
  processProfileImage
};
