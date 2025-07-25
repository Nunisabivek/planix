# Planix - AI-Powered Floor Plan Generator

## 🏠 Overview
Planix is an AI-powered floor plan generator that creates detailed architectural plans with material estimates and IS code compliance for Indian building standards.

## 🚀 Features
- **AI Floor Plan Generation** (DeepSeek API)
- **Material Estimation** (Bricks, Cement, Steel, Sand, Aggregate)
- **IS Code Compliance** (Indian Building Standards)
- **Subscription Management** (Free, Pro, Enterprise)
- **Referral System** with credits
- **Real-time Generation Status**

## 🛠️ Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **AI**: DeepSeek API
- **Database**: MongoDB Atlas
- **Deployment**: Vercel (Frontend) + Railway (Backend)

## 📁 Project Structure
```
Planix/
├── frontend/          # React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── context/
│   └── package.json
├── backend/           # Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   └── services/
│   └── package.json
└── README.md
```

## 🔧 Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

### Backend (.env)
```
NODE_ENV=production
PORT=8001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/planix
DEEPSEEK_API_KEY=your-deepseek-api-key
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

## 🚀 Deployment

### 1. **Frontend (Vercel)**
- Connect GitHub repository
- Set build command: `npm run build`
- Set output directory: `dist`
- Deploy automatically on push

### 2. **Backend (Railway)**
- Connect GitHub repository
- Set start command: `node src/complete_server.js`
- Configure environment variables
- Deploy automatically on push

### 3. **Database (MongoDB Atlas)**
- Create cluster
- Set up database user
- Configure IP whitelist
- Get connection string

## 🎯 API Endpoints

### Users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user details

### Floor Plans
- `POST /api/floor-plans` - Generate floor plan
- `GET /api/floor-plans/:id` - Get plan details
- `GET /api/floor-plans/user/:userId` - Get user's plans

### Subscriptions
- `GET /api/subscriptions/plans` - Get pricing plans
- `GET /api/subscriptions/:userId` - Get user subscription

### Referrals
- `POST /api/referrals/generate/:userId` - Generate referral code
- `GET /api/referrals/:userId` - Get referral stats

## 🎨 Usage Example

```javascript
// Create user
const user = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe',
    phone: '+91-9876543210'
  })
});

// Generate floor plan
const plan = await fetch('/api/floor-plans', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-id',
    description: '3 bedroom house with open kitchen',
    area: 1200,
    rooms: 3,
    bathrooms: 2,
    location: 'Mumbai, Maharashtra',
    features: ['open_kitchen', 'balcony']
  })
});
```

## 🔑 Required API Keys
- **DeepSeek API Key**: Get from https://platform.deepseek.com/
- **MongoDB Atlas**: Get from https://cloud.mongodb.com/
- **Razorpay** (Optional): For payment processing

## 📱 Live Demo
- **Frontend**: https://planix-frontend.vercel.app
- **Backend**: https://planix-backend.railway.app
- **API Health**: https://planix-backend.railway.app/api/health

## 🛡️ Security Features
- Rate limiting
- CORS protection
- Input validation
- Helmet.js security headers

## 🚀 Getting Started Locally

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. **Set environment variables**
4. **Start development**:
   ```bash
   # Frontend
   cd frontend && npm run dev
   
   # Backend
   cd backend && node src/complete_server.js
   ```

## 📞 Support
For support, email support@planix.com or visit our documentation.

## 📄 License
MIT License - see LICENSE file for details.