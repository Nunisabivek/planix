const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

// Test routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Planix Test API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mock user registration (for testing)
app.post('/api/auth/register', (req, res) => {
  const { email, name, phone, password } = req.body;
  
  res.json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: 'test-user-123',
      email,
      name,
      subscriptionType: 'free',
      referralCode: 'PLANIXTEST123'
    },
    token: 'test-jwt-token'
  });
});

// Mock user login (for testing)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: 'test-user-123',
      email,
      name: 'Test User',
      subscriptionType: 'free',
      referralCode: 'PLANIXTEST123'
    },
    token: 'test-jwt-token'
  });
});

// Mock user profile (for testing)
app.get('/api/user/profile', (req, res) => {
  res.json({
    success: true,
    user: {
      id: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User',
      subscriptionType: 'free',
      referralCode: 'PLANIXTEST123'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Planix Test Server running on port ${PORT}`);
  console.log(`📖 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Environment: Testing Mode`);
});

module.exports = app;