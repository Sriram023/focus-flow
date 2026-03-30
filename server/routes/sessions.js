const express = require('express');
const router = express.Router();
const {
  getSessions,
  createSession,
  completeSession,
  terminateSession,
  getSessionById,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getSessions)
  .post(protect, createSession);

router.get('/:id', protect, getSessionById);
router.put('/:id/complete', protect, completeSession);
router.put('/:id/terminate', protect, terminateSession);

module.exports = router;
