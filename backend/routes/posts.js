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
      .populate('userId', 'username fullName profileImageData profileImageType isVerified')
      .populate('likes', 'username fullName')
      .populate('comments.author', 'username fullName profileImageData profileImageType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Generar URLs de imágenes dinámicamente
    const postsWithImages = posts.map(post => {
      const postObj = post.toObject();
      
      // Generar URL de imagen del post si existe
      if (post.imageData) {
        postObj.imageUrl = `/api/upload/post/${post._id}`;
      }
      
      // Generar URL de imagen de perfil del usuario
      if (post.userId && post.userId.profileImageData) {
        postObj.userId.profileImage = `/api/upload/profile/${post.userId._id}`;
      }
      
      // Generar URLs de imágenes de perfil en comentarios
      if (postObj.comments) {
        postObj.comments = postObj.comments.map(comment => {
          if (comment.author && comment.author.profileImageData) {
            comment.author.profileImage = `/api/upload/profile/${comment.author._id}`;
          }
          return comment;
        });
      }
      
      return postObj;
    });

    res.json(postsWithImages);
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
      .populate('userId', 'username fullName profileImageData profileImageType isVerified');

    // Enviar respuesta con URLs de imágenes generadas dinámicamente
    const response = posts.map(p => {
      const postObj = p.toObject();
      
      // Generar URL de imagen del post si existe
      if (p.imageData) {
        postObj.imageUrl = `/api/upload/post/${p._id}`;
      }
      
      // Generar URL de imagen de perfil del usuario
      if (p.userId && p.userId.profileImageData) {
        postObj.userId.profileImage = `/api/upload/profile/${p.userId._id}`;
      }
      
      return {
        _id: postObj._id,
        imageUrl: postObj.imageUrl,
        content: postObj.content,
        caption: postObj.caption,
        likesCount: postObj.likesCount,
        commentsCount: postObj.commentsCount,
        createdAt: postObj.createdAt,
        location: postObj.location,
        hashtags: postObj.hashtags,
        userId: postObj.userId
      };
    });

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
  body('imageData').optional().isString(),
  body('imageType').optional().isString(),
  body('imageName').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, caption, location, imageData, imageType, imageName } = req.body;

    // Validar que tenga al menos contenido o imagen
    if (!imageData && !content?.trim() && !caption?.trim()) {
      return res.status(400).json({ 
        error: 'El post debe tener al menos una imagen, contenido de texto o caption' 
      });
    }

    const post = new Post({
      userId: req.userId,
      content: content || '',
      caption: caption || '',
      location: location || '',
      imageData: imageData || null,
      imageType: imageType || null,
      imageName: imageName || null
    });

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('userId', 'username fullName profileImageData profileImageType isVerified');

    // Generar URLs de imágenes dinámicamente para la respuesta
    const postResponse = populatedPost.toObject();
    if (populatedPost.imageData) {
      postResponse.imageUrl = `/api/upload/post/${populatedPost._id}`;
    }
    if (populatedPost.userId && populatedPost.userId.profileImageData) {
      postResponse.userId.profileImage = `/api/upload/profile/${populatedPost.userId._id}`;
    }

    res.status(201).json({ post: postResponse });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
