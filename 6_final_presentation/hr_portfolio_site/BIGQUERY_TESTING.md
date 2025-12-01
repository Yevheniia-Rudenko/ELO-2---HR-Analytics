# Quick BigQuery Testing Guide

## Your GCP Configuration

**Project:** `YOUR_GCP_PROJECT_ID` (Project #YOUR_PROJECT_NUMBER)
**Dataset:** `IBMAnalytics`
**Table:** `employee_attrition`

## Test Queries in BigQuery Console

### 1. Open BigQuery
Go to: https://console.cloud.google.com/bigquery?project=YOUR_GCP_PROJECT_ID

### 2. Quick Data Check
```sql
-- Check if table exists and get row count
SELECT COUNT(*) as total_rows
FROM `YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_attrition`;
```

Expected result: `1470` rows

### 3. Attrition Overview
```sql
-- Overall attrition statistics
SELECT
    Attrition,
    COUNT(*) as total,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM `YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_attrition`
GROUP BY Attrition
ORDER BY Attrition;
```

Expected results:
- No: ~1233 (83.9%)
- Yes: ~237 (16.1%)

### 4. Department Attrition
```sql
-- Attrition by department
SELECT
    Department,
    COUNT(*) as attrition_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as attrition_percentage
FROM `YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_attrition`
WHERE Attrition = "Yes"
GROUP BY Department
ORDER BY attrition_count DESC;
```

### 5. Full Schema Check
```sql
-- View all columns
SELECT *
FROM `YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_attrition`
LIMIT 5;
```

## Creating Additional Tables (Optional)

### Employee Surveys Table
```sql
CREATE TABLE `YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_surveys` (
    survey_id STRING,
    employee_id STRING,
    environment_satisfaction INT64,
    job_satisfaction INT64,
    relationship_satisfaction INT64,
    work_life_balance INT64,
    survey_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);
```

### Performance Appraisals Table
```sql
CREATE TABLE `YOUR_GCP_PROJECT_ID.IBMAnalytics.performance_appraisals` (
    appraisal_id STRING,
    employee_id STRING,
    manager_id STRING,
    job_involvement INT64,
    performance_rating INT64,
    manager_comments STRING,
    appraisal_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);
```

## Testing Integration

### Option 1: Browser Console (Simple Test)
1. Open your portfolio site
2. Open browser DevTools (F12)
3. Go to Console tab
4. Run:
```javascript
// Test configuration
console.log('GCP Config:', {
    projectId: 'YOUR_GCP_PROJECT_ID',
    datasetId: 'IBMAnalytics',
    tableId: 'employee_attrition'
});

// Check if functions are available
console.log('GCP Integration loaded:', typeof loadDashboardDataFromBigQuery !== 'undefined');
```

### Option 2: Enable Full Integration
1. In `index.html`, uncomment:
```html
<script src="js/gcp-integration.js"></script>
```

2. In `js/app.js`, change:
```javascript
const USE_GCP_INTEGRATION = true;
```

3. Set up OAuth 2.0 (see GCP_INTEGRATION.md for details)

## Quick Links

- **BigQuery Console**: https://console.cloud.google.com/bigquery?project=YOUR_GCP_PROJECT_ID
- **IAM & Admin**: https://console.cloud.google.com/iam-admin?project=YOUR_GCP_PROJECT_ID
- **APIs & Services**: https://console.cloud.google.com/apis?project=YOUR_GCP_PROJECT_ID
- **Looker Studio Dashboard**: https://lookerstudio.google.com/reporting/d2337cc9-accc-4737-b5c1-33b6ccfaad69

## Current Status

✅ Project ID configured: `YOUR_GCP_PROJECT_ID`
✅ Dataset exists: `IBMAnalytics`
✅ Main table ready: `employee_attrition` (1,470 rows)
✅ Code updated with correct project reference
🟡 Additional tables for surveys/appraisals: Not created yet (optional)
🟡 OAuth authentication: Not configured (optional for portfolio)

## Recommendations

### For Portfolio/Demo
- Keep static data mode (current setup)
- No OAuth setup needed
- Works perfectly offline

### If You Want Real-Time Integration
1. Create additional tables (employee_surveys, performance_appraisals)
2. Set up OAuth 2.0 credentials
3. Enable CORS for your domain
4. Uncomment GCP integration scripts

## Notes

The site currently works with **static data** which is perfect for:
- Portfolio demonstrations ✅
- Presentations ✅
- GitHub showcase ✅
- Offline access ✅

GCP integration is **optional** and mainly useful for:
- Production deployments
- Real user data collection
- Live dashboard updates
- Automated data pipelines
