const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Update likes count method
commentSchema.methods.updateLikesCount = async function() {
  this.likesCount = this.likes.length;
  await this.save();
};

// Get replies for a comment
commentSchema.statics.getReplies = async function(commentId, page = 1, limit = 5) {
  const skip = (page - 1) * limit;
  
  return this.find({
    parentComment: commentId,
    isActive: true
  })
  .populate('userId', 'username fullName profileImage isVerified')
  .sort({ createdAt: 1 })
  .skip(skip)
  .limit(limit)
  .lean();
};

// Create indexes
commentSchema.index({ postId: 1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ createdAt: -1 });
commentSchema.index({ isActive: 1 });

module.exports = mongoose.model('Comment', commentSchema);
