# Complete Deployment Setup Guide

You now have everything set up for deploying InsightMatrix. Here's how to use it all.

## 📁 What's Been Created

### Documentation
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - High-level deployment overview with options
- **[MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)** - Detailed MongoDB Atlas cloud database setup
- **[DEPLOYMENT_QUICK_START.md](DEPLOYMENT_QUICK_START.md)** - This file: quick reference guide

### Automation Scripts
- **[scripts/deploy-frontend.js](scripts/deploy-frontend.js)** - Interactive Vercel deployment with safety checks
- **[scripts/deploy-backend.js](scripts/deploy-backend.js)** - Backend platform comparison and deployment instructions

### CI/CD Workflows
- **[.github/workflows/deploy.yml](.github/workflows/deploy.yml)** - Auto-deploy to Vercel on push to main
- **[.github/workflows/backend-health-check.yml](.github/workflows/backend-health-check.yml)** - Keeps backend alive (prevents free tier sleep)

### Environment Configuration
- **[.env.local](.env.local)** - Local development (already created)
- **[vercel.json](vercel.json)** - Vercel deployment config (already created)

---

## 🚀 Quick Start Deployment

### For Immediate Local Testing (No changes needed!)
```bash
npm run dev:all
```
Frontend: http://localhost:5173  
Backend: http://localhost:5000

### For Production Deployment

#### Phase 1: Database Setup (5 minutes)
```bash
1. Go to mongodb.com/cloud/atlas
2. Create free account
3. Create M0 cluster (512MB)
4. Create user: insightmatrix_user
5. Whitelist IP: 0.0.0.0/0
6. Get connection string
7. Save to safe place
```

See [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md) for detailed steps with screenshots.

#### Phase 2: Deploy Backend (10-15 minutes)
```bash
npm run deploy:backend
```
This opens an interactive guide showing:
- Render.com (recommended - easiest)
- Railway.app
- Heroku

Choose your platform and follow the step-by-step instructions.

#### Phase 3: Deploy Frontend (5 minutes)
```bash
npm run deploy:frontend
```
Builds your app and deploys it to Vercel with safety checks.

---

## 🔧 Configuration Files Explained

### vercel.json
Tells Vercel how to build and run your app:
```json
{
  "buildCommand": "npm run build",
  "env": {
    "VITE_API_URL": "@vite_api_url"  // From Vercel dashboard
  }
}
```

### .github/workflows/deploy.yml
Auto-deploys frontend whenever you push to main:
```bash
git push origin main  # Automatically triggers deployment
```

Requires secrets (set in GitHub repo settings):
- `VERCEL_TOKEN` - Get from Vercel account
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

### .github/workflows/backend-health-check.yml
Keeps your backend alive by pinging it every 6 hours.

