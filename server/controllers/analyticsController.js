const StudySession = require('../models/StudySession');
const Violation = require('../models/Violation');
const Task = require('../models/Task');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = await StudySession.find({
      user: userId,
      startTime: { $gte: today },
      sessionType: 'focus',
    });

    const todayMinutes = todaySessions.reduce((acc, session) => acc + (session.actualDuration || 0), 0);
    const todaySessionsCount = todaySessions.filter(s => s.completed).length;

    // This week's stats
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const weekSessions = await StudySession.find({
      user: userId,
      startTime: { $gte: weekAgo },
      sessionType: 'focus',
    });

    const weekMinutes = weekSessions.reduce((acc, session) => acc + (session.actualDuration || 0), 0);

    // Violations this week
    const weekViolations = await Violation.countDocuments({
      user: userId,
      timestamp: { $gte: weekAgo },
    });

    // Tasks stats
    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({ user: userId, completed: true });
    const pendingTasks = totalTasks - completedTasks;

    // Average focus score
    const completedSessions = weekSessions.filter(s => s.completed);
    const avgFocusScore = completedSessions.length > 0
      ? Math.round(completedSessions.reduce((acc, s) => acc + s.focusScore, 0) / completedSessions.length)
      : 100;

    res.json({
      today: {
        focusMinutes: todayMinutes,
        sessionsCompleted: todaySessionsCount,
      },
      week: {
        focusMinutes: weekMinutes,
        sessionsCompleted: completedSessions.length,
        violations: weekViolations,
        avgFocusScore,
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
      },
      user: {
        focusScore: req.user.focusScore,
        currentStreak: req.user.currentStreak,
        longestStreak: req.user.longestStreak,
        totalFocusMinutes: req.user.totalFocusMinutes,
        totalSessions: req.user.totalSessions,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get daily focus data for chart
// @route   GET /api/analytics/daily-focus
// @access  Private
const getDailyFocusData = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const userId = req.user._id;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const sessions = await StudySession.find({
      user: userId,
      startTime: { $gte: startDate },
      sessionType: 'focus',
      completed: true,
    });

    // Group by date
    const dailyData = {};

    for (let i = 0; i < parseInt(days); i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = {
        date: dateStr,
        minutes: 0,
        sessions: 0,
        violations: 0,
      };
    }

    sessions.forEach(session => {
      const dateStr = new Date(session.startTime).toISOString().split('T')[0];
      if (dailyData[dateStr]) {
        dailyData[dateStr].minutes += session.actualDuration || 0;
        dailyData[dateStr].sessions += 1;
        dailyData[dateStr].violations += session.violationsCount || 0;
      }
    });

    const chartData = Object.values(dailyData).reverse();

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get productivity trends
// @route   GET /api/analytics/trends
// @access  Private
const getProductivityTrends = async (req, res) => {
  try {
    const userId = req.user._id;

    // Last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessions = await StudySession.find({
      user: userId,
      startTime: { $gte: thirtyDaysAgo },
      sessionType: 'focus',
      completed: true,
    });

    // Calculate weekly averages
    const weeks = {};

    sessions.forEach(session => {
      const weekStart = new Date(session.startTime);
      const day = weekStart.getDay();
      weekStart.setDate(weekStart.getDate() - day);
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          week: weekKey,
          totalMinutes: 0,
          sessionCount: 0,
          avgFocusScore: 0,
          sessions: [],
        };
      }

      weeks[weekKey].totalMinutes += session.actualDuration || 0;
      weeks[weekKey].sessionCount += 1;
      weeks[weekKey].sessions.push(session.focusScore);
    });

    // Calculate averages
    Object.keys(weeks).forEach(weekKey => {
      const week = weeks[weekKey];
      week.avgFocusScore = Math.round(
        week.sessions.reduce((a, b) => a + b, 0) / week.sessions.length
      );
      delete week.sessions;
    });

    const trends = Object.values(weeks).sort((a, b) =>
      new Date(a.week) - new Date(b.week)
    );

    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardAnalytics,
  getDailyFocusData,
  getProductivityTrends,
};
