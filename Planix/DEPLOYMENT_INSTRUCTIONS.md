# Planix Deployment Instructions

## Backend Deployment (Railway)

### 1. Deploy Backend to Railway
1. Create a new Railway project
2. Connect your GitHub repository 
3. Select the `/Planix/backend` folder as the root directory
4. Railway will automatically detect the Node.js project

### 2. Set Environment Variables in Railway
```
NODE_ENV=production
PORT=8001
MONGODB_URI=mongodb+srv://biveknunisaadtu:J6rnVTZ3jxycxogR@cluster0.o5ljd4b.mongodb.net/planix?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=planix-jwt-secret-key-2024-production-change-me
DEEPSEEK_API_KEY=sk-bacaa147c42e473f874920c4373c6ee2
DEEPSEEK_API_URL=https://api.deepseek.com
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
CORS_ORIGIN=http://localhost:3000
API_RATE_LIMIT=100
API_RATE_WINDOW=15
```

### 3. Update CORS for Production
After deploying, get your Vercel frontend URL and update `CORS_ORIGIN` in Railway:
```
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

## Frontend Deployment (Vercel)

### 1. Deploy Frontend to Vercel
1. Connect your GitHub repository to Vercel
2. Select the `/Planix/frontend` folder as the root directory
3. Vercel will automatically detect the React/Vite project

### 2. Set Environment Variables in Vercel
```
VITE_API_URL=https://your-railway-backend.up.railway.app/api
```

Replace `your-railway-backend.up.railway.app` with your actual Railway backend URL.

### 3. Build Settings (Vercel should auto-detect)
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Testing Deployment

1. **Backend Test**: Visit `https://your-railway-backend.up.railway.app/api/health`
   - Should return: `{"status":"healthy","message":"Planix Production API is running"...}`

2. **Frontend Test**: Visit your Vercel URL
   - Should show the Planix homepage with "Sign In" and "Get Started Free" buttons
   - Test user registration and login

## Production URLs Structure
- **Frontend (Vercel)**: `https://your-app.vercel.app`
- **Backend API (Railway)**: `https://your-backend.up.railway.app/api`

## Important Notes
- Make sure MongoDB Atlas IP whitelist includes `0.0.0.0/0` for Railway access
- DeepSeek API key is already configured and working
- JWT authentication is fully implemented
- All API endpoints are tested and working