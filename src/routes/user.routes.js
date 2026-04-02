const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// All user routes require admin role
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

router.get('/', userController.getAllUsers);
router.put('/:id/role', userController.updateUserRole);
router.put('/:id/status', userController.toggleUserStatus);

module.exports = router;
