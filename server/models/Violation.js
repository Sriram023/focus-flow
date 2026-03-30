const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudySession',
    required: true,
  },
  violationType: {
    type: String,
    enum: [
      'tab-switch',
      'fullscreen-exit',
      'window-minimize',
      'notification-interaction',
      'blocked-website-attempt',
      'app-background',
    ],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: String,
  },
  penaltyPoints: {
    type: Number,
    default: 5, // points deducted from focus score
  },
}, {
  timestamps: true,
});

// Index for faster queries
violationSchema.index({ user: 1, timestamp: -1 });
violationSchema.index({ session: 1 });

module.exports = mongoose.model('Violation', violationSchema);
