# 🚀 PLANIX DEPLOYMENT GUIDE

## 📋 Prerequisites Checklist
- [ ] GitHub account
- [ ] MongoDB Atlas account 
- [ ] Railway account
- [ ] Vercel account
- [ ] DeepSeek API key

## 🗄️ 1. DATABASE SETUP (MongoDB Atlas)

### Create Database:
1. Visit: https://cloud.mongodb.com/
2. Create free M0 cluster
3. Create database user: `planix_user`
4. Set password (remember this!)
5. Add IP: `0.0.0.0/0` (allow all)
6. Get connection string

### Your MongoDB Connection String:
```
mongodb+srv://planix_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/planix
```

## 🛤️ 2. BACKEND DEPLOYMENT (Railway)

### Deploy Backend:
1. Visit: https://railway.app/
2. "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Choose `backend` folder
5. Set environment variables:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://planix_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/planix
DEEPSEEK_API_KEY=sk-bacaa147c42e473f874920c4373c6ee2
CORS_ORIGIN=*
PORT=8001
```

6. Deploy automatically
7. Get your backend URL: `https://xxx.railway.app`

## 🌐 3. FRONTEND DEPLOYMENT (Vercel)

### Deploy Frontend:
1. Visit: https://vercel.com/
2. "New Project" → Import from GitHub
3. Select your repository
4. Choose `frontend` folder
5. Set environment variables:

```env
REACT_APP_API_URL=https://YOUR_RAILWAY_URL.railway.app/api
```

6. Deploy automatically
7. Get your frontend URL: `https://xxx.vercel.app`

## ✅ 4. TESTING DEPLOYMENT

### Test Backend:
```bash
curl https://YOUR_RAILWAY_URL.railway.app/api/health
```

### Test Frontend:
Visit your Vercel URL and test floor plan generation

## 🔧 5. TROUBLESHOOTING

### Common Issues:
- **CORS Error**: Update CORS_ORIGIN with your Vercel URL
- **Database Connection**: Check MongoDB connection string
- **API Key**: Verify DeepSeek API key is correct
- **Build Errors**: Check Node.js version compatibility

### Environment Variables Template:

**Backend (.env):**
```
NODE_ENV=production
PORT=8001
MONGODB_URI=mongodb+srv://planix_user:password@cluster.mongodb.net/planix
DEEPSEEK_API_KEY=sk-bacaa147c42e473f874920c4373c6ee2
CORS_ORIGIN=https://your-frontend.vercel.app
```

**Frontend (.env):**
```
REACT_APP_API_URL=https://your-backend.railway.app/api
```

## 🎯 6. FINAL CHECKLIST

- [ ] MongoDB Atlas cluster created
- [ ] Database user configured
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set
- [ ] CORS configured correctly
- [ ] API health check passes
- [ ] Frontend loads successfully
- [ ] Floor plan generation works

## 🌟 7. LIVE URLS

Once deployed, you'll have:
- **Frontend**: https://planix-frontend.vercel.app
- **Backend**: https://planix-backend.railway.app
- **API Health**: https://planix-backend.railway.app/api/health

## 🆘 Need Help?

If you encounter issues:
1. Check Railway logs for backend errors
2. Check Vercel function logs for frontend errors
3. Verify all environment variables are set correctly
4. Test API endpoints individually

## 🚀 Ready to Deploy?

Follow the steps above and you'll have Planix running in the cloud within 15 minutes!