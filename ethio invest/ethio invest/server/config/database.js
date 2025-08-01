import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Use the environment variable directly without fallback
const MONGODB_URI = process.env.MONGODB_URI;

// Simple in-memory storage for development
const inMemoryDB = {
  users: [],
  tasks: [],
  investments: [],
  submissions: []
};

const initDatabase = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    // Connect to MongoDB Atlas
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connected to MongoDB Atlas successfully');
    
    // Create default admin user if not exists
    const { default: User } = await import('../models/User.js');
    const adminExists = await User.findOne({ email: 'admin@ethioinvest.com' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await User.create({
        fullName: 'Admin User',
        email: 'admin@ethioinvest.com',
        phone: '+251911000000',
        password: hashedPassword,
        referralCode: 'ADMIN001',
        isAdmin: true,
        walletBalance: 0,
        totalEarnings: 0,
        totalReferralEarnings: 0,
        isActive: true
      });
      
      console.log('✅ Default admin user created');
    }
    
    // Create default tasks if not exist
    const { default: SystemTask } = await import('../models/SystemTask.js');
    const tasksExist = await SystemTask.countDocuments();
    
    if (tasksExist === 0) {
      const defaultTasks = [
        {
          title: 'Complete Profile',
          description: 'Fill out your complete profile information',
          reward: 50,
          type: 'profile'
        },
        {
          title: 'First Investment',
          description: 'Make your first investment to start earning',
          reward: 100,
          type: 'investment'
        },
        {
          title: 'Refer a Friend',
          description: 'Invite a friend to join EthioInvest Network',
          reward: 200,
          type: 'referral'
        },
        {
          title: 'Daily Check-in',
          description: 'Check your dashboard daily for 7 consecutive days',
          reward: 75,
          type: 'daily'
        }
      ];

      await SystemTask.insertMany(defaultTasks);
      console.log('✅ Default tasks created');
    }
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
    console.log('⚠️  Using in-memory database for development');
    console.log('💡 To use MongoDB Atlas:');
    console.log('   1. Get your connection string from MongoDB Atlas');
    console.log('   2. Update MONGODB_URI in .env file');
    console.log('   3. Make sure your IP is whitelisted in Atlas');
    
    // Create default admin user in memory
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    inMemoryDB.users.push({
      _id: 'admin-1',
      fullName: 'Admin User',
      email: 'admin@ethioinvest.com',
      phone: '+251911000000',
      password: hashedPassword,
      referralCode: 'ADMIN001',
      isAdmin: true,
      walletBalance: 0,
      totalEarnings: 0,
      totalReferralEarnings: 0,
      isActive: true,
      createdAt: new Date()
    });
    
    console.log('✅ Default admin user created (in-memory)');
  }
};

export { initDatabase, inMemoryDB };