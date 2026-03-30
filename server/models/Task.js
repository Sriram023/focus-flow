const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a task title'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  estimatedPomodoros: {
    type: Number,
    default: 1,
  },
  completedPomodoros: {
    type: Number,
    default: 0,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  dueDate: {
    type: Date,
  },
  category: {
    type: String,
    default: 'general',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);
