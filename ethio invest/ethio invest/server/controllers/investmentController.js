import Investment from '../models/Investment.js';
import InvestmentSubmission from '../models/InvestmentSubmission.js';
import User from '../models/User.js';
import Referral from '../models/Referral.js';
import ProfitLog from '../models/ProfitLog.js';
import { investmentPlans } from '../config/investmentPlans.js';

export const submitInvestment = async (req, res) => {
  try {
    const { planId, ftId, screenshot } = req.body;
    const userId = req.userId;

    // Validate plan
    const plan = investmentPlans.find(p => p.id === planId);
    if (!plan) {
      return res.status(400).json({ error: 'Invalid investment plan' });
    }

    // Create investment submission
    const submission = await InvestmentSubmission.create({
      userId,
      planId,
      amount: plan.amount,
      ftId,
      screenshot,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Investment submitted successfully. Awaiting admin approval.',
      submission,
    });
  } catch (error) {
    console.error('Submit investment error:', error);
    res.status(500).json({ error: 'Failed to submit investment' });
  }
};

export const getUserInvestments = async (req, res) => {
  try {
    const userId = req.userId;
    const investments = await Investment.find({ userId }).populate('submissionId');
    const submissions = await InvestmentSubmission.find({ userId });

    res.json({
      investments,
      submissions,
    });
  } catch (error) {
    console.error('Get user investments error:', error);
    res.status(500).json({ error: 'Failed to get investments' });
  }
};

export const approveInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    // Get submission
    const submission = await InvestmentSubmission.findById(id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({ error: 'Submission already processed' });
    }

    // Get plan details
    const plan = investmentPlans.find(p => p.id === submission.planId);
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 65);

    // Create investment
    const investment = await Investment.create({
      userId: submission.userId,
      planId: submission.planId,
      amount: submission.amount,
      dailyProfit: plan.dailyROI,
      totalProfit: 0,
      startDate,
      endDate,
      isActive: true,
      daysPaid: 0,
      maxDays: 65,
      submissionId: submission._id
    });

    // Update submission status
    await InvestmentSubmission.findByIdAndUpdate(id, {
      status: 'approved',
      adminNotes
    });

    // Process referral commissions
    await processReferralCommissions(submission.userId, submission.amount);

    res.json({
      message: 'Investment approved successfully',
      investment,
    });
  } catch (error) {
    console.error('Approve investment error:', error);
    res.status(500).json({ error: 'Failed to approve investment' });
  }
};

export const rejectInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    // Get submission
    const submission = await InvestmentSubmission.findById(id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({ error: 'Submission already processed' });
    }

    // Update submission status
    await InvestmentSubmission.findByIdAndUpdate(id, {
      status: 'rejected',
      adminNotes
    });

    res.json({
      message: 'Investment rejected successfully',
    });
  } catch (error) {
    console.error('Reject investment error:', error);
    res.status(500).json({ error: 'Failed to reject investment' });
  }
};

export const processDailyROI = async () => {
  try {
    const activeInvestments = await Investment.find({ 
      isActive: true,
      daysPaid: { $lt: 65 }
    }).populate('userId');
    
    for (const investment of activeInvestments) {
      // Add daily ROI to user wallet
      await User.findByIdAndUpdate(investment.userId, {
        $inc: { walletBalance: investment.dailyProfit }
      });
      
      // Log the profit
      await ProfitLog.create({
        userId: investment.userId,
        investmentId: investment._id,
        amount: investment.dailyProfit,
        type: 'daily_roi'
      });
      
      // Update days paid
      await Investment.findByIdAndUpdate(investment._id, {
        $inc: { daysPaid: 1 },
        lastPaymentDate: new Date()
      });
      
      console.log(`✅ Processed ROI for investment ${investment._id}: ${investment.dailyProfit} ETB`);
    }
    
    console.log(`✅ Processed daily ROI for ${activeInvestments.length} investments`);
  } catch (error) {
    console.error('❌ Error processing daily ROI:', error);
    throw error;
  }
};

// Helper function for referral commissions
const processReferralCommissions = async (userId, amount) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.referrerId) return;

    const commission = amount * 0.05; // 5% commission
    
    await User.findByIdAndUpdate(user.referrerId, {
      $inc: { 
        walletBalance: commission,
        totalReferralEarnings: commission
      }
    });

    await Referral.create({
      referrerId: user.referrerId,
      referredId: userId,
      level: 1,
      commission
    });

    console.log(`✅ Processed referral commission: ${commission} ETB`);
  } catch (error) {
    console.error('❌ Error processing referral commission:', error);
  }
};