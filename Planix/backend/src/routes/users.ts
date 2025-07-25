import express from 'express';
import Joi from 'joi';
import User from '../models/User';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Validation schemas
const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional(),
  password: Joi.string().min(6).optional()
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional()
});

// Create user
router.post('/', validateRequest(createUserSchema), async (req, res) => {
  try {
    const { email, name, phone, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'A user with this email already exists'
      });
    }
    
    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      name,
      phone,
      password
    });
    
    // Generate referral code
    user.generateReferralCode();
    
    await user.save();
    
    // Don't send password in response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create user'
    });
  }
});

// Get user by ID
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve user'
    });
  }
});

// Update user
router.put('/:userId', validateRequest(updateUserSchema), async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update user'
    });
  }
});

// Get user subscription info
router.get('/:userId/subscription', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }
    
    // Check if user can create plans and export
    const canCreatePlan = user.canCreatePlan();
    const canExportPlan = user.canExportPlan();
    
    res.json({
      success: true,
      subscription: {
        type: user.subscriptionType,
        status: user.subscriptionStatus,
        expiresAt: user.subscriptionExpiresAt,
        usage: {
          plansUsed: user.plansUsed,
          exportsUsed: user.exportsUsed,
          canCreatePlan,
          canExportPlan
        },
        referral: {
          code: user.referralCode,
          totalReferrals: user.totalReferrals,
          credits: user.referralCredits
        }
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve subscription info'
    });
  }
});

export default router;