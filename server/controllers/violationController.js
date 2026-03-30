const Violation = require('../models/Violation');
const StudySession = require('../models/StudySession');

// @desc    Log violation
// @route   POST /api/violations
// @access  Private
const logViolation = async (req, res) => {
  try {
    const { session, violationType, details } = req.body;

    // Verify session belongs to user
    const studySession = await StudySession.findById(session);

    if (!studySession) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (studySession.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Calculate penalty based on violation type
    const penaltyMap = {
      'tab-switch': 5,
      'fullscreen-exit': 10,
      'window-minimize': 10,
      'notification-interaction': 3,
      'blocked-website-attempt': 7,
      'app-background': 8,
    };

    const violation = await Violation.create({
      user: req.user._id,
      session,
      violationType,
      details,
      penaltyPoints: penaltyMap[violationType] || 5,
    });

    // Update session violation count and focus score
    studySession.violationsCount += 1;
    studySession.focusScore = Math.max(0, studySession.focusScore - violation.penaltyPoints);
    await studySession.save();

    res.status(201).json(violation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get violations for user
// @route   GET /api/violations
// @access  Private
const getViolations = async (req, res) => {
  try {
    const { startDate, endDate, violationType, limit = 100 } = req.query;

    let query = { user: req.user._id };

    if (violationType) {
      query.violationType = violationType;
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const violations = await Violation.find(query)
      .populate('session', 'sessionType startTime')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json(violations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get violations for specific session
// @route   GET /api/violations/session/:sessionId
// @access  Private
const getSessionViolations = async (req, res) => {
  try {
    const violations = await Violation.find({
      session: req.params.sessionId,
      user: req.user._id,
    }).sort({ timestamp: 1 });

    res.json(violations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get violation statistics
// @route   GET /api/violations/stats
// @access  Private
const getViolationStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let matchQuery = { user: req.user._id };

    if (startDate || endDate) {
      matchQuery.timestamp = {};
      if (startDate) matchQuery.timestamp.$gte = new Date(startDate);
      if (endDate) matchQuery.timestamp.$lte = new Date(endDate);
    }

    const stats = await Violation.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$violationType',
          count: { $sum: 1 },
          totalPenalty: { $sum: '$penaltyPoints' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const totalViolations = await Violation.countDocuments(matchQuery);

    res.json({
      totalViolations,
      byType: stats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  logViolation,
  getViolations,
  getSessionViolations,
  getViolationStats,
};
