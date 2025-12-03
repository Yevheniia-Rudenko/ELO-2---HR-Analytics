# 🚀 Technical Deployment Guide

## 📋 Overview

This guide provides step-by-step instructions for deploying the HR Analytics Platform in different environments.

---

## 🎯 Deployment Options

### Option 1: Static Demo (Recommended for Portfolio/Presentations)

**✅ Pros:**

- No setup required
- Works offline
- Fast loading
- No costs
- Perfect for demos

**❌ Cons:**

- Static data only
- No real-time updates
- Forms don't persist data

**Use Cases:**

- Portfolio presentations
- Job interviews
- Educational demonstrations
- Quick prototypes

---

### Option 2: Local Development with GCP Integration

**✅ Pros:**

- Full functionality
- Real database
- Local testing
- No deployment needed

**❌ Cons:**

- Requires GCP setup
- Internet connection needed
- Service account configuration

**Use Cases:**

- Development and testing
- Small team usage
- Learning GCP integration

---

### Option 3: Production Deployment (Google Cloud Run)

**✅ Pros:**

- Scalable
- Highly available
- Automatic HTTPS
- Pay-per-use pricing
- Global CDN

**❌ Cons:**

- Requires GCP billing
- More complex setup
- Ongoing maintenance

**Use Cases:**

- Real company deployment
- Public-facing applications
- Production environments

---

## 📦 Option 1: Static Demo Deployment

### Step 1: Prepare Files

```bash
cd ELO-2---HR-Analytics/6_final_presentation/hr_portfolio_site
```

### Step 2: Test Locally

```bash
# Option A: Python HTTP Server
python3 -m http.server 8000

# Option B: Node.js HTTP Server
npx http-server -p 8000

# Open in browser
open http://localhost:8000
```

### Step 3: Deploy to GitHub Pages

```bash
# 1. Create gh-pages branch
git checkout -b gh-pages

# 2. Copy portfolio files to root
cp -r 6_final_presentation/hr_portfolio_site/* .

# 3. Commit and push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# 4. Enable GitHub Pages
# Go to: Settings > Pages > Source: gh-pages branch
```

**Your site will be live at:**
`https://YOUR_USERNAME.github.io/ELO-2---HR-Analytics/`

### Step 4: Deploy to Netlify (Alternative)

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Deploy
cd 6_final_presentation/hr_portfolio_site
netlify deploy --prod

# Follow prompts, select directory
```

**Benefits:**

- Custom domain support
- Automatic HTTPS
- Continuous deployment
- Free tier available

---

## 🔧 Option 2: Local Development with GCP

### Prerequisites

- Google Cloud Account (free tier available)
- Python 3.9+
- `gcloud` CLI installed

### Step 1: GCP Project Setup

```bash
# 1. Create new project
gcloud projects create YOUR_PROJECT_ID --name="HR Analytics"

# 2. Set default project
gcloud config set project YOUR_PROJECT_ID

# 3. Enable required APIs
gcloud services enable bigquery.googleapis.com
gcloud services enable iam.googleapis.com

# 4. Get project number
gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)"
```

### Step 2: BigQuery Setup

```bash
# 1. Create dataset
bq mk --dataset --location=US YOUR_PROJECT_ID:IBMAnalytics

# 2. Create table schema
cat > employee_schema.json << 'EOF'
[
  {"name": "Age", "type": "INTEGER"},
  {"name": "Attrition", "type": "STRING"},
  {"name": "Department", "type": "STRING"},
  {"name": "JobSatisfaction", "type": "INTEGER"},
  {"name": "MonthlyIncome", "type": "INTEGER"},
  {"name": "OverTime", "type": "STRING"},
  {"name": "WorkLifeBalance", "type": "INTEGER"}
]
EOF

# 3. Create table
bq mk --table \
  YOUR_PROJECT_ID:IBMAnalytics.employee_attrition \
  employee_schema.json

# 4. Load sample data (if you have CSV)
bq load \
  --source_format=CSV \
  --skip_leading_rows=1 \
  YOUR_PROJECT_ID:IBMAnalytics.employee_attrition \
  path/to/data.csv \
  employee_schema.json
