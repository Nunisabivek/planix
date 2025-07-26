# Local Setup Guide

## If you're installing from GitHub

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/planix.git
cd planix
```

### 2. Backend Setup
```bash
cd backend
npm install
```

**Create `.env` file in backend folder:**
```bash
cp .env.example .env
```

**Edit `.env` with your actual values:**
```
NODE_ENV=development
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

**Start backend:**
```bash
npm start
```
Backend should run on http://localhost:8001

### 3. Frontend Setup (in new terminal)
```bash
cd frontend
npm install
```

**Create `.env` file in frontend folder:**
```bash
cp .env.example .env
```

**The `.env` should contain:**
```
VITE_API_URL=http://localhost:8001/api
```

**Start frontend:**
```bash
npm run dev
```
Frontend should run on http://localhost:3000

### 4. Verify Setup
1. Backend health: http://localhost:8001/api/health
2. Frontend: http://localhost:3000 (should show purple header with login buttons)

## Common Issues & Fixes

### Issue: "process is not defined" error
**Fix:** Make sure you're using `VITE_API_URL` (not `REACT_APP_API_URL`)

### Issue: Blank page / no UI
**Causes:**
1. Backend not running (check http://localhost:8001/api/health)
2. Wrong environment variables
3. CORS issues

**Debug steps:**
1. Open browser console (F12) and check for errors
2. Check if backend is running: `curl http://localhost:8001/api/health`
3. Verify `.env` files are created with correct values

### Issue: Authentication not working
**Fix:** Ensure MongoDB connection string is correct and MongoDB Atlas allows connections from your IP (or use 0.0.0.0/0)

### Issue: API calls failing
**Fix:** Check CORS settings in backend - make sure CORS_ORIGIN matches your frontend URL

## Port Configuration
- **Backend**: http://localhost:8001
- **Frontend**: http://localhost:3000  
- **API Endpoints**: http://localhost:8001/api/*

## Required Dependencies
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- DeepSeek API key