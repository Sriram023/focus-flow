import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlay, FiTarget, FiTrendingUp, FiAlertTriangle, FiClock } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [dailyFocus, setDailyFocus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [analyticsRes, dailyRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/daily-focus?days=7'),
      ]);

      setAnalytics(analyticsRes.data);
      setDailyFocus(dailyRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartFocus = () => {
    navigate('/focus');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-2xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Header */}
      <header className="bg-white dark:bg-dark-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                FocusFlow
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300">
                Welcome, {user?.name}!
              </span>
              <button
                onClick={() => navigate('/tasks')}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              >
                Tasks
              </button>
              <button
                onClick={() => navigate('/analytics')}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              >
                Analytics
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Focus Score</p>
                <h3 className="text-4xl font-bold mt-2">{analytics?.user?.focusScore || 100}</h3>
              </div>
              <FiTarget className="text-5xl opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Current Streak</p>
                <h3 className="text-4xl font-bold mt-2">{analytics?.user?.currentStreak || 0}</h3>
                <p className="text-blue-100 text-xs mt-1">days</p>
              </div>
              <FiTrendingUp className="text-5xl opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Focus Time</p>
                <h3 className="text-4xl font-bold mt-2">
                  {Math.floor((analytics?.user?.totalFocusMinutes || 0) / 60)}h
                </h3>
                <p className="text-green-100 text-xs mt-1">
                  {(analytics?.user?.totalFocusMinutes || 0) % 60}m
                </p>
              </div>
              <FiClock className="text-5xl opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Violations (Week)</p>
                <h3 className="text-4xl font-bold mt-2">{analytics?.week?.violations || 0}</h3>
              </div>
              <FiAlertTriangle className="text-5xl opacity-50" />
            </div>
          </motion.div>
        </div>

        {/* Chart and CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Daily Focus (Last 7 Days)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyFocus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Start Focus CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-primary rounded-2xl p-8 text-white shadow-lg flex flex-col justify-center items-center text-center"
          >
            <FiPlay className="text-6xl mb-4" />
            <h3 className="text-2xl font-bold mb-2">Ready to Focus?</h3>
            <p className="text-sm opacity-90 mb-6">
              Start a new focus session and boost your productivity
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartFocus}
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold shadow-xl hover:shadow-2xl transition-shadow"
            >
              Start Focus Mode
            </motion.button>
          </motion.div>
        </div>

        {/* Today's Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Today's Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {analytics?.today?.focusMinutes || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Minutes Focused</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {analytics?.today?.sessionsCompleted || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sessions Completed</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {analytics?.tasks?.pending || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending Tasks</div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
