import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { inMemoryDB } from '../config/database.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '30d',
  });
};

const generateReferralCode = () => {
  return 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, referralCode } = req.body;

    // Check if user already exists (try MongoDB first, then in-memory)
    let existingUser = null;
    try {
      const { default: User } = await import('../models/User.js');
      existingUser = await User.findOne({ email });
    } catch (error) {
      // MongoDB not available, check in-memory
      existingUser = inMemoryDB.users.find(user => user.email === email);
    }

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Validate referral code if provided
    let referrerId = null;
    if (referralCode) {
      let referrer = null;
      try {
        const { default: User } = await import('../models/User.js');
        referrer = await User.findOne({ referralCode });
      } catch (error) {
        referrer = inMemoryDB.users.find(user => user.referralCode === referralCode);
      }
      
      if (!referrer) {
        return res.status(400).json({ error: 'Invalid referral code' });
      }
      referrerId = referrer._id || referrer.id;
    }

    // Generate unique referral code for new user
    let newReferralCode;
    let isUnique = false;
    while (!isUnique) {
      newReferralCode = generateReferralCode();
      let existingCode = null;
      try {
        const { default: User } = await import('../models/User.js');
        existingCode = await User.findOne({ referralCode: newReferralCode });
      } catch (error) {
        existingCode = inMemoryDB.users.find(user => user.referralCode === newReferralCode);
      }
      if (!existingCode) {
        isUnique = true;
      }
    }

    // Create user
    let user;
    try {
      const { default: User } = await import('../models/User.js');
      user = await User.create({
        fullName: name,
        email,
        phone,
        password,
        referralCode: newReferralCode,
        referrerId,
        walletBalance: 0,
        totalEarnings: 0,
        totalReferralEarnings: 0,
        isAdmin: false,
        isActive: true
      });
    } catch (error) {
      // MongoDB not available, create in memory
      const hashedPassword = await bcrypt.hash(password, 10);
      user = {
        _id: 'user-' + Date.now(),
        fullName: name,
        email,
        phone,
        password: hashedPassword,
        referralCode: newReferralCode,
        referrerId,
        walletBalance: 0,
        totalEarnings: 0,
        totalReferralEarnings: 0,
        isAdmin: false,
        isActive: true,
        createdAt: new Date()
      };
      inMemoryDB.users.push(user);
    }

    // Generate token
    const token = generateToken(user._id || user.id);

    // Remove password from response
    const userResponse = {
      _id: user._id || user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      referralCode: user.referralCode,
      walletBalance: user.walletBalance,
      totalEarnings: user.totalEarnings,
      totalReferralEarnings: user.totalReferralEarnings,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user (try MongoDB first, then in-memory)
    let user = null;
    try {
      const { default: User } = await import('../models/User.js');
      user = await User.findOne({ email });
    } catch (error) {
      user = inMemoryDB.users.find(u => u.email === email);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Validate password
    let isValidPassword = false;
    if (user.comparePassword) {
      isValidPassword = await user.comparePassword(password);
    } else {
      isValidPassword = await bcrypt.compare(password, user.password);
    }

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    if (user.save) {
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id || user.id);

    // Remove password from response
    const userResponse = {
      _id: user._id || user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      referralCode: user.referralCode,
      walletBalance: user.walletBalance,
      totalEarnings: user.totalEarnings,
      totalReferralEarnings: user.totalReferralEarnings,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req, res) => {
  try {
    let user = null;
    try {
      const { default: User } = await import('../models/User.js');
      user = await User.findById(req.userId);
    } catch (error) {
      user = inMemoryDB.users.find(u => u._id === req.userId || u.id === req.userId);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password from response
    const userResponse = {
      _id: user._id || user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      referralCode: user.referralCode,
      walletBalance: user.walletBalance,
      totalEarnings: user.totalEarnings,
      totalReferralEarnings: user.totalReferralEarnings,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    let user = null;
    try {
      const { default: User } = await import('../models/User.js');
      user = await User.findById(req.userId);
    } catch (error) {
      user = inMemoryDB.users.find(u => u._id === req.userId || u.id === req.userId);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate current password
    let isValidPassword = false;
    if (user.comparePassword) {
      isValidPassword = await user.comparePassword(currentPassword);
    } else {
      isValidPassword = await bcrypt.compare(currentPassword, user.password);
    }

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    
    if (user.save) {
      await user.save();
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
};