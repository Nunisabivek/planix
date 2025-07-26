# Troubleshooting Guide

## UI Not Showing Correctly (Blank Page or Different from Screenshots)

### Step 1: Check Backend Connection
```bash
# Test if backend is running
curl http://localhost:8001/api/health

# Expected response:
{"status":"healthy","message":"Planix Production API is running"...}
```

If this fails:
1. Make sure backend is running: `cd backend && npm start`
2. Check backend logs for errors
3. Verify MongoDB connection in `.env`

### Step 2: Check Browser Console
1. Open browser (Chrome/Firefox)
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Look for errors

**Common Errors & Fixes:**

❌ **"process is not defined"**
```
Fix: Check frontend/.env uses VITE_API_URL (not REACT_APP_API_URL)
```

❌ **"Failed to fetch" / CORS errors**
```
Fix: Backend CORS_ORIGIN should be http://localhost:3000
```

❌ **"AuthContext stuck in loading"**
```
Fix: Backend API not responding - check backend logs
```

### Step 3: Verify Environment Files

**Backend `.env` should exist and contain:**
```
NODE_ENV=development
MONGODB_URI=mongodb+srv://...your_actual_connection...
CORS_ORIGIN=http://localhost:3000
DEEPSEEK_API_KEY=sk-bacaa147c42e473f874920c4373c6ee2
JWT_SECRET=planix-jwt-secret-key-2024-production-change-me
```

**Frontend `.env` should exist and contain:**
```
VITE_API_URL=http://localhost:8001/api
```

### Step 4: Complete Reset (If Nothing Works)

```bash
# Stop all processes
# Backend: Ctrl+C in backend terminal
# Frontend: Ctrl+C in frontend terminal

# Clean install
cd backend
rm -rf node_modules package-lock.json
npm install
npm start

# In new terminal
cd frontend  
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Deployment Issues (Vercel/Railway)

### Vercel Shows Different UI

**Cause**: Environment variables not set correctly

**Fix**:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `VITE_API_URL` with value: `https://your-railway-backend.up.railway.app/api`
3. Redeploy

### Railway Backend Not Working

**Cause**: Environment variables missing

**Fix**:
1. Go to Railway Dashboard → Your Project → Variables
2. Add all variables from `backend/.env.example`
3. Make sure `CORS_ORIGIN` is your Vercel frontend URL

## Quick Debug Commands

```bash
# Check if backend is running
curl http://localhost:8001/api/health

# Check backend logs
cd backend && npm start

# Check frontend in browser
# Open http://localhost:3000 and check Console (F12)

# Verify environment variables are loaded
cd frontend && cat .env
cd backend && cat .env
```

## Expected UI Appearance

When working correctly, you should see:
- ✅ Purple gradient header
- ✅ "Planix" logo on the left
- ✅ "Sign In" button on the right
- ✅ "Get Started Free" button on the right
- ✅ Hero section with "Create Professional Floor Plans with AI"
- ✅ No loading spinners or blank areas

## Still Having Issues?

1. **Check Node.js version**: `node --version` (should be 18+)
2. **Try different browser**: Test in Chrome/Firefox/Safari
3. **Check firewall**: Make sure ports 3000 and 8001 aren't blocked
4. **Clear browser cache**: Hard refresh with Ctrl+F5