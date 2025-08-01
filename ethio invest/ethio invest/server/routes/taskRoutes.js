import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ userId }).sort({ createdAt: 1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/complete/:taskId', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.isCompleted) {
      return res.status(400).json({ error: 'Task already completed' });
    }

    task.isCompleted = true;
    task.completedAt = new Date();
    task.progress = task.target;
    await task.save();

    // Add reward to user wallet
    if (task.reward > 0) {
      const user = await User.findById(userId);
      user.walletBalance += task.reward;
      await user.save();
    }

    res.json({
      message: 'Task completed successfully',
      task,
      reward: task.reward
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
});

export default router;