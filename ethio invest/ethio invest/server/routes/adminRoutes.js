import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import User from '../models/User.js';
import InvestmentSubmission from '../models/InvestmentSubmission.js';
import Investment from '../models/Investment.js';

const router = express.Router();

router.get('/submissions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 10 } = req.query;
    
    const submissions = await InvestmentSubmission.find({ status })
      .populate('userId', 'fullName email phone')
      .sort({ submittedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await InvestmentSubmission.countDocuments({ status });

    res.json({
      submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = search ? {
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInvestments = await Investment.countDocuments();
    const pendingSubmissions = await InvestmentSubmission.countDocuments({ status: 'pending' });
    const activeInvestments = await Investment.countDocuments({ isActive: true });

    const totalInvestmentAmount = await Investment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalPaidROI = await Investment.aggregate([
      { $group: { _id: null, total: { $sum: '$totalProfit' } } }
    ]);

    res.json({
      totalUsers,
      totalInvestments,
      pendingSubmissions,
      activeInvestments,
      totalInvestmentAmount: totalInvestmentAmount[0]?.total || 0,
      totalPaidROI: totalPaidROI[0]?.total || 0
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;