const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Rutas que requieren autenticación
router.get('/search', authenticateToken, userController.searchUsers);
router.post('/:username/follow', authenticateToken, userController.toggleFollow);
router.get('/suggestions', authenticateToken, userController.getSuggestedUsers);

// Rutas públicas (autenticación opcional)
router.get('/:username', optionalAuth, userController.getUserProfile);
router.get('/:username/followers', optionalAuth, userController.getFollowers);
router.get('/:username/following', optionalAuth, userController.getFollowing);

module.exports = router;
