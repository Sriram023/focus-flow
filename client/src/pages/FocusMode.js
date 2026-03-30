import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiX, FiAlertCircle } from 'react-icons/fi';
import Timer from '../components/Timer';
import ViolationWarning from '../components/ViolationWarning';
import focusDetector from '../utils/focusDetection';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const FocusMode = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessionState, setSessionState] = useState('idle'); // idle, active, paused, completed
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [violations, setViolations] = useState([]);
  const [showViolation, setShowViolation] = useState(false);
  const [currentViolationType, setCurrentViolationType] = useState(null);
  const [sessionNumber, setSessionNumber] = useState(1);
  const [focusScore, setFocusScore] = useState(100);
  const [elapsedTime, setElapsedTime] = useState(0);

  const containerRef = useRef(null);
  const sessionStartTime = useRef(null);

  const focusDuration = user?.settings?.focusDuration || 25;
  const shortBreak = user?.settings?.shortBreak || 5;
  const longBreak = user?.settings?.longBreak || 15;

  useEffect(() => {
    // Request notification permission on mount
    if (focusDetector.notificationsSupported()) {
      focusDetector.requestNotificationPermission();
    }

    return () => {
      // Cleanup on unmount
      if (sessionState === 'active') {
        handleTerminateSession();
      }
      focusDetector.stopMonitoring();
      focusDetector.exitFullscreen();
    };
  }, []);

  useEffect(() => {
    if (sessionState === 'active') {
      // Setup violation listeners
      focusDetector.on('tabSwitch', handleViolation);
      focusDetector.on('fullscreenExit', handleFullscreenExit);

      return () => {
        focusDetector.off('tabSwitch', handleViolation);
        focusDetector.off('fullscreenExit', handleFullscreenExit);
      };
    }
  }, [sessionState]);

  const handleViolation = async (data) => {
    const violation = {
      session: sessionId,
      violationType: data.type === 'window-blur' ? 'tab-switch' : data.type,
      details: `Detected at ${data.timestamp.toLocaleTimeString()}`,
    };

    try {
      await api.post('/violations', violation);
      setViolations(prev => [...prev, violation]);
      setFocusScore(prev => Math.max(0, prev - 5));
      setCurrentViolationType(violation.violationType);
      setShowViolation(true);

      setTimeout(() => setShowViolation(false), 3000);
    } catch (error) {
      console.error('Failed to log violation:', error);
    }
  };

  const handleFullscreenExit = async (data) => {
    // Critical violation - terminate session
    await handleViolation(data);
    await handleTerminateSession();

    alert('Focus Mode Broken! Session has been terminated due to fullscreen exit.');
    navigate('/dashboard');
  };

  const startSession = async () => {
    try {
      // Create session in backend
      const { data } = await api.post('/sessions', {
        sessionType: 'focus',
        plannedDuration: focusDuration,
        sessionNumber,
      });

      setSessionId(data._id);
      sessionStartTime.current = new Date();

      // Enter fullscreen
      const fullscreenSuccess = await focusDetector.enterFullscreen(containerRef.current);

      if (!fullscreenSuccess) {
        alert('Fullscreen is required for Focus Mode. Please allow fullscreen access.');
        return;
      }

      // Start monitoring
      focusDetector.startMonitoring();

      setSessionState('active');
      setIsPaused(false);
    } catch (error) {
      console.error('Failed to start session:', error);
      alert('Failed to start session. Please try again.');
    }
  };

  const pauseSession = () => {
    setIsPaused(true);
  };

  const resumeSession = () => {
    setIsPaused(false);
  };

  const completeSession = async () => {
    try {
      const actualDuration = Math.floor(elapsedTime / 60); // Convert to minutes

      await api.put(`/sessions/${sessionId}/complete`, {
        actualDuration,
        violationsCount: violations.length,
        focusScore,
        notes: `Completed session ${sessionNumber}`,
      });

      setSessionState('completed');
      focusDetector.stopMonitoring();
      await focusDetector.exitFullscreen();

      // Show completion message
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Failed to complete session:', error);
    }
  };

  const handleTerminateSession = async () => {
    if (!sessionId) return;

    try {
      await api.put(`/sessions/${sessionId}/terminate`);
      focusDetector.stopMonitoring();
      await focusDetector.exitFullscreen();
    } catch (error) {
      console.error('Failed to terminate session:', error);
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to exit? This will terminate the session.')) {
      await handleTerminateSession();
      navigate('/dashboard');
    }
  };

  const handleTimerTick = (timeLeft) => {
    const elapsed = (focusDuration * 60) - timeLeft;
    setElapsedTime(elapsed);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-primary flex flex-col items-center justify-center p-8 relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20"></div>

      {/* Violation warning */}
      <ViolationWarning
        show={showViolation}
        type={currentViolationType}
        onDismiss={() => setShowViolation(false)}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center space-y-8"
      >
        {/* Session info */}
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-2">Focus Mode</h1>
          <p className="text-xl opacity-90">Session {sessionNumber}</p>
        </div>

        {/* Timer */}
        {sessionState !== 'idle' && (
          <Timer
            duration={focusDuration}
            onComplete={completeSession}
            isPaused={isPaused}
            onTick={handleTimerTick}
          />
        )}

        {/* Stats */}
        <div className="flex space-x-8 text-white">
          <div className="text-center glass px-6 py-4 rounded-xl">
            <div className="text-3xl font-bold">{focusScore}</div>
            <div className="text-sm opacity-80">Focus Score</div>
          </div>
          <div className="text-center glass px-6 py-4 rounded-xl">
            <div className="text-3xl font-bold">{violations.length}</div>
            <div className="text-sm opacity-80">Violations</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex space-x-4">
          {sessionState === 'idle' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startSession}
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg flex items-center space-x-2 shadow-2xl"
            >
              <FiPlay />
              <span>Start Focus Session</span>
            </motion.button>
          )}

          {sessionState === 'active' && (
            <>
              {!isPaused ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={pauseSession}
                  className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg flex items-center space-x-2 shadow-2xl"
                >
                  <FiPause />
                  <span>Pause</span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resumeSession}
                  className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg flex items-center space-x-2 shadow-2xl"
                >
                  <FiPlay />
                  <span>Resume</span>
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="bg-red-500 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center space-x-2 shadow-2xl"
              >
                <FiX />
                <span>Exit</span>
              </motion.button>
            </>
          )}

          {sessionState === 'completed' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-white text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold">Session Complete!</h2>
              <p className="text-lg mt-2">Great job staying focused!</p>
            </motion.div>
          )}
        </div>

        {/* Warning message */}
        {sessionState === 'active' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-dark text-white px-6 py-4 rounded-lg max-w-lg text-center"
          >
            <FiAlertCircle className="inline mr-2" />
            <span className="text-sm">
              Do not switch tabs, minimize window, or exit fullscreen. Any violation will be logged and may terminate your session.
            </span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default FocusMode;
