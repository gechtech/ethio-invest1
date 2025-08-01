import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referredId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 3
  },
  commission: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Referral', referralSchema);