const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/auth');
const { validateComment } = require('../middleware/validation');

// Todas las rutas requieren autenticación
router.post('/post/:postId', authenticateToken, validateComment, commentController.createComment);
router.get('/post/:postId', authenticateToken, commentController.getComments);
router.get('/:commentId/replies', authenticateToken, commentController.getReplies);
router.post('/:commentId/like', authenticateToken, commentController.toggleCommentLike);
router.delete('/:commentId', authenticateToken, commentController.deleteComment);

module.exports = router;
