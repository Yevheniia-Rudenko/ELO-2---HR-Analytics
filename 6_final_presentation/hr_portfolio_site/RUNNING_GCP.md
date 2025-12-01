# Running the GCP Integration

## Quick Start

### Option 1: Use Static Data (Current - No Setup Needed)
The site works perfectly with static data. No additional setup required!

### Option 2: Enable GCP Integration (Real-time Data)

#### Prerequisites
```bash
pip install google-cloud-bigquery flask flask-cors
```

#### Step 1: Set up GCP Authentication

```bash
# Set environment variable to your GCP credentials
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"
```

To get credentials:
1. Go to https://console.cloud.google.com/apis/credentials?project=YOUR_GCP_PROJECT_ID
2. Create Service Account Key
3. Download JSON file
4. Save to your computer

#### Step 2: Start the API Server

```bash
cd /Users/yevrud/ELO-2---HR-Analytics/6_final_presentation/hr_portfolio_site
python3 api_server.py
```

You should see:
```
* Running on http://0.0.0.0:5000
```

#### Step 3: Open the Website

In another terminal:
```bash
cd /Users/yevrud/ELO-2---HR-Analytics/6_final_presentation/hr_portfolio_site
python3 -m http.server 8000
```

Then open: http://localhost:8000

#### Step 4: Verify Integration

1. Open browser DevTools (F12)
2. Go to Console tab
3. You should see:
   - "🔄 Loading data from BigQuery via API server..."
   - "✅ Data loaded successfully"
   - "✅ Dashboard updated with BigQuery data"

## API Endpoints

Once the server is running, you can test endpoints:

### Get All Data (Recommended)
```bash
curl http://localhost:5000/api/all-data
```

### Individual Endpoints
```bash
# Attrition statistics
curl http://localhost:5000/api/attrition-stats

# Department attrition
curl http://localhost:5000/api/department-attrition

# Age group attrition
curl http://localhost:5000/api/age-attrition

# Overtime impact
curl http://localhost:5000/api/overtime-impact

# Work-life balance
curl http://localhost:5000/api/work-life-balance

# Satisfaction metrics
curl http://localhost:5000/api/satisfaction-metrics
```

## Troubleshooting

### Error: "Module 'google.cloud.bigquery' not found"
```bash
pip3 install google-cloud-bigquery
```

### Error: "CORS error"
Make sure Flask-CORS is installed:
```bash
pip3 install flask-cors
```

### Error: "Authentication error"
Check that GOOGLE_APPLICATION_CREDENTIALS is set:
```bash
echo $GOOGLE_APPLICATION_CREDENTIALS
```

### Error: "Connection refused"
Make sure API server is running on port 5000:
```bash
lsof -i :5000
```

## Deployment Options

### Option A: Deploy API Server to Cloud Run

1. Create `Dockerfile`:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY api_server.py .
CMD ["python", "api_server.py"]
```

2. Deploy:
```bash
gcloud run deploy hr-analytics-api --source .
```

3. Update `gcp-integration.js`:
```javascript
apiUrl: 'https://your-cloud-run-url/api'
```

### Option B: Use Cloud Functions

Convert each endpoint to a separate Cloud Function.

### Option C: Keep Static Data

The site works great with static data - perfect for portfolios!

## Current Status

✅ API server created: `api_server.py`
✅ Integration enabled in HTML
✅ USE_GCP_INTEGRATION = true
✅ All endpoints configured
🟡 Waiting for API server to start
🟡 Waiting for GCP credentials

## Next Steps

Choose one:

1. **For Portfolio/Demo**: Keep static data (already working!)
2. **For Testing**: Start local API server (see Step 1-4 above)
3. **For Production**: Deploy to Cloud Run/Functions
