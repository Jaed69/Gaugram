const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  bio: {
    type: String,
    default: '',
    maxlength: 150,
    trim: true
  },
  profileImage: {
    type: String,
    default: 'https://via.placeholder.com/300x300?text=Profile'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  postsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  followersCount: {
    type: Number,
    default: 0,
    min: 0
  },
  followingCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para actualizar contadores
userSchema.methods.updateCounters = async function() {
  try {
    const Post = require('./Post');
    
    this.followersCount = this.followers.length;
    this.followingCount = this.following.length;
    
    // Contar posts del usuario
    const postsCount = await Post.countDocuments({ userId: this._id, isActive: true });
    this.postsCount = postsCount;
    
    // Evitar bucle infinito - solo guardar si hay cambios
    if (this.isModified('followersCount') || this.isModified('followingCount') || this.isModified('postsCount')) {
      return this.save();
    }
    
    return this;
  } catch (error) {
    console.error('Error updating counters:', error);
    return this;
  }
};

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
