const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // Almacenar imagen como datos binarios en Base64
  imageData: {
    type: String, // Base64 encoded image data
    required: false,
    default: null
  },
  imageType: {
    type: String, // MIME type (image/jpeg, image/png, etc.)
    required: false,
    default: null
  },
  imageName: {
    type: String, // Nombre original del archivo
    required: false,
    default: null
  },
  // Mantener imageUrl para compatibilidad pero será generada dinámicamente
  imageUrl: {
    type: String,
    required: false,
    default: null
  },
  content: {
    type: String,
    maxlength: 2200,
    trim: true
  },
  caption: {
    type: String,
    default: '',
    maxlength: 500,
    trim: true
  },
  hashtags: [{
    type: String,
    lowercase: true
  }],
  location: {
    type: String,
    maxlength: 100,
    trim: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    content: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  likesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  commentsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices
postSchema.index({ userId: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ isActive: 1 });

// Extraer hashtags automáticamente del caption
postSchema.pre('save', function(next) {
  if (this.isModified('caption') && this.caption) {
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const extractedHashtags = this.caption.match(hashtagRegex) || [];
    this.hashtags = [...new Set(extractedHashtags.map(tag => tag.toLowerCase()))];
  }
  next();
});

// Validación personalizada: al menos debe tener imagen o contenido de texto
postSchema.pre('validate', function(next) {
  if (!this.imageUrl && !this.content && !this.caption) {
    this.invalidate('content', 'El post debe tener al menos una imagen, contenido de texto o caption');
  }
  next();
});

// Método para actualizar contadores
postSchema.methods.updateCounters = async function() {
  this.likesCount = this.likes.length;
  this.commentsCount = this.comments.length;
  return this.save();
};

module.exports = mongoose.model('Post', postSchema);