```

### Step 3: Service Account Creation

```bash
# 1. Create service account
gcloud iam service-accounts create hr-analytics-sa \
  --display-name="HR Analytics Service Account"

# 2. Grant BigQuery permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:hr-analytics-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/bigquery.dataEditor"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:hr-analytics-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/bigquery.jobUser"

# 3. Download credentials
gcloud iam service-accounts keys create ~/hr-analytics-key.json \
  --iam-account=hr-analytics-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### Step 4: Configure Application

```bash
# 1. Update configuration files
cd 6_final_presentation/hr_portfolio_site

# 2. Edit api_server.py
# Replace 'YOUR_GCP_PROJECT_ID' with your actual project ID
sed -i "s/YOUR_GCP_PROJECT_ID/$YOUR_PROJECT_ID/g" api_server.py

# 3. Edit js/gcp-integration.js
sed -i "s/YOUR_GCP_PROJECT_ID/$YOUR_PROJECT_ID/g" js/gcp-integration.js

# 4. Edit js/app.js
# Change: USE_GCP_INTEGRATION = true
```

### Step 5: Install Dependencies

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install packages
pip install -r requirements.txt
```

### Step 6: Run Application

```bash
# Set credentials
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/hr-analytics-key.json"

# Start API server
python3 api_server.py &

# Verify API is running
curl http://localhost:5000/api/attrition-stats

# Open frontend
open index.html
```

### Step 7: Test Integration

```bash
# Test all endpoints
curl http://localhost:5000/api/all-data
curl http://localhost:5000/api/department-attrition
curl http://localhost:5000/api/age-attrition
curl http://localhost:5000/api/overtime-impact
curl http://localhost:5000/api/work-life-balance
curl http://localhost:5000/api/satisfaction-metrics

# Check for errors
tail -f api_server.log
```

---

## ☁️ Option 3: Production Deployment (Cloud Run)

### Step 1: Prepare for Cloud Run

```bash
cd 6_final_presentation/hr_portfolio_site

# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY api_server.py .
COPY . .

# Cloud Run expects PORT environment variable
ENV PORT=8080
EXPOSE 8080

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 api_server:app
EOF

# Update requirements.txt
cat > requirements.txt << 'EOF'
google-cloud-bigquery==3.14.0
flask==3.0.0
flask-cors==4.0.0
gunicorn==21.2.0
EOF
```

### Step 2: Build and Push Container

```bash
# Configure Docker for GCP
gcloud auth configure-docker

# Build container
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/hr-analytics-api

# Verify image
gcloud container images list --repository=gcr.io/YOUR_PROJECT_ID
```

### Step 3: Deploy to Cloud Run

```bash
# Deploy service
gcloud run deploy hr-analytics-api \
  --image gcr.io/YOUR_PROJECT_ID/hr-analytics-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --service-account hr-analytics-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com \
  --max-instances 10 \
  --memory 512Mi \
  --timeout 300

# Get service URL
gcloud run services describe hr-analytics-api \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'
```

### Step 4: Deploy Frontend (Firebase Hosting)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init hosting

# Select:
# - Use existing project: YOUR_PROJECT_ID
# - Public directory: 6_final_presentation/hr_portfolio_site
# - Configure as single-page app: No
# - Set up automatic builds with GitHub: Yes (optional)

# Update API URL in js/gcp-integration.js
# Replace: apiUrl: 'https://YOUR_CLOUD_RUN_URL/api'

# Deploy
firebase deploy --only hosting
```

### Step 5: Configure Custom Domain (Optional)

```bash
# For Cloud Run API
gcloud run domain-mappings create \
  --service hr-analytics-api \
  --domain api.yourdomain.com \
  --region us-central1

# For Firebase Hosting
firebase hosting:channel:deploy production \
  --only hosting \
  --expires 30d
```

---

## 🔒 Security Best Practices

### 1. Service Account Security

```bash
# Rotate keys regularly
gcloud iam service-accounts keys create new-key.json \
  --iam-account=hr-analytics-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com

# Delete old keys
gcloud iam service-accounts keys list \
  --iam-account=hr-analytics-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com

gcloud iam service-accounts keys delete KEY_ID \
  --iam-account=hr-analytics-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 2. Environment Variables

```bash
# Never commit credentials
echo "*.json" >> .gitignore
echo ".env" >> .gitignore
echo "hr-analytics-key.json" >> .gitignore

