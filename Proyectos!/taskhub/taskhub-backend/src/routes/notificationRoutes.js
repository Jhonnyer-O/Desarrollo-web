const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const verifyToken = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', notificationController.getMyNotifications);
router.post('/delete-request/:taskId', notificationController.createDeleteRequest);
router.post('/:id/respond', notificationController.respondNotification);
router.delete('/all', notificationController.deleteAllNotifications);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;