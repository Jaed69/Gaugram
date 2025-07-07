const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all posts (feed)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isActive: true })
      .populate('userId', 'username fullName profileImage isVerified')
      .populate('likes', 'username fullName')
      .populate('comments.author', 'username fullName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get posts by user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Verificar si el userId es válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    // Buscar posts
    const posts = await Post.find({ userId, isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username fullName profileImage isVerified');

    // Enviar respuesta
    const response = posts.map(p => ({
      _id: p._id,
      imageUrl: p.imageUrl,
      content: p.content,
      caption: p.caption,
      likesCount: p.likesCount,
      commentsCount: p.commentsCount,
      createdAt: p.createdAt,
      location: p.location,
      hashtags: p.hashtags,
      userId: p.userId
    }));

    res.json(response);
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single post
router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findOne({ 
      _id: req.params.postId, 
      isActive: true 
    })
    .populate('userId', 'username fullName profileImage isVerified')
    .populate('likes', 'username fullName');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/Unlike post
router.post('/:postId/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const likeIndex = post.likes.findIndex(userId => 
      userId.toString() === req.userId
    );

    let liked;
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
      liked = false;
    } else {
      // Like
      post.likes.push(req.userId);
      liked = true;
    }

    post.likesCount = post.likes.length;
    await post.save();

    res.json({ 
      message: liked ? 'Post liked' : 'Post unliked',
      liked: liked,
      likesCount: post.likesCount
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add comment to post
router.post('/:postId/comment', authMiddleware, [
  body('content').isLength({ min: 1, max: 500 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = {
      content: req.body.content,
      author: req.userId,
      createdAt: new Date()
    };

    post.comments.push(comment);
    post.commentsCount = post.comments.length;
    await post.save();

    // Populate the newly added comment
    const updatedPost = await Post.findById(post._id)
      .populate('userId', 'username fullName profileImage isVerified')
      .populate('comments.author', 'username fullName profileImage');

    res.json({
      message: 'Comment added successfully',
      comment: updatedPost.comments[updatedPost.comments.length - 1],
      commentsCount: updatedPost.commentsCount
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get comments for a post
router.get('/:postId/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('comments.author', 'username fullName profileImage isVerified')
      .select('comments');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post.comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new post
router.post('/', authMiddleware, [
  body('content').optional().isLength({ min: 0, max: 2200 }).trim(),
  body('caption').optional().isLength({ min: 0, max: 500 }).trim(),
  body('location').optional().isLength({ min: 0, max: 100 }).trim(),
  body('imageUrl').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, caption, location, imageUrl } = req.body;

    // Validar que tenga al menos contenido o imagen
    if (!imageUrl && !content?.trim() && !caption?.trim()) {
      return res.status(400).json({ 
        error: 'El post debe tener al menos una imagen, contenido de texto o caption' 
      });
    }

    const post = new Post({
      userId: req.userId,
      content: content || '',
      caption: caption || '',
      location: location || '',
      imageUrl: imageUrl || null
    });

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('userId', 'username fullName profileImage isVerified');

    res.status(201).json({ post: populatedPost });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
