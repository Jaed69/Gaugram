const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    maxlength: 2200,
    default: ''
  },
  hashtags: [{
    type: String,
    lowercase: true,
    match: /^#[a-zA-Z0-9_]+$/
  }],
  location: {
    type: String,
    maxlength: 100
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Middleware to extract hashtags from caption
postSchema.pre('save', function(next) {
  if (this.caption) {
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const foundHashtags = this.caption.match(hashtagRegex) || [];
    this.hashtags = [...new Set(foundHashtags.map(tag => tag.toLowerCase()))];
  }
  next();
});

// Update counters method
postSchema.methods.updateCounters = async function() {
  this.likesCount = this.likes.length;
  this.commentsCount = await mongoose.model('Comment').countDocuments({ 
    postId: this._id, 
    isActive: true 
  });
  await this.save();
};

// Static method to get feed posts
postSchema.statics.getFeedPosts = async function(userId, followingIds, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  return this.find({
    $or: [
      { userId: userId },
      { userId: { $in: followingIds } }
    ],
    isActive: true
  })
  .populate('userId', 'username fullName profileImage isVerified')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .lean();
};

// Create indexes
postSchema.index({ userId: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ isActive: 1 });

module.exports = mongoose.model('Post', postSchema);
