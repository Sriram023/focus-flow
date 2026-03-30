const StudySession = require('../models/StudySession');
const User = require('../models/User');

// @desc    Get all sessions for user
// @route   GET /api/sessions
// @access  Private
const getSessions = async (req, res) => {
  try {
    const { startDate, endDate, limit = 50 } = req.query;

    let query = { user: req.user._id };

    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }

    const sessions = await StudySession.find(query)
      .populate('task', 'title')
      .sort({ startTime: -1 })
      .limit(parseInt(limit));

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new session
// @route   POST /api/sessions
// @access  Private
const createSession = async (req, res) => {
  try {
    const { task, sessionType, plannedDuration, sessionNumber } = req.body;

    const session = await StudySession.create({
      user: req.user._id,
      task,
      sessionType,
      plannedDuration,
      startTime: new Date(),
      sessionNumber,
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete session
// @route   PUT /api/sessions/:id/complete
// @access  Private
const completeSession = async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { actualDuration, violationsCount, focusScore, notes } = req.body;

    session.completed = true;
    session.endTime = new Date();
    session.actualDuration = actualDuration || session.plannedDuration;
    session.violationsCount = violationsCount || 0;
    session.focusScore = focusScore || (100 - (violationsCount * 5));
    session.notes = notes;

    await session.save();

    // Update user stats
    if (session.sessionType === 'focus') {
      const user = await User.findById(req.user._id);
      user.totalFocusMinutes += session.actualDuration;
      user.totalSessions += 1;

      // Update streak
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastSessionDate = user.lastSessionDate ? new Date(user.lastSessionDate) : null;

      if (lastSessionDate) {
        lastSessionDate.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today - lastSessionDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          // Same day, don't change streak
        } else if (diffDays === 1) {
          // Consecutive day
          user.currentStreak += 1;
          if (user.currentStreak > user.longestStreak) {
            user.longestStreak = user.currentStreak;
          }
        } else {
          // Streak broken
          user.currentStreak = 1;
        }
      } else {
        user.currentStreak = 1;
      }

      user.lastSessionDate = new Date();

      // Update focus score (weighted average)
      const totalSessions = user.totalSessions;
      user.focusScore = Math.round(
        (user.focusScore * (totalSessions - 1) + session.focusScore) / totalSessions
      );

      await user.save();
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Terminate session (when focus broken)
// @route   PUT /api/sessions/:id/terminate
// @access  Private
const terminateSession = async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const now = new Date();
    const startTime = new Date(session.startTime);
    const actualDuration = Math.floor((now - startTime) / 60000); // minutes

    session.completed = false;
    session.endTime = now;
    session.actualDuration = actualDuration;
    session.focusScore = 0;

    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get session by ID
// @route   GET /api/sessions/:id
// @access  Private
const getSessionById = async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.id)
      .populate('task', 'title description')
      .populate('user', 'name email');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSessions,
  createSession,
  completeSession,
  terminateSession,
  getSessionById,
};
