const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Profile routes
router.get('/me', authMiddleware, authController.getMe);
router.put('/me', authMiddleware, authController.updateMe);

module.exports = router;