Requires secret:
- `BACKEND_URL` - Your deployed backend URL (e.g., https://backend.onrender.com)

---

## 📋 Setup Checklist

### ✅ Prerequisites (Before Deployment)

- [ ] MongoDB Atlas account created
- [ ] Database created and connection string saved
- [ ] Vercel account created (link GitHub)
- [ ] Render.com account created (or Railway/Heroku)
- [ ] GitHub repository with code pushed

### ✅ Local Development Setup

- [ ] `.env.local` created with `VITE_API_URL=http://localhost:5000/api`
- [ ] `npm install` completed
- [ ] `npm run dev:all` works locally
- [ ] Can signup/login and create charts

### ✅ MongoDB Setup

- [ ] Cluster created on Atlas
- [ ] User `insightmatrix_user` created with strong password
- [ ] IP whitelist set to `0.0.0.0/0`
- [ ] Connection string copied and saved
- [ ] Local connection tested: check backend logs for "Connected to MongoDB"

### ✅ Backend Deployment

- [ ] Backend pushed to GitHub
- [ ] Deployment platform chosen (Render/Railway/Heroku)
- [ ] Environment variables set:
  - `MONGO_URI` = MongoDB Atlas connection string
  - `JWT_SECRET` = Generated strong secret
  - `NODE_ENV` = production
- [ ] Backend deployed and URL obtained
- [ ] Backend is responding: `curl https://your-backend.com/api/health`

### ✅ Frontend Deployment

- [ ] Frontend pushed to GitHub latest version
- [ ] GitHub Secrets configured (if using CI/CD):
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`
- [ ] Vercel environment variable set:
  - `VITE_API_URL` = Your backend URL with `/api`
- [ ] Frontend deployed to Vercel
- [ ] Can access at `https://your-domain.vercel.app`

### ✅ Post-Deployment Testing

- [ ] [ ] Signup works on production
- [ ] [ ] Login works with correct credentials
- [ ] [ ] Can create a new chart
- [ ] [ ] Charts display in ChartsSection
- [ ] [ ] Metrics update based on chart data
- [ ] [ ] Can delete charts
- [ ] [ ] No console errors (check DevTools)
- [ ] [ ] No CORS errors in network tab

---

## 🔐 Environment Variables Reference

### Frontend (in Vercel Dashboard)
```
VITE_API_URL=https://your-backend-url/api
```

### Backend (on Render/Railway/Heroku)
```
MONGO_URI=mongodb+srv://insightmatrix_user:password@cluster.mongodb.net/insightmatrix
JWT_SECRET=your-super-secret-key-minimum-32-characters
NODE_ENV=production
```

### CI/CD (GitHub Secrets)
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id  
VERCEL_PROJECT_ID=your_project_id
BACKEND_URL=https://your-backend-url
SLACK_WEBHOOK_URL=optional_slack_notification
```

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
└────────────────────┬────────────────────────────────────┘
                     │ https://your-app.vercel.app
                     ▼
         ┌───────────────────────┐
         │  VERCEL (Frontend)    │
         │ React + TypeScript    │
         │ Auto-deploys on push  │
         └───────────┬───────────┘
                     │ API calls to /api
                     ▼
         ┌───────────────────────┐
         │ Render/Railway/Heroku │
         │ Node.js + Express     │
         │ (Backend)             │
         └───────────┬───────────┘
                     │ Database queries
                     ▼
         ┌───────────────────────┐
         │  MongoDB Atlas        │
         │ (Cloud Database)      │
         │ Auto-backups every 24h│
         └───────────────────────┘
```

---

## 🚦 Troubleshooting

### Frontend Deployment Issues

**Error: "Build failed"**
- Check `npm run build` works locally
- Verify no TypeScript errors: `npm run lint`
- Check `vite.config.ts` is correct

**Error: "Cannot find module"**
- Run `npm install` locally
- Check `package.json` has all dependencies
- Vercel installs from package-lock.json

**Error: "CORS error in console"**
- Update backend CORS to allow Vercel domain
- Verify `VITE_API_URL` is correct in Vercel
- Wait 5 mins for redeployment

### Backend Deployment Issues

**Error: "MongoDB connection refused"**
- Check `MONGO_URI` connection string
- Verify IP is whitelisted on Atlas (0.0.0.0/0 for serverless)
- URL-encode special characters (@, :, !)

**Error: "Cannot find module 'mongoose'"**
- Platform didn't run `npm install`
- Check build command is `npm install`
- Restart deployment

**Error: "Backend returning 502"**
- Check backend logs on deployment platform
- Verify all environment variables are set
- Restart backend service

### Database Issues

**MongoDB cluster paused/stopped**
- Free tier pauses after 60 days inactivity
- Click "Resume" in MongoDB Atlas
- Upgrade to M2 for always-on ($9/month)

**Database size exceeded (512MB)**
- Delete old/test data
- Upgrade to M2 or M5 plan
- Consider archiving old data

---

## 📈 Monitoring & Maintenance

### GitHub Actions
All workflows run automatically but you can:
1. View status: GitHub repo → Actions tab
2. Check logs: Click workflow → Click build
3. Re-run: Click "Re-run all jobs"

### MongoDB Atlas
Monitor in dashboard:
- **Metrics** → See connection count, operations/sec
- **Activity Feed** → Recent database changes
- **Backup** → Manual snapshots, automatic daily backups

### Vercel
Monitor in dashboard:
- **Deployments** → See all deploy history
- **Logs** → Real-time request logs
- **Analytics** → Web vitals, performance

---

## 🔄 Updating Your App

### Update Frontend
```bash
git add .
git commit -m "Feature: Add new feature"
git push origin main
# Automatically deploys to Vercel in 2-5 minutes
```

### Update Backend
```bash
git add .
git commit -m "Fix: Backend bug"
git push origin main
# Automatically redeploys from whatever platform you chose
```

### Update Database Schema
1. Push code changes with new schema
2. Deployment will create new collections automatically
3. Existing data is preserved

---

## 💰 Cost Breakdown

| Service | Free Tier | Cost |
|---------|-----------|------|
| **Vercel** | 100GB bandwidth/month | $20/mo (Pro) |
| **Render** | Free with 7-day rebuild limit | $7/mo (Starter) |
| **MongoDB Atlas** | 512MB storage | $9/mo (M2 upgrade) |
| **GitHub Actions** | 2,000 minutes/month | Included |
| **Total Estimate** | $0-10/mo | ~$16-26/mo |

---

## 🎯 Next Steps

1. **Start with local testing:**
   ```bash
   npm run dev:all
   ```

2. **Then follow MongoDB setup:**
   See [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)

3. **Deploy backend:**
   ```bash
   npm run deploy:backend
   ```

4. **Deploy frontend:**
   ```bash
   npm run deploy:frontend
   ```

5. **Configure CI/CD (optional):**
   - Get Vercel API token
   - Add GitHub secrets
   - Next push triggers auto-deployment

---

## 📚 Resources

- [Deployment Overview](DEPLOYMENT.md)
- [MongoDB Atlas Setup](MONGODB_ATLAS_SETUP.md)
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Express.js Deployment](https://expressjs.com/en/advanced/best-practice-performance.html)

---

## ✨ Summary

You now have:
- ✅ Cloud database ready (MongoDB Atlas)
- ✅ Interactive deployment scripts (Render/Heroku/Railway)
- ✅ Auto-deployment on GitHub push (CI/CD)
- ✅ Backend health monitoring
- ✅ Complete documentation

**Your app is production-ready. Deploy when you're ready!**
