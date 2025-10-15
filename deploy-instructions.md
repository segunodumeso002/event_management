# 🚀 Production Deployment Guide

## Prerequisites
1. AWS Account (Free Tier)
2. Netlify Account (Free)
3. Production API Keys

## 🗄️ STEP 1: Set Up AWS RDS (PostgreSQL Database)

### 1.1 Create RDS Instance
```bash
# Go to AWS Console > RDS > Create Database
# Choose: PostgreSQL
# Template: Free tier
# DB instance identifier: event-management-db
# Master username: postgres
# Master password: [secure password]
# DB instance class: db.t3.micro (free tier)
# Storage: 20 GB (free tier limit)
# Public access: Yes (for initial setup)
```

### 1.2 Configure Security Group
```bash
# Add inbound rule:
# Type: PostgreSQL
# Port: 5432
# Source: 0.0.0.0/0 (for development, restrict in production)
```

### 1.3 Create Database and Tables
```bash
# Connect to RDS using pgAdmin or psql
# Create database: event_management
# Run the SQL from backend/db_schema.sql
```

## 🔧 STEP 2: Deploy Backend to AWS Lambda

### 2.1 Install AWS CLI and Serverless
```bash
# Install AWS CLI
npm install -g @aws-cli/cli

# Install Serverless Framework
npm install -g serverless

# Configure AWS credentials
aws configure
```

### 2.2 Install Backend Dependencies
```bash
cd backend
npm install
```

### 2.3 Update Production Environment
```bash
# Copy .env.production to .env
# Update with real values:
# - DATABASE_URL: Your RDS endpoint
# - JWT_SECRET: Generate secure random string
# - API keys: Real Google Maps, Stripe, EmailJS keys
# - CLIENT_URL: Your Netlify domain
```

### 2.4 Deploy to Lambda
```bash
cd backend
serverless deploy
```

### 2.5 Note Your API Gateway URL
```bash
# After deployment, note the endpoint URL:
# https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
```

## 🌐 STEP 3: Deploy Frontend to Netlify

### 3.1 Update Frontend Environment
```bash
# Copy .env.production to .env
# Update VITE_API_URL with your Lambda API Gateway URL
# Add real API keys
```

### 3.2 Build for Production
```bash
npm run build
```

### 3.3 Deploy to Netlify
```bash
# Option 1: Drag & Drop
# - Go to netlify.com
# - Drag the 'dist' folder to deploy

# Option 2: Git Integration
# - Connect your GitHub repo
# - Set build command: npm run build
# - Set publish directory: dist
# - Add environment variables in Netlify dashboard
```

### 3.4 Configure Netlify
```bash
# Add environment variables in Netlify:
# Site settings > Environment variables
# Add all VITE_ variables from .env.production
```

## 🔐 STEP 4: Security Configuration

### 4.1 Update CORS in Lambda
```bash
# Your Lambda will automatically use CLIENT_URL for CORS
# Make sure CLIENT_URL in backend .env matches your Netlify domain
```

### 4.2 Restrict Database Access
```bash
# Update RDS security group
# Change source from 0.0.0.0/0 to Lambda's IP range
# Or use VPC for better security
```

## 🧪 STEP 5: Test Production Deployment

### 5.1 Test API Endpoints
```bash
# Test your Lambda API:
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/events
```

### 5.2 Test Frontend
```bash
# Visit your Netlify domain
# Test user registration, login, event creation
# Verify all features work
```

## 💰 Cost Estimation (Free Tier)
- **Lambda**: 1M requests/month FREE
- **RDS**: 750 hours/month FREE (t3.micro)
- **API Gateway**: 1M requests/month FREE
- **Netlify**: 100GB bandwidth/month FREE
- **Total**: $0/month for first 12 months

## 🔧 Troubleshooting

### Common Issues:
1. **CORS Errors**: Check CLIENT_URL in backend .env
2. **Database Connection**: Verify RDS endpoint and credentials
3. **API Keys**: Ensure all production keys are valid
4. **Build Errors**: Check environment variables in Netlify

### Logs:
```bash
# View Lambda logs
serverless logs -f api

# View Netlify deploy logs
# Check in Netlify dashboard > Deploys
```

## 📝 Post-Deployment Checklist
- [ ] Database connected and tables created
- [ ] All API endpoints working
- [ ] Frontend can communicate with backend
- [ ] User registration/login working
- [ ] Event creation/editing working
- [ ] Email notifications working (if configured)
- [ ] Payment processing working (if configured)
- [ ] Google Maps working (if configured)

## 🔄 Future Updates
```bash
# Backend updates
cd backend
serverless deploy

# Frontend updates
npm run build
# Redeploy to Netlify (auto if using Git integration)
```