const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  },
  sessionType: {
    type: String,
    enum: ['focus', 'short-break', 'long-break'],
    default: 'focus',
  },
  plannedDuration: {
    type: Number, // in minutes
    required: true,
  },
  actualDuration: {
    type: Number, // in minutes
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
  },
  focusScore: {
    type: Number,
    default: 100,
  },
  violationsCount: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
  },
  sessionNumber: {
    type: Number, // which pomodoro in the cycle (1-4)
  },
}, {
  timestamps: true,
});

// Index for faster queries
studySessionSchema.index({ user: 1, startTime: -1 });

module.exports = mongoose.model('StudySession', studySessionSchema);
