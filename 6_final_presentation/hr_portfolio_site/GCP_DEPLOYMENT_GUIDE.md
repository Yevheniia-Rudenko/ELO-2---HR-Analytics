# Complete GCP Cloud Run Deployment Guide

## 🎯 Overview

This guide will help you deploy the HR Analytics application to Google Cloud Run with automatic GitHub Actions deployment.

---

## 📋 Prerequisites

1. **Google Cloud Account**
   - Sign up at [cloud.google.com](https://cloud.google.com)
   - Enable billing (you get $300 free credit for 90 days)

2. **gcloud CLI** (optional, for local testing)
   ```bash
   # macOS
   brew install --cask google-cloud-sdk
   
   # Or download from: https://cloud.google.com/sdk/docs/install
   ```

3. **GitHub Account**
   - Repository already set up ✅

---

## 🚀 Step-by-Step Deployment

### Step 1: Set Up GCP Project

1. Go to [GCP Console](https://console.cloud.google.com/)

2. Create a new project (or use existing):
   - Click "Select Project" → "New Project"
   - Project name: `hr-analytics-prod`
   - Note the **Project ID** (e.g., `hr-analytics-prod-123456`)

3. Enable required APIs:
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   gcloud services enable bigquery.googleapis.com
   ```
   
   Or via Console:
   - Go to [APIs & Services](https://console.cloud.google.com/apis/dashboard)
   - Click "+ ENABLE APIS AND SERVICES"
   - Search and enable:
     - Cloud Run API
     - Container Registry API
     - BigQuery API

### Step 2: Load Data to BigQuery

1. Go to [BigQuery Console](https://console.cloud.google.com/bigquery)

2. Create dataset:
   - Click "+ CREATE DATASET"
   - Dataset ID: `IBMAnalytics`
   - Location: `US (multiple regions in United States)`
   - Click "CREATE DATASET"

3. Upload CSV data:
   - Select your dataset `IBMAnalytics`
   - Click "+ CREATE TABLE"
   - Source: Upload
   - Select file: `/Users/yevrud/ELO-2---HR-Analytics/2_data_preparation/HR-Employee-Attrition.csv`
   - Table: `employee_attrition`
   - Auto-detect schema: ✅
   - Click "CREATE TABLE"

4. Verify data:
   ```sql
   SELECT COUNT(*) as total_records
   FROM `YOUR-PROJECT-ID.IBMAnalytics.employee_attrition`
   -- Should return 1470
   ```

### Step 3: Create Service Account

1. Go to [IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)

2. Click "+ CREATE SERVICE ACCOUNT"
   - Name: `github-actions-deployer`
   - Description: `Service account for GitHub Actions deployments`
   - Click "CREATE AND CONTINUE"

3. Grant permissions:
   - Role 1: `Cloud Run Admin`
   - Role 2: `Storage Admin`
   - Role 3: `Service Account User`
   - Role 4: `BigQuery Data Viewer`
   - Click "CONTINUE" → "DONE"

4. Create key:
   - Click on the created service account
   - Go to "KEYS" tab
   - Click "ADD KEY" → "Create new key"
   - Type: JSON
   - Click "CREATE"
   - **Save the downloaded JSON file** (you'll need it for GitHub Secrets)

### Step 4: Configure GitHub Secrets

1. Go to your GitHub repository:
   https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics/settings/secrets/actions

2. Click "New repository secret" and add:

   **Secret 1: `GCP_PROJECT_ID`**
   - Name: `GCP_PROJECT_ID`
   - Value: Your GCP Project ID (e.g., `hr-analytics-prod-123456`)

   **Secret 2: `GCP_SA_KEY`**
   - Name: `GCP_SA_KEY`
   - Value: Entire contents of the downloaded JSON key file
   - (Open the file in text editor, copy all content)

### Step 5: Update api_server.py

Replace `YOUR_GCP_PROJECT_ID` with your actual project ID:

```python
# Line 16 in api_server.py
client = bigquery.Client(project='hr-analytics-prod-123456')  # Your actual project ID
```

Or better, use environment variable:

```python
import os
project_id = os.environ.get('GCP_PROJECT_ID', 'YOUR_GCP_PROJECT_ID')
client = bigquery.Client(project=project_id)
```

### Step 6: Deploy!

1. Commit and push changes:
   ```bash
   git add .
   git commit -m "Add GCP Cloud Run deployment configuration"
   git push origin main
   ```

2. GitHub Actions will automatically:
   - ✅ Build Docker image
   - ✅ Push to Google Container Registry
   - ✅ Deploy to Cloud Run
   - ✅ Make service publicly accessible

3. Check deployment status:
   - Go to [GitHub Actions](https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics/actions)
   - Click on the latest workflow run
   - Wait for green ✅

4. Get your API URL:
   - Go to [Cloud Run Console](https://console.cloud.google.com/run)
   - Click on `hr-analytics-api`
   - Copy the URL (e.g., `https://hr-analytics-api-xxxxx-uc.a.run.app`)

### Step 7: Update Frontend

Update `js/app.js` to use your Cloud Run URL:

```javascript
// Line 7 in app.js
const API_URL = 'https://hr-analytics-api-xxxxx-uc.a.run.app/api';
const USE_API_BACKEND = true;
```

Commit and push:
```bash
git add js/app.js
git commit -m "Update API URL to Cloud Run endpoint"
git push
```

---

## 🧪 Testing

### Test API endpoints:

```bash
# Replace with your Cloud Run URL
API_URL="https://hr-analytics-api-xxxxx-uc.a.run.app"

# Test health check
curl $API_URL/api/health

# Test satisfaction stats
curl $API_URL/api/satisfaction-stats

# Test all data
curl $API_URL/api/all-data
```

### Test Frontend:

1. Open your GitHub Pages site:
   https://yevheniia-rudenko.github.io/ELO-2---HR-Analytics/

2. Navigate to:
   - ✅ Overview tab (should show charts)
   - ✅ Survey tab (submit test survey)
   - ✅ Live Insights tab (check if data appears)

---

## 💰 Cost Estimation

### Cloud Run (Backend API):
- **Free tier:** 2 million requests/month
- **After free tier:** $0.40 per million requests
- **Estimated cost:** $0 - $2/month for portfolio project

### BigQuery:
- **Free tier:** 1 TB queries/month
- **Storage:** First 10 GB free
- **Estimated cost:** $0/month (well within free tier)

### Total estimated cost: **$0 - $2/month**

---

## 🔧 Troubleshooting

### Build fails:
```bash
# Check Docker builds locally
cd 6_final_presentation/hr_portfolio_site
docker build -t hr-analytics-test .
docker run -p 8080:8080 hr-analytics-test
```

### BigQuery authentication error:
- Verify service account has BigQuery Data Viewer role
- Check GCP_PROJECT_ID secret is correct
- Ensure BigQuery API is enabled

### CORS errors:
- Update CORS_ORIGINS in simple_api.py to include your domain
- Restart Cloud Run service

### 404 errors on API:
- Check Cloud Run service is deployed and running
- Verify URL is correct (should end with `/api/...`)
- Check logs in Cloud Run Console

---

## 📊 Monitoring

### View logs:
```bash
gcloud run services logs read hr-analytics-api --region us-central1
```

Or in Console:
- Go to [Cloud Run](https://console.cloud.google.com/run)
- Click on service
- Go to "LOGS" tab

### Monitor costs:
- [Billing Dashboard](https://console.cloud.google.com/billing)
- Set up budget alerts

---

## 🎉 Success!

Your application is now live at:
- **API:** https://hr-analytics-api-xxxxx-uc.a.run.app
- **Frontend:** https://yevheniia-rudenko.github.io/ELO-2---HR-Analytics/

Every push to `main` branch will automatically deploy updates! 🚀
