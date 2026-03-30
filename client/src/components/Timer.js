import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Timer = ({ duration, onComplete, isPaused, onTick }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onComplete();
          return 0;
        }

        const newTime = prev - 1;
        if (onTick) onTick(newTime);
        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, onComplete, onTick]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90" width="280" height="280">
        {/* Background circle */}
        <circle
          cx="140"
          cy="140"
          r="120"
          stroke="currentColor"
          strokeWidth="12"
          fill="none"
          className="text-gray-700 dark:text-gray-600 opacity-30"
        />
        {/* Progress circle */}
        <motion.circle
          cx="140"
          cy="140"
          r="120"
          stroke="url(#gradient)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5 }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute flex flex-col items-center justify-center">
        <motion.div
          className="text-6xl font-bold text-white"
          animate={{ scale: seconds === 0 ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </motion.div>
        <div className="text-sm text-gray-300 mt-2">
          {isPaused ? 'Paused' : 'Focus Time'}
        </div>
      </div>
    </div>
  );
};

export default Timer;
