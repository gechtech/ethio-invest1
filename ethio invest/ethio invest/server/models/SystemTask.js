import mongoose from 'mongoose';

const systemTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  reward: {
    type: Number,
    required: true,
    default: 0
  },
  type: {
    type: String,
    required: true,
    enum: ['profile', 'investment', 'referral', 'daily', 'withdrawal']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('SystemTask', systemTaskSchema); 