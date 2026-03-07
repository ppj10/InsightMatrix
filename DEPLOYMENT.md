# InsightMatrix - Vercel Deployment Guide

This guide covers deploying InsightMatrix to Vercel while maintaining local compatibility.

## Project Structure

- **Frontend**: React + TypeScript + Vite (automatically deployed to Vercel CDN)
- **Backend**: Node.js + Express (requires separate deployment OR conversion to serverless)
- **Database**: MongoDB (Atlas recommended for production)

## Deployment Options

### Option 1: Backend on Separate Service (Recommended for Full Stack)

Deploy frontend to Vercel and backend to a service like Render, Railway, or Heroku.

#### Local Setup

1. Create `.env.local` in project root:
```bash
VITE_API_URL=http://localhost:5000/api
```

2. Run both servers locally:
```bash
npm run dev:all  # Runs frontend + backend
```

#### Vercel Frontend Deployment

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Build frontend**:
```bash
npm run build
```

3. **Deploy to Vercel**:
```bash
vercel
```

4. **Set environment variables in Vercel dashboard**:
   - Go to Settings → Environment Variables
   - Add `VITE_API_URL`: `https://your-backend-url.com/api`

#### Backend Deployment (Example: Render)

1. Push code to GitHub

2. On Render.com:
   - New → Web Service
   - Connect GitHub repository
   - **Build Command**: `npm install`
   - **Start Command**: `npm run dev:server`
   - Add environment variables:
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Strong secret key
     - `NODE_ENV`: `production`

3. Get the deployed backend URL (e.g., `https://insightmatrix-backend.onrender.com`)

4. Update Vercel environment variable `VITE_API_URL` with this URL

### Option 2: Convert to Vercel Serverless Functions

This makes the entire app deployable on Vercel (paid plan required for databases).

#### Changes Needed

1. **Folder structure**:
```
project/
├── api/              # Vercel serverless functions
│   └── index.js     # Express app or individual route handlers
├── src/             # React frontend
└── vercel.json      # Configuration
```

2. **Create `api/index.js`**:
```javascript
import express from 'express'
import mongoose from 'mongoose'

const app = express()
// ... your express setup and routes

export default app
```

3. **Update `vercel.json`**:
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "functions": {
    "api/index.js": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    },
    {
      "source": "/api/(.*)",
      "destination": "/api"
    }
  ]
}
```

## Environment Variables

### Local Development

Create `.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

### Vercel Production

Set in Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_URL=https://your-api-domain.com/api
```

### Backend Environment Variables

```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/insightmatrix
JWT_SECRET=your-super-secret-key-min-32-chars
NODE_ENV=production
```

## Database Setup

### MongoDB Atlas (Recommended)

1. Create account at [mongodb.com/cloud](https://www.mongodb.com/cloud)
2. Create free cluster
3. Get connection string
4. Add to backend environment variables as `MONGO_URI`
5. Whitelist Vercel IP (0.0.0.0/0 for serverless)

## Security Checklist

- [ ] Change `JWT_SECRET` to a strong, random string (min 32 chars)
- [ ] Use environment variables for all sensitive data
- [ ] Enable HTTPS (Vercel handles this)
- [ ] Set `NODE_ENV=production`
- [ ] Implement rate limiting for API endpoints
- [ ] Enable MongoDB IP whitelist
- [ ] Use strong passwords for databases

## Deployment Checklist

### Frontend (Vercel)

- [ ] Build command: `npm run build`
- [ ] Install command: `npm install`
- [ ] Output directory: `dist`
- [ ] Node version: 18.x or higher
- [ ] Environment variables set
- [ ] All API URLs use environment-based URLs

### Backend (Separate Service)

- [ ] MongoDB connection string configured
- [ ] JWT secret set
- [ ] CORS configured for Vercel domain
- [ ] Health check endpoint working
- [ ] All environment variables set

## Testing Before Deployment

1. **Local Testing**:
```bash
npm run build     # Build frontend
npm run dev       # Serve production build locally
npm run dev:server # In another terminal, run backend
```

2. **Test API Calls**:
   - Signup flow
   - Login flow
   - Chart creation/update
   - User management

3. **Browser DevTools**:
   - Check Network tab for API requests
   - Verify correct API URLs being called
   - Check for CORS errors

## Troubleshooting

### "Cannot find module" errors
- Run `npm install` on deployment platform
- Check Node version compatibility

### CORS errors
- Verify backend allows requests from Vercel domain
- Check `app.use(cors())` in Express setup

### Database connection errors
- Verify MongoDB connection string
- Check IP whitelist on MongoDB Atlas
- Confirm environment variables are set

### Blank page or 404 errors
- Check Vercel deployment logs
- Verify `dist/` folder exists and is deployed
- Check build command executed successfully

## Rollback & Updates

### Update frontend
```bash
vercel --prod
```

### Update backend (if separate service)
- Push to GitHub, service redeploys automatically
- Or use deployment platform's update mechanism

## Costs

- **Vercel**: Free tier generous; Pro $20/month for team features
- **Render**: Free tier available; Paid from $7/month
- **MongoDB Atlas**: Free tier 512MB storage; $0.75/month per GB after
- **Total estimate**: $5-20/month for production

## Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud)
- [Express CORS](https://expressjs.com/en/resources/middleware/cors.html)

## Support

If issues arise:
1. Check deployment logs on Vercel/backend platform
2. Verify environment variables are set correctly
3. Test API endpoints manually using Postman/curl
4. Check browser console for errors