# Use environment variables
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
export GCP_PROJECT_ID="YOUR_PROJECT_ID"
```

### 3. API Security

```python
# Add rate limiting (in api_server.py)
from flask_limiter import Limiter

limiter = Limiter(
    app,
    key_func=lambda: request.remote_addr,
    default_limits=["100 per hour"]
)

# Add authentication (optional)
from flask_httpauth import HTTPBasicAuth
auth = HTTPBasicAuth()

@auth.verify_password
def verify_password(username, password):
    # Implement your auth logic
    pass
```

### 4. CORS Configuration

```python
# Restrict origins in production
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})
```

---

## 📊 Monitoring and Logging

### Cloud Run Logs

```bash
# View logs
gcloud run services logs read hr-analytics-api \
  --region us-central1 \
  --limit 50

# Follow logs in real-time
gcloud run services logs tail hr-analytics-api \
  --region us-central1
```

### BigQuery Audit Logs

```bash
# View query logs
bq ls --max_results 10 \
  --jobs=true \
  --all_users

# Export logs to Cloud Storage
bq export \
  --destination_format=CSV \
  --compression=GZIP \
  'project.dataset.table' \
  gs://bucket/path/*.csv.gz
```

### Set Up Alerts

```bash
# Create alert policy for high error rate
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="HR Analytics API Errors" \
  --condition-display-name="Error rate > 5%" \
  --condition-threshold-value=0.05
```

---

## 💰 Cost Optimization

### BigQuery Costs

- **Storage**: $0.020 per GB/month
- **Queries**: $5 per TB processed
- **Free tier**: 10 GB storage, 1 TB queries/month

**Optimization tips:**

```sql
-- Use partitioning
CREATE TABLE `project.dataset.table`
PARTITION BY DATE(timestamp_column);

-- Use clustering
CREATE TABLE `project.dataset.table`
CLUSTER BY department, age;

-- Select only needed columns
SELECT age, department FROM table;  -- Good
SELECT * FROM table;  -- Bad (expensive)
```

### Cloud Run Costs

- **CPU**: $0.00002400 per vCPU-second
- **Memory**: $0.00000250 per GiB-second
- **Requests**: $0.40 per million requests
- **Free tier**: 2 million requests/month

**Optimization tips:**

- Set `--min-instances=0` for auto-scaling
- Use `--max-instances` to control costs
- Implement caching to reduce database calls

---

## 🧪 Testing Checklist

### Pre-Deployment Tests

- [ ] All API endpoints return 200 status
- [ ] CORS headers configured correctly
- [ ] Service account has proper permissions
- [ ] Environment variables set correctly
- [ ] SSL/TLS certificates valid
- [ ] Database connection successful
- [ ] Forms submit without errors
- [ ] Charts render correctly
- [ ] Mobile responsive design works
- [ ] Cross-browser compatibility checked

### Load Testing

```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:5000/api/all-data

# Using wrk
wrk -t12 -c400 -d30s http://localhost:5000/api/all-data
```

---

## 🆘 Troubleshooting

### Issue: API returns 500 error

```bash
# Check logs
gcloud run services logs read hr-analytics-api --region us-central1

# Common causes:
# 1. Missing GOOGLE_APPLICATION_CREDENTIALS
# 2. Invalid project ID in queries
# 3. Service account lacks permissions
```

### Issue: CORS errors in browser

```javascript
// Check api_server.py has:
CORS(app, resources={r"/api/*": {"origins": "*"}})

// Or for specific domain:
CORS(app, resources={r"/api/*": {"origins": "https://yourdomain.com"}})
```

### Issue: BigQuery permission denied

```bash
# Grant permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:SA_EMAIL" \
  --role="roles/bigquery.dataEditor"
```

---

## 📚 Additional Resources

- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [BigQuery Best Practices](https://cloud.google.com/bigquery/docs/best-practices)
- [Flask Production Deployment](https://flask.palletsprojects.com/en/2.3.x/deploying/)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)

---

**Version:** 1.0
**Last Updated:** December 1, 2025
**Maintained by:** HR Analytics Team
