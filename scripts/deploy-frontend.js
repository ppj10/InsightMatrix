#!/usr/bin/env node

/**
 * Automated Frontend Deployment Script
 * Deploys React app to Vercel with built-in safety checks
 * 
 * Usage: npm run deploy:frontend
 */

const { execSync } = require('child_process');
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

function error(message) {
  console.error(`${colors.red}❌ ${message}${colors.reset}`);
  process.exit(1);
}

function success(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function info(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

function warning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

try {
  info('Starting frontend deployment...\n');

  // 1. Check prerequisites
  log('Step 1: Checking prerequisites...', 'blue');
  
  if (!fs.existsSync(path.join(__dirname, '..', 'package.json'))) {
    error('package.json not found. Are you in the project root?');
  }

  // Check for Vercel CLI
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch (e) {
    error('Vercel CLI not installed. Run: npm install -g vercel');
  }

  success('Prerequisites checked\n');

  // 2. Check git status
  log('Step 2: Checking git status...', 'blue');
  
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    if (status.trim()) {
      warning('You have uncommitted changes:');
      console.log(status);
      const answer = require('prompt-sync')({ sigint: true })('Continue anyway? (yes/no): ');
      if (answer.toLowerCase() !== 'yes') {
        error('Deployment cancelled');
      }
    }
  } catch (e) {
    warning('Not a git repository or git not available. Continuing anyway...');
  }

  success('Git status checked\n');

  // 3. Build frontend
  log('Step 3: Building frontend...', 'blue');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (e) {
    error('Build failed. Check errors above.');
  }

  success('Frontend built successfully\n');

  // 4. Deploy to Vercel
  log('Step 4: Deploying to Vercel...', 'blue');
  log('(Follow prompts to complete deployment)\n', 'yellow');
  
  try {
    execSync('vercel --prod', { stdio: 'inherit' });
  } catch (e) {
    error('Vercel deployment failed');
  }

  success('Frontend deployed successfully!\n');

  // 5. Provide next steps
  log('What\'s next:', 'blue');
  console.log('1. Verify deployment: Check https://your-app.vercel.app');
  console.log('2. Update backend URL if needed');
  console.log('3. Test authentication flow');
  console.log('4. Check production logs: vercel logs --prod\n');

  success('Deployment complete!');

} catch (err) {
  error(`Unexpected error: ${err.message}`);
}
