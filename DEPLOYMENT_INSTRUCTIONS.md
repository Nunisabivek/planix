# Planix Deployment Instructions

## Backend Deployment (Railway)

### 1. Deploy Backend to Railway
1. Create a new Railway project at https://railway.app
2. Connect your GitHub repository 
3. Select the `/Planix/backend` folder as the root directory
4. Railway will automatically detect the Node.js project and use the `railway.toml` configuration

### 2. Set Environment Variables in Railway Dashboard
Go to your Railway project settings and add these variables:
```
NODE_ENV=production
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
After getting your Vercel frontend URL, update the `CORS_ORIGIN` environment variable in Railway:
```
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

## Frontend Deployment (Vercel)

### 1. Deploy Frontend to Vercel
1. Go to https://vercel.com and create a new project
2. Connect your GitHub repository
3. Select the `/Planix/frontend` folder as the root directory
4. Vercel will automatically detect the React/Vite project

### 2. Set Environment Variables in Vercel Dashboard
In your Vercel project settings, add this environment variable:
```
VITE_API_URL=https://your-railway-backend.up.railway.app/api
```
Replace `your-railway-backend.up.railway.app` with your actual Railway backend URL.

### 3. Build Settings (Auto-detected by Vercel)
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## GitHub Setup

### Push Code to GitHub
1. Create a new repository on GitHub
2. Add the remote origin and push:
```bash
cd /app/Planix
git remote add origin https://github.com/yourusername/planix.git
git branch -M main
git push -u origin main
```

## Testing Deployment

### 1. Backend Test
Visit: `https://your-railway-backend.up.railway.app/api/health`

Should return:
```json
{"status":"healthy","message":"Planix Production API is running","version":"2.0.0",...}
```

### 2. Frontend Test
Visit your Vercel URL and verify:
- ✅ Homepage loads with purple gradient header
- ✅ "Sign In" and "Get Started Free" buttons are visible
- ✅ User registration and login work
- ✅ Floor plan generation works for authenticated users

## Troubleshooting UI Issues

If your Vercel deployment shows a different UI than local:

### 1. Check Environment Variables
Make sure `VITE_API_URL` is set correctly in Vercel dashboard

### 2. Verify Build Logs
Check Vercel build logs for any errors during the build process

### 3. Clear Cache
In Vercel dashboard: Settings → Functions → Clear Build Cache

### 4. Redeploy
Trigger a new deployment after environment variable changes

## Production URLs Structure
- **Frontend (Vercel)**: `https://your-app.vercel.app`
- **Backend API (Railway)**: `https://your-backend.up.railway.app/api`
- **Database**: MongoDB Atlas (already configured)

## Important Notes
- ✅ MongoDB Atlas IP whitelist set to `0.0.0.0/0` (allows Railway access)
- ✅ DeepSeek API key configured and working
- ✅ JWT authentication fully implemented and tested
- ✅ All API endpoints tested and working
- ✅ Frontend optimized for production with Vite
- ✅ CORS properly configured for cross-origin requests

## Environment Variables Summary

### Railway (Backend)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=planix-jwt-secret-key-2024-production-change-me
DEEPSEEK_API_KEY=sk-bacaa147c42e473f874920c4373c6ee2
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### Vercel (Frontend)
```
VITE_API_URL=https://your-railway-backend.up.railway.app/api
```