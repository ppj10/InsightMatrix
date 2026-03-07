#!/usr/bin/env node

/**
 * Backend Deployment Helper Script
 * Generates deployment instructions for Render.com or Heroku
 * 
 * Usage: npm run deploy:backend
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(text) {
  console.log('\n' + '='.repeat(60));
  console.log(colors.blue + text + colors.reset);
  console.log('='.repeat(60) + '\n');
}

function section(text) {
  console.log(`\n${colors.blue}${text}${colors.reset}`);
  console.log('-'.repeat(40));
}

header('BACKEND DEPLOYMENT GUIDE');

log('Choose your deployment platform:', 'yellow');
console.log('1. Render.com (Recommended - Auto-deploys from GitHub)');
console.log('2. Railway.app (Quick setup)');
console.log('3. Heroku (Classic option)\n');

// Render.com Instructions
section('1️⃣  RENDER.COM DEPLOYMENT (Recommended)');

console.log(`
${colors.green}Step 1: Prepare Code${colors.reset}
1. Push code to GitHub (if not already done)
   $ git add .
   $ git commit -m "Prepare backend for production"
   $ git push origin main

${colors.green}Step 2: Create Render Account${colors.reset}
1. Go to render.com
2. Sign up with GitHub
3. Grant Render access to your repository

${colors.green}Step 3: Create Web Service${colors.reset}
1. Click "New +" → "Web Service"
2. Select your InsightMatrix repository
3. Fill in settings:
   - Name: "insightmatrix-backend"
   - Environment: "Node"
   - Build Command: npm install
   - Start Command: npm run dev:server
   - Plan: Free (or Starter $7/month for uptime)

${colors.green}Step 4: Add Environment Variables${colors.reset}
1. In Render dashboard → Environment
2. Add variables:
   - MONGO_URI: mongodb+srv://user:password@cluster...
   - JWT_SECRET: your-super-secret-key-32-chars-min
   - NODE_ENV: production

3. Click "Deploy"

${colors.green}Step 5: Get Backend URL${colors.reset}
1. After deployment completes, copy the URL:
   e.g., https://insightmatrix-backend.onrender.com

2. Update Vercel environment variable:
   VITE_API_URL=https://insightmatrix-backend.onrender.com/api

3. Redeploy frontend on Vercel
   $ npm run deploy:frontend

${colors.green}Step 6: Test${colors.reset}
1. Visit your Vercel frontend URL
2. Create new account
3. Login and verify charts work
`);

// Railway Instructions
section('2️⃣  RAILWAY.APP DEPLOYMENT');

console.log(`
${colors.green}Step 1: Install Railway CLI${colors.reset}
$ npm install -g @railway/cli

${colors.green}Step 2: Login${colors.reset}
$ railway login

${colors.green}Step 3: Initialize Project${colors.reset}
$ railway init

${colors.green}Step 4: Create Environment Variables${colors.reset}
$ railway variable add MONGO_URI "mongodb+srv://..."
$ railway variable add JWT_SECRET "your-secret"
$ railway variable add NODE_ENV "production"

${colors.green}Step 5: Deploy${colors.reset}
$ railway up

${colors.green}Step 6: Get URL${colors.reset}
$ railway domain

Then update Vercel with the domain URL.
`);

// Heroku Instructions
section('3️⃣  HEROKU DEPLOYMENT');

console.log(`
${colors.green}Step 1: Install Heroku CLI${colors.reset}
$ choco install heroku-cli  # Windows
$ brew tap heroku/brew && brew install heroku  # macOS
$ curl https://cli-assets.heroku.com/install.sh | sh  # Linux

${colors.green}Step 2: Login${colors.reset}
$ heroku login

${colors.green}Step 3: Create Heroku App${colors.reset}
$ heroku create insightmatrix-backend

${colors.green}Step 4: Add MongoDB Atlas URI${colors.reset}
$ heroku config:set MONGO_URI="mongodb+srv://user:password@cluster..."
$ heroku config:set JWT_SECRET="your-secret"
$ heroku config:set NODE_ENV="production"

${colors.green}Step 5: Deploy${colors.reset}
$ git push heroku main

${colors.green}Step 6: Get URL${colors.reset}
$ heroku apps:info
# Copy the URL (e.g., https://insightmatrix-backend.herokuapp.com)

${colors.green}Step 7: Update Vercel${colors.reset}
VITE_API_URL=https://insightmatrix-backend.herokuapp.com/api
`);

// CORS Configuration
section('🔒 IMPORTANT: CORS Configuration');

console.log(`
Make sure server.js has CORS configured for your Vercel domain:

${colors.yellow}Current CORS setup in server.js:${colors.reset}

app.use(cors({
  origin: [
    'http://localhost:5173',  // Local dev
    'http://localhost:3000',  // Alternative port
    'https://your-domain.vercel.app', // Your production domain
  ],
  credentials: true
}));

Update 'https://your-domain.vercel.app' with your actual Vercel domain!
`);

// Environment Variables Checklist
section('✅ Environment Variables Checklist');

console.log(`
Backend needs these variables:

${colors.green}Required:${colors.reset}
[ ] MONGO_URI      - From MongoDB Atlas connection string
[ ] JWT_SECRET     - Min 32 random characters
[ ] NODE_ENV       - Set to "production"

${colors.green}Optional but Recommended:${colors.reset}
[ ] CORS_ORIGIN    - Your Vercel domain
[ ] API_PORT       - Default: 5000 (some platforms force it)

${colors.yellow}To generate a secure JWT_SECRET:${colors.reset}
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
`);

// Testing checklist
section('🧪 Testing Checklist');

console.log(`
After deployment:

[ ] Backend is running:
    curl https://your-backend-url/api/health

[ ] MongoDB connection works:
    Check backend logs for "Connected to MongoDB"

[ ] Authentication flow works:
    1. Sign up with new account
    2. Login with credentials
    3. Create a chart
    4. Verify data in MongoDB

[ ] CORS allows Vercel origin:
    Check browser console for CORS errors

[ ] Environment variables are set:
    Review backend logs for correct values
`);

// Troubleshooting
section('🐛 Troubleshooting');

console.log(`
${colors.red}Error: "Cannot find module 'mongoose'"${colors.reset}
→ Run 'npm install' on deployment platform

${colors.red}Error: "MongoDB connection refused"${colors.reset}
→ Check MONGO_URI value and IP whitelist on Atlas

${colors.red}Error: "CORS error in browser console"${colors.reset}
→ Add Vercel domain to CORS origins in server.js

${colors.red}Error: "JWT_SECRET not found"${colors.reset}
→ Verify environment variable is set on platform

${colors.red}Error: "Port 5000 already in use"${colors.reset}
→ Platform assigns port automatically (check process.env.PORT)
`);

// Next steps
section('📋 Next Steps');

console.log(`
1. Choose deployment platform (Render recommended)
2. Push code to GitHub
3. Follow platform-specific steps above
4. Add environment variables
5. Deploy and get URL
6. Update Vercel with backend URL
7. Test authentication flow
8. Monitor logs for errors

${colors.green}Questions? Check DEPLOYMENT.md for more details${colors.reset}
`);
