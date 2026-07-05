const express = require('express');
const {
  getMyNotifications,
  markRead,
  markAllRead,
} = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getMyNotifications);
router.put('/read-all', markAllRead);
router.put('/:id/read', markRead);

module.exports = router;
