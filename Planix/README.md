# Planix - AI-Powered Floor Plan Generator

Professional AI-powered floor plan generation with Indian building standards compliance.

## Features

- 🏠 AI-powered floor plan generation using DeepSeek API
- 🇮🇳 Indian Standard (IS) code compliance checking
- 📊 Material and excavation cost estimation
- 👤 JWT-based user authentication
- 💳 Subscription management (Free/Pro/Enterprise)
- 🔗 Referral program system
- 📱 Responsive web interface

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js + MongoDB
- **AI**: DeepSeek API for floor plan generation
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens

## Project Structure

```
Planix/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React contexts (Auth, Plan)
│   │   └── services/      # API service layer
│   └── package.json
├── backend/           # Node.js backend API
│   ├── src/
│   │   ├── server.js      # Main server file
│   │   └── config/        # Database configuration
│   └── package.json
└── DEPLOYMENT_INSTRUCTIONS.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- DeepSeek API key

### Local Development

1. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env  # Add your environment variables
npm start
```

2. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

**Backend (.env):**
```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
DEEPSEEK_API_KEY=your_deepseek_api_key
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8001/api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile (protected)

### Floor Plans
- `POST /api/floor-plans` - Generate new floor plan
- `GET /api/floor-plans/:id` - Get specific floor plan
- `GET /api/floor-plans/user/me` - Get user's floor plans

### Subscriptions & Referrals
- `GET /api/subscriptions/plans` - Get subscription plans
- `GET /api/subscriptions/me` - Get user subscription info
- `GET /api/referrals/me` - Get referral statistics

## Deployment

See [DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md) for detailed deployment steps.

- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway
- **Database**: MongoDB Atlas

## License

Private License - All rights reserved