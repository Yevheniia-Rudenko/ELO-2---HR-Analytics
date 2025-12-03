# GCP Integration Guide

## Overview

This guide explains how to integrate the HR Analytics portfolio site with Google Cloud Platform (GCP) BigQuery for real-time data access.

## Current Setup

The site currently uses **static data** from the IBM HR Analytics dataset, which is perfectly suitable for:
- Portfolio demonstrations
- Presentations and showcases
- Development and testing
- Offline access

## Optional GCP Integration

### Benefits
- Real-time data from BigQuery
- Automatic dashboard updates
- Cloud storage for survey responses
- Scalable data processing

### Prerequisites

1. **Google Cloud Account**
   - Create account at [cloud.google.com](https://cloud.google.com)
   - Set up billing (free tier available)

2. **BigQuery Setup**
   - Project ID: `employee-attrition-analysis`
   - Dataset: `IBMAnalytics`
   - Table: `employee_attrition`

3. **API Credentials**
   - Enable BigQuery API
   - Create OAuth 2.0 credentials
   - Configure authorized domains

## Integration Steps

### Step 1: Enable GCP Integration

Uncomment the following line in `index.html`:

```html
<!-- <script src="js/gcp-integration.js"></script> -->
```

Change to:

```html
<script src="js/gcp-integration.js"></script>
```

### Step 2: Configure Authentication

Update `gcp-integration.js` with your credentials:

```javascript
const GCP_CONFIG = {
    projectId: 'YOUR_GCP_PROJECT_ID',  // Your actual GCP project
    projectNumber: 'YOUR_PROJECT_NUMBER',
    datasetId: 'IBMAnalytics',
    tableId: 'employee_attrition'
};
```

### Step 3: Set Up OAuth 2.0

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services > Credentials**
3. Create **OAuth 2.0 Client ID**
4. Add authorized JavaScript origins:
   - `http://localhost:8000`
   - Your production domain

5. Add the OAuth library to `index.html`:

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### Step 4: Implement Authentication Flow

Add to `gcp-integration.js`:

```javascript
function initGoogleAuth() {
    google.accounts.oauth2.initTokenClient({
        client_id: 'YOUR_CLIENT_ID',
        scope: 'https://www.googleapis.com/auth/bigquery.readonly',
        callback: (response) => {
            if (response.access_token) {
                loadDashboardDataFromBigQuery();
            }
        }
    }).requestAccessToken();
}
```

### Step 5: Create Additional Tables (Optional)

For storing survey and appraisal data:

```sql
-- Employee surveys
CREATE TABLE `employee_surveys` (
    employee_id STRING,
    environment_satisfaction INT64,
    job_satisfaction INT64,
    relationship_satisfaction INT64,
    work_life_balance INT64,
    survey_date TIMESTAMP,
    submission_id STRING
);

-- Performance appraisals
CREATE TABLE `performance_appraisals` (
    employee_id STRING,
    manager_id STRING,
    job_involvement INT64,
    performance_rating INT64,
    manager_comments STRING,
    appraisal_date TIMESTAMP,
    appraisal_id STRING
);
```

## Data Flow Architecture

### Without GCP (Current)
```
Static Data → Charts/Forms → Browser Display
```

### With GCP Integration
```
BigQuery ← → REST API ← → JavaScript ← → Charts/Forms
   ↓                                         ↓
Data Storage                          Real-time Updates
```

## Testing

### Local Testing

1. Start local server:
```bash
python -m http.server 8000
```

2. Navigate to `http://localhost:8000`

3. Check browser console for authentication status

### Production Testing

1. Deploy to hosting (GitHub Pages, Netlify, etc.)
2. Update OAuth authorized domains
3. Test data fetching and submission

## Security Considerations

### API Keys
- Never commit API keys to Git
- Use environment variables
- Implement key rotation

### CORS Configuration
```javascript
// Configure CORS in Cloud Functions if needed
const cors = require('cors')({
    origin: ['https://your-domain.com']
});
```

### Data Privacy
- Implement role-based access control
- Use BigQuery column-level security
- Encrypt sensitive data
- Comply with GDPR/privacy regulations

## Cost Optimization

### BigQuery Pricing
- First 1 TB/month: Free
- Query pricing: $5 per TB processed
- Storage: $0.02 per GB/month

### Best Practices
- Use query caching
- Partition large tables
- Set query byte limits
- Monitor usage with billing alerts

## Troubleshooting

### Common Issues

**1. CORS Errors**
```
Access to fetch blocked by CORS policy
```
Solution: Configure CORS in GCP or use Cloud Functions proxy

**2. Authentication Failed**
```
401 Unauthorized
```
Solution: Check OAuth credentials and token expiration

**3. Query Errors**
```
Invalid query syntax
```
Solution: Validate SQL syntax in BigQuery console

**4. Rate Limiting**
```
429 Too Many Requests
```
Solution: Implement request throttling and caching

## Alternative: Cloud Functions Proxy

For better security, create a Cloud Function:

```javascript
const { BigQuery } = require('@google-cloud/bigquery');

exports.queryData = async (req, res) => {
    const bigquery = new BigQuery();
    
    const query = req.body.query;
    const [rows] = await bigquery.query(query);
    
    res.json({ data: rows });
};
```

Deploy:
```bash
gcloud functions deploy queryData \
    --runtime nodejs16 \
    --trigger-http \
    --allow-unauthenticated
```

## Recommendations

### For Portfolio/Demo
✅ Use static data (current setup)
- No authentication required
- Works offline
- Fast and reliable

### For Production Application
✅ Use GCP integration
- Real-time data
- Scalable storage
- Cloud-native architecture

## Support

For questions about GCP integration:
- [BigQuery Documentation](https://cloud.google.com/bigquery/docs)
- [OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- Project repository issues

## Current Status

🟢 **Static Data Mode**: Fully functional, no setup required
🟡 **GCP Integration**: Optional, requires configuration
