# 🚀 Deployment Checklist

## ✅ Completed

- [x] **BigQuery Setup**
  - Dataset: `IBMAnalytics`
  - Table: `employee_attrition`
  - Rows: 1,470
  - Schema: 35 fields

- [x] **GCP Configuration**
  - Project ID: `core-trees-478718-g0`
  - Project Number: `645256012006`
  - Service Account: `github-actions-deployer@core-trees-478718-g0.iam.gserviceaccount.com`
  - JSON Key: Downloaded ✅

- [x] **Local Environment**
  - `.env` configured with real credentials
  - BigQuery connection tested: ✅ SUCCESS
  - Table verified: 1,470 rows
  - GOOGLE_APPLICATION_CREDENTIALS set

- [x] **Security**
  - Real credentials only in `.env` (gitignored)
  - All code uses test defaults
  - Documentation uses placeholder values
  - SECURITY.md created

- [x] **Docker & CI/CD**
  - Dockerfile created (production-ready)
  - .dockerignore configured
  - GitHub Actions workflows:
    - `deploy-cloud-run.yml`
    - `deploy-pages.yml`

## 📋 Next Steps

### 1. Configure GitHub Secrets

```bash
# Copy JSON to clipboard
cat /Users/yevrud/Downloads/core-trees-478718-g0-872ed77c14e2.json | pbcopy
```

Go to: https://github.com/yevheniia-rudenko/ELO-2---HR-Analytics/settings/secrets/actions

Create two secrets:
- **GCP_PROJECT_ID**: `core-trees-478718-g0`
- **GCP_SA_KEY**: (paste entire JSON)

### 2. Enable GCP APIs

```bash
gcloud config set project core-trees-478718-g0

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  bigquery.googleapis.com
```

### 3. Deploy to Cloud Run

**Option A: Automatic (via GitHub Actions)**
1. Merge this branch to `main`
2. GitHub Actions will auto-deploy
3. Check: https://github.com/yevheniia-rudenko/ELO-2---HR-Analytics/actions

**Option B: Manual Deployment**
```bash
cd /Users/yevrud/ELO-2---HR-Analytics/6_final_presentation/hr_portfolio_site
./deploy-to-gcp.sh
```

### 4. Update Frontend API URL

After deployment, update `js/app.js`:
```javascript
const API_URL = 'https://YOUR-SERVICE-URL.run.app'\;
```

### 5. Verify Deployment

Test endpoints:
- `GET /health` - Health check
- `GET /api/satisfaction-stats` - Statistics
- `POST /api/questionnaire` - Submit survey
- `GET /api/all-data` - All data

### 6. Monitor

- Cloud Run logs: https://console.cloud.google.com/run
- BigQuery usage: https://console.cloud.google.com/bigquery
- Costs: https://console.cloud.google.com/billing

## 🔧 Troubleshooting

**If BigQuery fails:**
```bash
# Check service account permissions
gcloud projects get-iam-policy core-trees-478718-g0 \
  --flatten="bindings[].members" \
  --filter="bindings.members:github-actions-deployer@*"
```

**If deployment fails:**
- Check GitHub Actions logs
- Verify secrets are set correctly
- Ensure GCP APIs are enabled

## 📚 Documentation

- Full guide: `GCP_DEPLOYMENT_GUIDE.md`
- GitHub Secrets: `GITHUB_SECRETS_SETUP.md`
- Security info: `SECURITY.md`

## 💰 Cost Estimation

- Cloud Run: ~$0-2/month (free tier covers most usage)
- BigQuery: $0 (1 GB storage, 1 TB queries free)
- Container Registry: ~$0.26/month per GB

**Total: ~$0-5/month** (with minimal traffic)
