# GitHub Secrets Configuration Guide

## 🔐 Required Secrets for GitHub Actions Deployment

To enable automatic deployment to Google Cloud Run via GitHub Actions, you need to configure the following secrets in your repository.

---

## 📋 Step 1: Create Service Account in GCP

1. Go to [GCP Console → IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=core-trees-478718-g0)

2. Click **"+ CREATE SERVICE ACCOUNT"**

3. Fill in details:
   - **Name:** `github-actions-deployer`
   - **Description:** `Service account for GitHub Actions CI/CD`
   - Click **"CREATE AND CONTINUE"**

4. Grant the following roles:
   - ✅ `Cloud Run Admin`
   - ✅ `Storage Admin`
   - ✅ `Service Account User`
   - ✅ `BigQuery Data Viewer`
   - ✅ `Artifact Registry Writer` (or `Container Registry Service Agent`)
   
   Click **"CONTINUE"** → **"DONE"**

5. Create JSON key:
   - Click on the service account you just created
   - Go to **"KEYS"** tab
   - Click **"ADD KEY"** → **"Create new key"**
   - Select **JSON** format
   - Click **"CREATE"**
   - **Save the downloaded file** securely

---

## 📋 Step 2: Add Secrets to GitHub

1. Go to your GitHub repository:
   ```
   https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics/settings/secrets/actions
   ```

2. Click **"New repository secret"**

### Secret #1: GCP_PROJECT_ID

```
Name: GCP_PROJECT_ID
Value: core-trees-478718-g0
```

Click **"Add secret"**

### Secret #2: GCP_SA_KEY

```
Name: GCP_SA_KEY
Value: <paste entire JSON file content>
```

**How to get the value:**
- Open the downloaded JSON key file in a text editor
- Copy **ALL** content (from `{` to `}`)
- Paste into the secret value field

The JSON should look like:
```json
{
  "type": "service_account",
  "project_id": "core-trees-478718-g0",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "github-actions-deployer@core-trees-478718-g0.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

Click **"Add secret"**

---

## 📋 Step 3: Enable Required APIs

Run in Cloud Shell or local terminal with gcloud:

```bash
gcloud config set project core-trees-478718-g0

gcloud services enable \
  run.googleapis.com \
  containerregistry.googleapis.com \
  bigquery.googleapis.com \
  cloudbuild.googleapis.com
```

Or enable manually in GCP Console:
- [Cloud Run API](https://console.cloud.google.com/apis/library/run.googleapis.com?project=core-trees-478718-g0)
- [Container Registry API](https://console.cloud.google.com/apis/library/containerregistry.googleapis.com?project=core-trees-478718-g0)
- [BigQuery API](https://console.cloud.google.com/apis/library/bigquery.googleapis.com?project=core-trees-478718-g0)
- [Cloud Build API](https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com?project=core-trees-478718-g0)

---

## 📋 Step 4: Verify Configuration

1. Check secrets are added:
   ```
   https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics/settings/secrets/actions
   ```
   
   You should see:
   - ✅ `GCP_PROJECT_ID`
   - ✅ `GCP_SA_KEY`

2. Check GitHub Actions workflow exists:
   ```
   .github/workflows/deploy-cloud-run.yml
   ```

---

## 🚀 Step 5: Deploy!

Once secrets are configured:

### Option A: Merge to Main
```bash
git checkout main
git merge integrate-google-cloud-platform-gcp-into-the-project-for-data-storage-and-analytics
git push origin main
```

GitHub Actions will automatically:
1. Build Docker image
2. Push to Google Container Registry
3. Deploy to Cloud Run
4. Make service publicly accessible

### Option B: Manual Trigger
1. Go to [Actions tab](https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics/actions)
2. Click "Deploy to Google Cloud Run"
3. Click "Run workflow" → "Run workflow"

---

## 📊 Monitor Deployment

1. **GitHub Actions:**
   - https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics/actions
   - Watch for green ✅ checkmark

2. **Cloud Run Console:**
   - https://console.cloud.google.com/run?project=core-trees-478718-g0
   - Service name: `hr-analytics-api`

3. **Get Service URL:**
   ```bash
   gcloud run services describe hr-analytics-api \
     --region us-central1 \
     --format 'value(status.url)'
   ```

---

## ✅ Success!

After deployment, your API will be live at:
```
https://hr-analytics-api-[hash]-uc.a.run.app
```

Update `js/app.js` with this URL:
```javascript
const API_URL = 'https://hr-analytics-api-xxxxx-uc.a.run.app/api';
```

---

## 🔒 Security Notes

1. ✅ Never commit the service account JSON key to git
2. ✅ The `.env` file is in `.gitignore`
3. ✅ Secrets are encrypted in GitHub
4. ✅ Service account has minimal required permissions
5. ✅ Cloud Run service is HTTPS only

---

## 🐛 Troubleshooting

### "Permission denied" errors
- Verify service account has all required roles
- Check APIs are enabled

### "Secret not found" errors
- Verify secret names match exactly (case-sensitive)
- Re-add secrets if needed

### Build fails
- Check Dockerfile syntax
- Verify requirements.txt is correct
- Check logs in GitHub Actions

### Need help?
Check full deployment guide: `GCP_DEPLOYMENT_GUIDE.md`
