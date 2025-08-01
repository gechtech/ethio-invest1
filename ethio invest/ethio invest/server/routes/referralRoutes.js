import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';
import Referral from '../models/Referral.js';

const router = express.Router();

router.get('/team', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get direct referrals (Level 1)
    const level1 = await User.find({ referrerId: userId })
      .select('fullName email createdAt walletBalance totalEarnings');

    // Get level 2 referrals
    const level1Ids = level1.map(user => user._id);
    const level2 = await User.find({ referrerId: { $in: level1Ids } })
      .select('fullName email createdAt walletBalance totalEarnings referrerId');

    // Get level 3 referrals
    const level2Ids = level2.map(user => user._id);
    const level3 = await User.find({ referrerId: { $in: level2Ids } })
      .select('fullName email createdAt walletBalance totalEarnings referrerId');

    // Get referral earnings
    const referralEarnings = await Referral.find({ referrerId: userId })
      .populate('referredId', 'fullName email')
      .sort({ paidAt: -1 });

    res.json({
      team: {
        level1: level1.length,
        level2: level2.length,
        level3: level3.length,
        total: level1.length + level2.length + level3.length
      },
      members: {
        level1,
        level2,
        level3
      },
      earnings: referralEarnings
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ error: 'Failed to fetch team data' });
  }
});

export default router;