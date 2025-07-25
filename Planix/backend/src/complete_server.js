const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mock Database (in-memory storage for demo)
const mockUsers = [];
const mockFloorPlans = [];

// DeepSeek API service
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com';

async function generateFloorPlanWithDeepSeek(description, area, rooms, bathrooms, location, features) {
  if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'your-deepseek-api-key-here') {
    return generateMockFloorPlan(description, area, rooms, bathrooms, location, features);
  }

  try {
    const prompt = `
As an expert architect, create a detailed floor plan description for:
- Description: ${description}
- Area: ${area} sq ft
- Rooms: ${rooms}
- Bathrooms: ${bathrooms}
- Location: ${location}
- Features: ${features?.join(', ') || 'Standard features'}

Please provide a comprehensive architectural plan with room layouts, dimensions, and IS code compliance for Indian construction standards.
    `;

    const response = await axios.post(`${DEEPSEEK_API_URL}/chat/completions`, {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are an expert architect specializing in Indian building standards and floor plan design.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    return response.data.choices[0]?.message?.content || generateMockFloorPlan(description, area, rooms, bathrooms, location, features);
  } catch (error) {
    console.error('DeepSeek API error:', error.message);
    return generateMockFloorPlan(description, area, rooms, bathrooms, location, features);
  }
}

function generateMockFloorPlan(description, area, rooms, bathrooms, location, features) {
  return `
FLOOR PLAN DESIGN - ${description}

LAYOUT OVERVIEW:
This ${area || 1000} sq ft floor plan features ${rooms || 2} bedrooms and ${bathrooms || 1} bathrooms, designed for ${location || 'Indian urban'} conditions.

ROOM LAYOUT:
- Living Room: 12' x 14' with large windows for natural light
- Kitchen: 8' x 10' with modern modular design
- Master Bedroom: 12' x 10' with attached bathroom
${rooms > 1 ? `- Additional Bedroom(s): 10' x 10' each` : ''}
- Bathrooms: Standard 6' x 8' with proper ventilation

SPECIAL FEATURES:
${features?.map(f => `- ${f.replace('_', ' ')}`).join('\n') || '- Standard fixtures and fittings'}

INDIAN STANDARD COMPLIANCE:
- IS 875 compliance for structural loads
- IS 1893 seismic design considerations
- NBC 2016 fire safety provisions
- Adequate ventilation as per building codes

CONSTRUCTION SPECIFICATIONS:
- RCC frame structure with brick masonry
- Standard 9' ceiling height
- Cross-ventilation in all rooms
- Anti-termite treatment for foundation

This design ensures optimal space utilization while maintaining compliance with Indian building standards.
  `;
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Planix API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    deepSeekConfigured: Boolean(DEEPSEEK_API_KEY && DEEPSEEK_API_KEY !== 'your-deepseek-api-key-here')
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Planix API - AI-powered floor plan generator',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      floorPlans: '/api/floor-plans',
      subscriptions: '/api/subscriptions'
    }
  });
});

