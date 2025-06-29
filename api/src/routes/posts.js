const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validateCreatePost } = require('../middleware/validation');

// Rutas protegidas (requieren autenticación)
router.post('/', authenticateToken, validateCreatePost, postController.createPost);
router.get('/feed', authenticateToken, postController.getFeed);
router.post('/:postId/like', authenticateToken, postController.toggleLike);
router.delete('/:postId', authenticateToken, postController.deletePost);

// Rutas públicas (autenticación opcional)
router.get('/user/:username', optionalAuth, postController.getUserPosts);
router.get('/:postId', optionalAuth, postController.getPost);

module.exports = router;
