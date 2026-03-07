# GitHub & CI/CD Setup Guide

This guide helps you set up GitHub secrets and enable automatic deployments.

## 🔐 GitHub Secrets Setup

Secrets are encrypted credentials GitHub Actions use for deployment.

### Step 1: Get Vercel API Token

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click **Create Token**
3. Name: `GitHub Actions`
4. Scope: `Full Account`
5. Click **Create**
6. **Copy the token** (you won't see it again!)

### Step 2: Get Vercel IDs

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your InsightMatrix project
3. Go to **Settings → General**
4. Copy:
   - **Project ID** (value of "Project ID")
   - Organization ID from URL: `vercel.com/{org-id}/...`

Or use this quick command:
```bash
vercel link --confirm     # Links project, shows IDs
```

### Step 3: Add GitHub Secrets

1. Go to GitHub repo → **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Add each secret:

```
Name: VERCEL_TOKEN
Value: [Your Vercel API token from Step 1]

Name: VERCEL_ORG_ID
Value: [Your Vercel Organization ID]

Name: VERCEL_PROJECT_ID
Value: [Your Vercel Project ID]

Name: BACKEND_URL (Optional - for health checks)
Value: https://your-backend-domain.com
```

4. Click **Add secret** each time

### Step 4: Verify GitHub Actions

1. Go to repo → **Actions** tab
2. You should see workflows:
   - ✅ "Deploy to Vercel"
   - ✅ "Backend Health Check"

If not, push a commit:
```bash
git add .
git commit -m "Enable GitHub Actions"
git push origin main
```

---

## 🚀 How It Works

### Auto-Deploy on Push

When you push to `main`:

```
You: git push origin main
         ↓
GitHub: Detects push to main
         ↓
Actions: Runs deploy.yml workflow
         ↓
Step 1: Checkout code
Step 2: Setup Node.js 18.x
Step 3: npm install
Step 4: npm run build (frontend)
Step 5: Deploy to Vercel
         ↓
Result: New version live in 2-5 minutes
```

### Health Check (Every 6 hours)

Keeps your backend from sleeping:

```
Every 6 hours:
         ↓
GitHub Actions runs health-check.yml
         ↓
Pings your backend URL
         ↓
If alive: ✅ Nothing happens
If dead: ❌ Optional Slack notification
```

---

## 📝 Workflow Files Explained

### deploy.yml

**When it runs**: 
- On every push to `main`
- On pull requests to `main`

**What it does**:
1. Tests build with Node 18.x and 20.x
2. If all tests pass, deploys to Vercel
3. Comments on PRs with status

**Secrets needed**:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### backend-health-check.yml

**When it runs**: 
- Every 6 hours automatically
- Or manually from Actions tab

**What it does**:
1. Pings your backend at `/api/health`
2. Logs success/failure
3. Optionally notifies Slack

**Secrets needed**:
- `BACKEND_URL` (optional)
- `SLACK_WEBHOOK_URL` (optional)

---

## 🔧 Customization

### Change Deploy Trigger

Edit `.github/workflows/deploy.yml`:

```yaml
# Deploy only on tags
on:
  push:
    tags:
      - 'v*'

# Deploy on schedule (not just push)
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  push:
    branches: [main]
```

### Change Health Check Frequency

Edit `.github/workflows/backend-health-check.yml`:

```yaml
on:
  schedule:
    - cron: '0 */12 * * *'  # Every 12 hours instead of 6
```

[Cron syntax reference](https://crontab.guru/)

### Add Slack Notifications

1. Create Slack Workspace webhook:
   - Slack workspace → Apps → API
   - Create webhook pointing to #deployments channel
   - Copy webhook URL

2. Add GitHub secret:
   - Name: `SLACK_WEBHOOK_URL`
   - Value: Your webhook URL

3. Workflow uses it automatically!

---

## 🔍 Debugging Workflows

### View Workflow Logs

1. Go to repo → **Actions**
2. Click the workflow run (shows commit message)
3. Click **build-and-test** or **deploy-frontend**
4. See full logs with timestamps

### Common Issues

**"Secret 'VERCEL_TOKEN' not set"**
- ❌ Secret not added to repo
- ✅ Go to Settings → Secrets and re-add

**"Deploy failed - permission denied"**
- ❌ VERCEL_TOKEN is wrong or expired
- ✅ Get new token from vercel.com/account/tokens

**"Build failed - cannot find module"**
- ❌ package.json is missing a dependency
- ✅ Run `npm install` locally and commit package-lock.json

**"Vercel: Could not find project"**
- ❌ Wrong VERCEL_PROJECT_ID
- ✅ Verify ID matches your Vercel project

---

## 📊 Monitoring Deployments

### View All Deployments

**On Vercel**:
1. Project Dashboard → Deployments
2. Shows all versions with timestamps
3. Click to see build logs

**On GitHub**:
1. Repo → Actions tab
2. Shows all workflow runs
3. Click to see logs and status

### Rollback to Previous Version

**On Vercel**:
1. Go to Deployments
2. Find previous version
3. Click "..." menu
4. Select "Promote to Production"

Takes ~30 seconds to rollback.

---

## 🛑 Disable Auto-Deploy (If Needed)

### Temporarily Disable

1. Edit `.github/workflows/deploy.yml`:
```yaml
on:
  # Comment out or remove the trigger
  # push:
  #   branches: [main]
```

2. Push the change
3. Deployments stop until you re-enable

### Permanently Delete

```bash
rm .github/workflows/deploy.yml
git add .
git commit -m "Remove CI/CD"
git push
```

---

## ✅ Complete Setup Checklist

- [ ] Vercel token created and copied
- [ ] Vercel Project ID found
- [ ] Vercel Org ID found
- [ ] All 3 secrets added to GitHub:
  - [ ] `VERCEL_TOKEN`
  - [ ] `VERCEL_ORG_ID`
  - [ ] `VERCEL_PROJECT_ID`
- [ ] Backend URL secret added (optional):
  - [ ] `BACKEND_URL`
- [ ] Slack webhook added (optional):
  - [ ] `SLACK_WEBHOOK_URL`
- [ ] Pushed a test commit to main
- [ ] Verified deployment completed (check Vercel)
- [ ] Checked Actions tab for successful run

---

## 🚀 Test Your Setup

### Test 1: Deploy via Actions

```bash
git add .
git commit -m "Test GitHub Actions"
git push origin main
```

Then:
1. Go to GitHub → Actions
2. Watch build progress
3. See status in real-time
4. When complete, visit your Vercel URL

### Test 2: Manual Trigger

1. Go to GitHub → Actions
2. Select "Backend Health Check"
3. Click "Run workflow"
4. Choose branch: main
5. Click "Run workflow"
6. View logs to confirm it works

---

## 📚 Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [GitHub Secrets Docs](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [Vercel GitHub Integration](https://vercel.com/docs/deployments/github)
- [Cron Expression Generator](https://crontab.guru/)
- [Slack Webhook Integration](https://api.slack.com/messaging/webhooks)

---

## 🎯 Next Steps

1. Set up all 3 required secrets
2. Push a test commit
3. Monitor first deployment in Actions tab
4. Check Vercel to confirm it's live
5. (Optional) Set up Slack notifications

**When this is done, your app will auto-deploy every time you push to main!**
