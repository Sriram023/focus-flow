import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';

const ViolationWarning = ({ show, type, onDismiss }) => {
  const messages = {
    'tab-switch': 'Tab switching detected! Stay focused.',
    'fullscreen-exit': 'Fullscreen mode exited! Session terminated.',
    'window-minimize': 'Window minimized! Violation logged.',
    'blocked-website-attempt': 'Blocked website access attempt!',
    'app-background': 'App went to background! Stay in focus mode.',
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-4 min-w-[320px]">
            <FiAlertTriangle className="text-3xl animate-pulse" />
            <div className="flex-1">
              <h4 className="font-bold text-lg">Focus Mode Violation!</h4>
              <p className="text-sm">{messages[type] || 'Violation detected!'}</p>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-white hover:text-gray-200 text-xl font-bold"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViolationWarning;
