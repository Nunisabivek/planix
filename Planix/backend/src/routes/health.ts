import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Check DeepSeek API configuration
    const deepSeekConfigured = Boolean(process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY !== 'your-deepseek-api-key-here');
    
    res.json({
      status: 'healthy',
      message: 'Planix API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        type: 'MongoDB'
      },
      services: {
        deepSeek: {
          configured: deepSeekConfigured,
          status: deepSeekConfigured ? 'ready' : 'not configured'
        }
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error'
    });
  }
});

export default router;