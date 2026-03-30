const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getDailyFocusData,
  getProductivityTrends,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboardAnalytics);
router.get('/daily-focus', protect, getDailyFocusData);
router.get('/trends', protect, getProductivityTrends);

module.exports = router;
