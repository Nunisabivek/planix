import express from 'express';
import Joi from 'joi';
import User from '../models/User';
import Referral from '../models/Referral';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Validation schemas
const applyReferralSchema = Joi.object({
  userId: Joi.string().required(),
  referralCode: Joi.string().required()
});

// Generate referral code
router.post('/generate/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }
    
    // Generate referral code if not exists
    if (!user.referralCode) {
      user.generateReferralCode();
      await user.save();
    }
    
    res.json({
      success: true,
      referral: {
        code: user.referralCode,
        totalReferrals: user.totalReferrals,
        creditsEarned: user.referralCredits
      }
    });
  } catch (error) {
    console.error('Generate referral code error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate referral code'
    });
  }
});

// Get referral stats
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
    
    // Get referral statistics
    const activeReferrals = await Referral.countDocuments({
      referrerUserId: userId,
      status: 'active'
    });
    
    const completedReferrals = await Referral.countDocuments({
      referrerUserId: userId,
      status: 'completed'
    });
    
    const pendingReferrals = await Referral.countDocuments({
      referrerUserId: userId,
      status: 'pending'
    });
    
    // Get recent referrals
    const recentReferrals = await Referral.find({
      referrerUserId: userId
    })
    .populate('referredUserId', 'name email')
    .sort({ createdAt: -1 })
    .limit(10);
    
    res.json({
      success: true,
      referral: {
        code: user.referralCode,
        stats: {
          totalReferrals: user.totalReferrals,
          activeReferrals,
          completedReferrals,
          pendingReferrals,
          creditsEarned: user.referralCredits
        },
        recentReferrals: recentReferrals.map(ref => ({
          id: ref._id,
          referredUser: ref.referredUserId,
          status: ref.status,
          creditsEarned: ref.creditsEarned,
          createdAt: ref.createdAt,
          activatedAt: ref.activatedAt
        }))
      }
    });
  } catch (error) {
    console.error('Get referral stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve referral stats'
    });
  }
});

// Apply referral code
router.post('/apply', validateRequest(applyReferralSchema), async (req, res) => {
  try {
    const { userId, referralCode } = req.body;
    
    // Find referred user
    const referredUser = await User.findById(userId);
    if (!referredUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }
    
    // Check if user already has a referrer
    if (referredUser.referredBy) {
      return res.status(400).json({
        error: 'Referral already applied',
        message: 'This user already has a referrer'
      });
    }
    
    // Find referrer by referral code
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return res.status(404).json({
        error: 'Invalid referral code',
        message: 'The referral code is invalid or expired'
      });
    }
    
    // Check if user is trying to refer themselves
    if (referrer._id.toString() === userId) {
      return res.status(400).json({
        error: 'Self referral not allowed',
        message: 'You cannot refer yourself'
      });
    }
    
    // Create referral record
    const referral = new Referral({
      referrerUserId: referrer._id,
      referredUserId: userId,
      referralCode,
      status: 'active'
    });
    
    referral.activate();
    await referral.save();
    
    // Update referred user
    referredUser.referredBy = referrer._id.toString();
    await referredUser.save();
    
    // Update referrer stats and award credits
    const creditsAwarded = 50; // Award 50 credits for successful referral
    referrer.totalReferrals += 1;
    referrer.referralCredits += creditsAwarded;
    await referrer.save();
    
    // Award credits to referral record
    referral.awardCredits(creditsAwarded);
    await referral.save();
    
    res.json({
      success: true,
      message: 'Referral applied successfully',
      referral: {
        referrerId: referrer._id,
        referrerName: referrer.name,
        creditsAwarded,
        status: referral.status
      }
    });
  } catch (error) {
    console.error('Apply referral error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to apply referral code'
    });
  }
});

// Get referral leaderboard
router.get('/leaderboard/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    
    const topReferrers = await User.find({
      totalReferrals: { $gt: 0 }
    })
    .select('name totalReferrals referralCredits createdAt')
    .sort({ totalReferrals: -1, referralCredits: -1 })
    .limit(limit);
    
    res.json({
      success: true,
      leaderboard: topReferrers.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        totalReferrals: user.totalReferrals,
        creditsEarned: user.referralCredits,
        joinedAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve leaderboard'
    });
  }
});

export default router;