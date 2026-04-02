const express = require('express');
const router = express.Router();
const recordController = require('../controllers/record.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);

// admin only routes
router.post('/', roleMiddleware('admin'), recordController.createRecord);
router.put('/:id', roleMiddleware('admin'), recordController.updateRecord);
router.delete('/:id', roleMiddleware('admin'), recordController.deleteRecord);

// analyzer and admin routes for reading
router.get('/', roleMiddleware('analyzer', 'admin'), recordController.getRecords);
router.get('/:id', roleMiddleware('analyzer', 'admin'), recordController.getRecordById);

module.exports = router;
