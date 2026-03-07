# MongoDB Atlas Setup Guide

MongoDB Atlas is a cloud-hosted MongoDB service (free tier available). This guide covers setting up production database for InsightMatrix.

## Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Sign Up** (use Google, GitHub, or email)
3. Create account and verify email
4. Accept terms and create free account

## Step 2: Create Your First Cluster

1. On dashboard, click **Create a Deployment**
2. Select **Free** tier (M0 - 512MB storage)
3. Choose provider: **AWS**
4. Choose region: **US East (N. Virginia)** or nearest to your location
5. Click **Create Deployment**
6. Wait 2-3 minutes for cluster creation

## Step 3: Configure Security

### Create Database User

1. Left sidebar → **Database Access**
2. Click **+ Add New Database User**
3. **Authentication Method**: Select "Password"
4. **Username**: `insightmatrix_user`
5. **Password**: Generate strong password (save this!)
   - Click **Autogenerate Secure Password**
   - Copy password to safe place (password manager)
6. **Database User Privileges**: Select "Built-in Role"
   - Choose: `readWriteAnyDatabase`
7. Click **Add User**

### Whitelist IP Addresses

1. Left sidebar → **Network Access**
2. Click **+ Add IP Address**
3. Select **ALLOW ACCESS FROM ANYWHERE**
   - IP: `0.0.0.0/0` (required for Vercel/serverless)
4. Description: `"Vercel and local development"`
5. Click **Confirm**

⚠️ **Security Note**: `0.0.0.0/0` allows any IP. For production, whitelist only specific IPs (Vercel, your office, CI/CD runners).

## Step 4: Get Connection String

1. Left sidebar → **Databases**
2. Click **Connect** on your cluster
3. Choose **Drivers** (not MongoDB Compass)
4. Select **Node.js** driver
5. Copy connection string:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. **Replace placeholders**:
   - `<username>` → `insightmatrix_user`
   - `<password>` → Your generated password (URL-encode special chars)

**Example** (with URL encoding):
```
mongodb+srv://insightmatrix_user:MyP%40ssw0rd123@cluster0.t8x5y2p.mongodb.net/insightmatrix?retryWrites=true&w=majority
```

## Step 5: Verify Connection Locally

1. In project root, update `.env.local`:
```bash
VITE_API_URL=http://localhost:5000/api
MONGO_URI=mongodb+srv://insightmatrix_user:PASSWORD@cluster0.xxxxx.mongodb.net/insightmatrix?retryWrites=true&w=majority
```

2. Start backend:
```bash
npm run dev:server
```

3. Watch for connection message in console:
```
✅ Connected to MongoDB
Server running on http://localhost:5000
```

If you see connection errors:
- Check username/password in connection string
- Verify IP is whitelisted (0.0.0.0/0)
- Ensure special characters are URL-encoded (use [urlencoder.org](https://www.urlencoder.org/))

## Step 6: Create Database Collections

First test auth flow (automatically creates collections):

1. Start frontend:
```bash
npm run dev
```

2. Click "Sign Up"
3. Create test account with email/password
4. Login with credentials

In MongoDB Atlas → **Collections**, you should see:
- `insightmatrix` database
- `admins` collection (with your test account)
- `users` collection (empty initially)
- `charts` collection (empty initially)

## Step 7: Setup for Vercel

1. Vercel Dashboard → Project Settings → **Environment Variables**

2. Add production variables:
   - **Name**: `MONGO_URI`
   - **Value**: Your connection string
   - **Environments**: Select "Production"
   - Click **Save**

3. Add backend URL (if deploying backend separately):
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-render.onrender.com/api`
   - **Environments**: Select "Production"
   - Click **Save**

4. Redeploy on Vercel:
```bash
vercel --prod
```

## Optional: MongoDB Data Management

### Create Admin Account Manually

In MongoDB Atlas → **Collections**:

1. Click `insightmatrix.admins`
2. Click **Insert Document**
3. Paste JSON:
```json
{
  "_id": {
    "$oid": "507f1f77bcf86cd799439011"
  },
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "hashedpasswordhere",
  "createdAt": {
    "$date": "2026-03-07T00:00:00.000Z"
  }
}
```

⚠️ **Note**: Password must be hashed! Use signup form instead.

### Monitor Connections

Left sidebar → **Metrics**:
- **Connections**: Active connections to database
- **Operations**: Read/Write operations per second
- **Storage**: Database size usage

### Backup Your Data

1. Left sidebar → **Backup and Restore**
2. MongoDB Atlas automatically backs up daily (free tier)
3. For manual backup:
   - Use MongoDB Compass (desktop app)
   - Or export via Vercel/backend logs

## Troubleshooting

### "Access Denied" or Authentication Error

```
MongoError: Authentication failed
```

**Fix**:
- Check username/password in connection string
- Verify IP is whitelisted
- URL-encode special characters (`@` → `%40`, `:` → `%3A`)

### Connection Timeout

```
Timeout awaiting 'socket' event [30000ms]
```

**Fix**:
- Check network connection
- Verify IP is whitelisted (must include Vercel region)
- Try direct IP instead of DNS (MongoDB Atlas → Connect → Advanced)

### Cluster Paused/Stopped

```
Error: Cluster not found
```

**Fix**:
- Check MongoDB Atlas → Clusters → Verify cluster is running
- Free tier pauses after 60 days of inactivity
- Click resume to reactivate

### Database Size Exceeded (512MB)

**Upgrade**:
1. Clusters → Click cluster name
2. Billing → Change Tier from M0 to M2 ($9/month)
3. Confirm upgrade

## Costs Summary

| Service | Free Tier | Monthly Cost |
|---------|-----------|--------------|
| MongoDB Atlas | 512MB storage | $0 (M0) |
| Upgrade to M2 | 10GB storage | $9/month |
| Upgrade to M5 | 100GB storage | From $57/month |
| Auto-backups | 30 days retention | Included |

## Security Best Practices

✅ **DO**:
- Use strong passwords (16+ characters, mixed case, numbers, symbols)
- Store connection string in `.env` files (never commit)
- Use separate users for dev/production
- Whitelist specific IPs for production
- Enable IP access list (default enabled)
- Rotate passwords every 90 days

❌ **DON'T**:
- Hardcode connection strings in code
- Commit `.env` files to Git
- Use `0.0.0.0/0` for production (only for dev/testing)
- Share connection strings via email/Slack
- Use simple passwords like `password123`

## Next Steps

After verifying local connection:
1. Deploy backend to Render/Heroku/Railway
2. Deploy frontend to Vercel
3. Test authentication flow on production
4. Monitor database performance in MongoDB Atlas metrics
5. Set up automated backups (optional: third-party backup service)

## Support & Resources

- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Connection String Reference](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [Network Security](https://www.mongodb.com/docs/atlas/security/ip-access-list/)
- [FAQ](https://www.mongodb.com/docs/atlas/faq/)
