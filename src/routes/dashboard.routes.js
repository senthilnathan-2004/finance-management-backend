const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);

// All authenticated roles (viewer, analyzer, admin) can view the dashboard summary
router.get('/summary', roleMiddleware('viewer', 'analyzer', 'admin'), dashboardController.getSummary);

module.exports = router;
