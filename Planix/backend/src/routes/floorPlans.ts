import express from 'express';
import Joi from 'joi';
import FloorPlan from '../models/FloorPlan';
import User from '../models/User';
import DeepSeekService from '../services/DeepSeekService';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Validation schemas
const createFloorPlanSchema = Joi.object({
  userId: Joi.string().required(),
  description: Joi.string().min(10).max(1000).required(),
  area: Joi.number().min(100).max(10000).optional(),
  rooms: Joi.number().min(1).max(20).optional(),
  bathrooms: Joi.number().min(1).max(10).optional(),
  location: Joi.string().max(200).optional(),
  budget: Joi.number().min(0).optional(),
  features: Joi.array().items(Joi.string().max(50)).optional()
});

// Create floor plan
router.post('/', validateRequest(createFloorPlanSchema), async (req, res) => {
  try {
    const { userId, description, area, rooms, bathrooms, location, budget, features } = req.body;
    
    // Check if user exists and can create plans
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }
    
    if (!user.canCreatePlan()) {
      return res.status(403).json({
        error: 'Plan limit exceeded',
        message: 'You have reached your monthly plan creation limit'
      });
    }
    
    // Create floor plan document
    const floorPlan = new FloorPlan({
      userId,
      title: `Floor Plan - ${description.substring(0, 50)}...`,
      description,
      area,
      rooms,
      bathrooms,
      location,
      budget,
      features: features || [],
      generatedPlan: 'Generating...', // Placeholder
      materialEstimate: {
        bricks: { quantity: 0, unit: 'pieces' },
        cement: { quantity: 0, unit: 'bags' },
        steel: { quantity: 0, unit: 'kg' },
        sand: { quantity: 0, unit: 'cubic feet' },
        aggregate: { quantity: 0, unit: 'cubic feet' }
      },
      isCodeCompliance: {
        overallCompliance: false,
        checks: new Map(),
        recommendations: [],
        criticalIssues: []
      }
    });
    
    await floorPlan.save();
    
    // Generate floor plan asynchronously
    (async () => {
      try {
        const request = { description, area, rooms, bathrooms, location, budget, features };
        
        // Generate floor plan using DeepSeek
        const generatedPlan = await DeepSeekService.generateFloorPlan(request);
        
        // Calculate material estimate
        const materialEstimate = floorPlan.calculateMaterialEstimate();
        
        // Check IS code compliance
        const isCodeCompliance = await DeepSeekService.checkISCodeCompliance(generatedPlan, request);
        
        // Update floor plan
        await FloorPlan.findByIdAndUpdate(floorPlan._id, {
          generatedPlan,
          materialEstimate,
          isCodeCompliance,
          status: 'completed'
        });
        
        // Update user's plan usage
        await User.findByIdAndUpdate(userId, {
          $inc: { plansUsed: 1 }
        });
        
        console.log(`Floor plan ${floorPlan._id} generated successfully`);
      } catch (error) {
        console.error('Floor plan generation error:', error);
        await FloorPlan.findByIdAndUpdate(floorPlan._id, {
          status: 'failed',
          generatedPlan: 'Failed to generate floor plan. Please try again.'
        });
      }
    })();
    
    res.status(201).json({
      success: true,
      message: 'Floor plan creation initiated',
      floorPlan: {
        id: floorPlan._id,
        status: floorPlan.status,
        description: floorPlan.description,
        createdAt: floorPlan.createdAt
      }
    });
  } catch (error) {
    console.error('Create floor plan error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create floor plan'
    });
  }
});

// Get floor plan by ID
router.get('/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    
    const floorPlan = await FloorPlan.findById(planId).populate('userId', 'name email');
    if (!floorPlan) {
      return res.status(404).json({
        error: 'Floor plan not found',
        message: 'No floor plan found with the provided ID'
      });
    }
    
    res.json({
      success: true,
      floorPlan
    });
  } catch (error) {
    console.error('Get floor plan error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve floor plan'
    });
  }
});

// Get user's floor plans
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    const floorPlans = await FloorPlan.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await FloorPlan.countDocuments({ userId });
    
    res.json({
      success: true,
      floorPlans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user floor plans error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve floor plans'
    });
  }
});

// Export floor plan
router.post('/:planId/export', async (req, res) => {
  try {
    const { planId } = req.params;
    
    const floorPlan = await FloorPlan.findById(planId);
    if (!floorPlan) {
      return res.status(404).json({
        error: 'Floor plan not found',
        message: 'No floor plan found with the provided ID'
      });
    }
    
    // Check if user can export
    const user = await User.findById(floorPlan.userId);
    if (!user || !user.canExportPlan()) {
      return res.status(403).json({
        error: 'Export limit exceeded',
        message: 'You have reached your monthly export limit'
      });
    }
    
    // Increment export count
    floorPlan.incrementExportCount();
    await floorPlan.save();
    
    // Update user's export usage
    await User.findByIdAndUpdate(floorPlan.userId, {
      $inc: { exportsUsed: 1 }
    });
    
    res.json({
      success: true,
      message: 'Floor plan exported successfully',
      exportCount: floorPlan.exportCount
    });
  } catch (error) {
    console.error('Export floor plan error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to export floor plan'
    });
  }
});

// Delete floor plan
router.delete('/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    
    const floorPlan = await FloorPlan.findByIdAndDelete(planId);
    if (!floorPlan) {
      return res.status(404).json({
        error: 'Floor plan not found',
        message: 'No floor plan found with the provided ID'
      });
    }
    
    res.json({
      success: true,
      message: 'Floor plan deleted successfully'
    });
  } catch (error) {
    console.error('Delete floor plan error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete floor plan'
    });
  }
});

export default router;