const express = require('express');
const router = express.Router();
const {
  logViolation,
  getViolations,
  getSessionViolations,
  getViolationStats,
} = require('../controllers/violationController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getViolations)
  .post(protect, logViolation);

router.get('/stats', protect, getViolationStats);
router.get('/session/:sessionId', protect, getSessionViolations);

module.exports = router;
