const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.patch('/:id/toggle', protect, toggleTaskCompletion);

module.exports = router;
