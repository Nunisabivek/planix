import express from 'express';
import Joi from 'joi';
import User, { PLAN_LIMITS } from '../models/User';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Validation schemas
const updateSubscriptionSchema = Joi.object({
  planType: Joi.string().valid('free', 'pro', 'enterprise').required(),
  paymentMethod: Joi.string().optional()
});

// Get subscription plans
router.get('/plans', (req, res) => {
  const plans = {
    free: {
      ...PLAN_LIMITS.free,
      price: 0,
      currency: 'INR',
      interval: 'month',
      features: [
        '3 floor plans per month',
        '5 exports per month',
        'Basic room types',
        'DXF & SVG export',
        'Community support'
      ]
    },
    pro: {
      ...PLAN_LIMITS.pro,
      price: 999,
      currency: 'INR',
      interval: 'month',
      features: [
        'Unlimited floor plans',
        'Unlimited exports',
        'Advanced room types',
        'All export formats (DXF, SVG, PDF, PNG)',
        'Custom dimensions',
        'Priority support',
        'No watermarks',
        'Collaboration tools'
      ]
    },
    enterprise: {
      ...PLAN_LIMITS.enterprise,
      price: 99,
      currency: 'USD',
      interval: 'month',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'API access',
        'Custom branding',
        'Advanced analytics',
        'Dedicated support',
        'SSO integration',
        'Custom integrations'
      ]
    }
  };
  
  res.json({
    success: true,
    plans
  });
});

// Get user subscription
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
    
    const planLimits = PLAN_LIMITS[user.subscriptionType as keyof typeof PLAN_LIMITS];
    
    res.json({
      success: true,
      subscription: {
        userId: user._id,
        planType: user.subscriptionType,
        status: user.subscriptionStatus,
        expiresAt: user.subscriptionExpiresAt,
        limits: planLimits,
        usage: {
          plansUsed: user.plansUsed,
          exportsUsed: user.exportsUsed,
          plansRemaining: planLimits.monthlyPlansLimit === -1 ? -1 : Math.max(0, planLimits.monthlyPlansLimit - user.plansUsed),
          exportsRemaining: planLimits.monthlyExportsLimit === -1 ? -1 : Math.max(0, planLimits.monthlyExportsLimit - user.exportsUsed)
        },
        features: planLimits
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve subscription'
    });
  }
});

// Update subscription
router.put('/:userId', validateRequest(updateSubscriptionSchema), async (req, res) => {
  try {
    const { userId } = req.params;
    const { planType, paymentMethod } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }
    
    // Update subscription
    user.subscriptionType = planType;
    user.subscriptionStatus = 'active';
    
    // Set expiry date for paid plans
    if (planType !== 'free') {
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      user.subscriptionExpiresAt = expiryDate;
    } else {
      user.subscriptionExpiresAt = undefined;
    }
    
    // Reset usage for new subscription
    user.resetMonthlyUsage();
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Subscription updated successfully',
      subscription: {
        planType: user.subscriptionType,
        status: user.subscriptionStatus,
        expiresAt: user.subscriptionExpiresAt
      }
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update subscription'
    });
  }
});

// Cancel subscription
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }
    
    // Cancel subscription (downgrade to free)
    user.subscriptionType = 'free';
    user.subscriptionStatus = 'cancelled';
    user.subscriptionExpiresAt = undefined;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to cancel subscription'
    });
  }
});

export default router;