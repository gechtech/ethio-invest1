import mongoose from 'mongoose';

const userTaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SystemTask',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure unique combination of userId and taskId
userTaskSchema.index({ userId: 1, taskId: 1 }, { unique: true });

export default mongoose.model('UserTask', userTaskSchema); 