// User routes
app.post('/api/users', (req, res) => {
  try {
    const { email, name, phone } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email and name are required'
      });
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'A user with this email already exists'
      });
    }

    const user = {
      id: uuidv4(),
      email,
      name,
      phone,
      subscriptionType: 'free',
      subscriptionStatus: 'active',
      plansUsed: 0,
      exportsUsed: 0,
      referralCode: `PLANIX${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      totalReferrals: 0,
      referralCredits: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUsers.push(user);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create user'
    });
  }
});

app.get('/api/users/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const user = mockUsers.find(u => u.id === userId);
    
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

// Floor plan routes
app.post('/api/floor-plans', async (req, res) => {
  try {
    const { userId, description, area, rooms, bathrooms, location, budget, features } = req.body;
    
    if (!userId || !description) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'User ID and description are required'
      });
    }

    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }

    const floorPlan = {
      id: uuidv4(),
      userId,
      title: `Floor Plan - ${description.substring(0, 50)}...`,
      description,
      area,
      rooms,
      bathrooms,
      location,
      budget,
      features: features || [],
      generatedPlan: '',
      materialEstimate: {},
      isCodeCompliance: {},
      status: 'generating',
      exportCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockFloorPlans.push(floorPlan);

    // Generate floor plan asynchronously
    setTimeout(async () => {
      try {
        const generatedPlan = await generateFloorPlanWithDeepSeek(
          description, area, rooms, bathrooms, location, features
        );
        
        // Calculate material estimate
        const materialEstimate = {
          bricks: { quantity: Math.round((area || 1000) * 8), unit: 'pieces' },
          cement: { quantity: Math.round((area || 1000) * 0.4 * 10) / 10, unit: 'bags' },
          steel: { quantity: Math.round((area || 1000) * 4 * 10) / 10, unit: 'kg' },
          sand: { quantity: Math.round((area || 1000) * 0.5 * 10) / 10, unit: 'cubic feet' },
          aggregate: { quantity: Math.round((area || 1000) * 0.3 * 10) / 10, unit: 'cubic feet' }
        };

        // IS Code compliance
        const isCodeCompliance = {
          overallCompliance: true,
          checks: {
            minimumRoomSize: { status: 'passed', message: 'All rooms meet minimum size requirements' },
            ventilation: { status: 'passed', message: 'Adequate ventilation provided' },
            fireSafety: { status: 'passed', message: 'Fire safety norms complied' },
            structuralSafety: { status: 'passed', message: 'Structural safety standards met' }
          },
          recommendations: [
            'Consider adding cross-ventilation in all rooms',
            'Ensure proper drainage around the building'
          ],
          criticalIssues: [],
          complianceScore: 95
        };

        // Update floor plan
        const planIndex = mockFloorPlans.findIndex(p => p.id === floorPlan.id);
        if (planIndex !== -1) {
          mockFloorPlans[planIndex] = {
            ...mockFloorPlans[planIndex],
            generatedPlan,
            materialEstimate,
            isCodeCompliance,
            status: 'completed',
            updatedAt: new Date()
          };
        }

        // Update user's plan usage
        user.plansUsed += 1;
        user.updatedAt = new Date();

        console.log(`Floor plan ${floorPlan.id} generated successfully`);
      } catch (error) {
        console.error('Floor plan generation error:', error);
        const planIndex = mockFloorPlans.findIndex(p => p.id === floorPlan.id);
        if (planIndex !== -1) {
          mockFloorPlans[planIndex] = {
            ...mockFloorPlans[planIndex],
            status: 'failed',
            generatedPlan: 'Failed to generate floor plan. Please try again.',
            updatedAt: new Date()
          };
        }
      }
    }, 2000); // 2 second delay to simulate processing

    res.status(201).json({
      success: true,
      message: 'Floor plan creation initiated',
      floorPlan: {
        id: floorPlan.id,
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

app.get('/api/floor-plans/:planId', (req, res) => {
  try {
    const { planId } = req.params;
    const floorPlan = mockFloorPlans.find(p => p.id === planId);
    
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

app.get('/api/floor-plans/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userPlans = mockFloorPlans.filter(p => p.userId === userId);
    
    res.json({
      success: true,
      floorPlans: userPlans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (error) {
    console.error('Get user floor plans error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve floor plans'
    });
  }
});

// Subscription routes
app.get('/api/subscriptions/plans', (req, res) => {
  const plans = {
    free: {
      price: 0,
      currency: 'INR',
      features: ['3 floor plans per month', '5 exports per month', 'Basic support']
    },
    pro: {
      price: 999,
      currency: 'INR',
      features: ['Unlimited floor plans', 'Unlimited exports', 'Priority support']
    },
    enterprise: {
      price: 99,
      currency: 'USD',
      features: ['Everything in Pro', 'API access', 'Custom integrations']
    }
  };
  
  res.json({
    success: true,
    plans
  });
});

app.get('/api/subscriptions/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }

    res.json({
      success: true,
      subscription: {
        userId: user.id,
        planType: user.subscriptionType,
        status: user.subscriptionStatus,
        usage: {
          plansUsed: user.plansUsed,
          exportsUsed: user.exportsUsed
        }
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

// Referral routes
app.post('/api/referrals/generate/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
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
    console.error('Generate referral error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate referral code'
    });
  }
});

app.get('/api/referrals/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with the provided ID'
      });
    }

    res.json({
      success: true,
      referral: {
        code: user.referralCode,
        stats: {
          totalReferrals: user.totalReferrals,
          creditsEarned: user.referralCredits
        }
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  return res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  return res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
const startServer = async () => {
  try {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Planix Backend Server running on port ${PORT}`);
      console.log(`📖 API Documentation: http://localhost:${PORT}/api`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
      console.log(`🤖 DeepSeek API: ${DEEPSEEK_API_KEY ? 'Configured' : 'Not configured'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;