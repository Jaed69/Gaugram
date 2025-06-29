const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['like', 'comment', 'follow', 'mention', 'comment_reply']
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  // Avoid self-notifications
  if (data.recipientId.toString() === data.senderId.toString()) {
    return null;
  }

  // Check if similar notification already exists (prevent spam)
  const existingNotification = await this.findOne({
    recipientId: data.recipientId,
    senderId: data.senderId,
    type: data.type,
    postId: data.postId,
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
  });

  if (existingNotification) {
    // Update existing notification instead of creating new one
    existingNotification.message = data.message;
    existingNotification.isRead = false;
    existingNotification.createdAt = new Date();
    return await existingNotification.save();
  }

  return await this.create(data);
};

// Static method to get user notifications
notificationSchema.statics.getUserNotifications = async function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  return this.find({ recipientId: userId })
    .populate('senderId', 'username fullName profileImage isVerified')
    .populate('postId', 'imageUrl')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

// Static method to mark notifications as read
notificationSchema.statics.markAsRead = async function(userId, notificationIds = []) {
  const filter = { recipientId: userId };
  
  if (notificationIds.length > 0) {
    filter._id = { $in: notificationIds };
  }
  
  return this.updateMany(filter, { isRead: true });
};

// Create indexes
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ senderId: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ type: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
