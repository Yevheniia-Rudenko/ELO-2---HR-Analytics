# 🔒 Security & Credentials Configuration

## Overview

This project uses **environment variables** for all sensitive data. Real credentials are NEVER committed to the repository.

---

## 📁 File Structure

```
.env                 ← Your REAL credentials (gitignored, not in repo)
.env.example         ← Template with test values (safe to commit)
config.py            ← Loads from .env, uses test defaults
```

---

## 🔐 How It Works

### Local Development

1. **Copy template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your REAL values:**
   ```bash
   # .env (NOT in git)
   GCP_PROJECT_ID=core-trees-478718-g0
   GCP_PROJECT_NUMBER=645256012006
   GCP_DATASET=IBMAnalytics
   GCP_TABLE=employee_attrition
   ```

3. **Run application:**
   ```bash
   python3 simple_api.py
   ```
   
   ✅ Uses REAL credentials from `.env`

### Without .env (Testing)

If `.env` doesn't exist, code uses **test defaults**:
- `GCP_PROJECT_ID=your-test-project-id`
- `GCP_DATASET=TestDataset`
- `GCP_TABLE=test_table`

This allows the code to run without crashing, but won't connect to real GCP resources.

### Production (Cloud Run)

Cloud Run doesn't use `.env` file. Instead:
- Environment variables set via `gcloud run deploy --set-env-vars`
- Or via GitHub Actions secrets
- See: `GITHUB_SECRETS_SETUP.md`

---

## ✅ Security Checklist

- [x] `.env` is in `.gitignore`
- [x] `.env.example` has only test values
- [x] Real credentials only in `.env` (local) or environment variables (production)
- [x] No hardcoded credentials in code
- [x] `config.py` uses safe defaults

---

## 📋 What's Safe to Commit?

✅ **SAFE:**
- `.env.example` - test values only
- `config.py` - loads from environment
- `*.md` documentation files

❌ **NEVER COMMIT:**
- `.env` - real credentials
- `service-account-key.json` - GCP keys
- Any file with real passwords/tokens

---

## 🔧 Troubleshooting

### "Can't connect to BigQuery"
- Check `.env` file exists and has correct values
- Verify `GCP_PROJECT_ID` matches your project

### "Module 'config' not found"
- Install dependencies: `pip install -r requirements.txt`
- Ensure `config.py` exists in same directory

### "dotenv not found"
- Install: `pip install python-dotenv`

---

## 📚 Related Documentation

- `GITHUB_SECRETS_SETUP.md` - GitHub Actions configuration
- `GCP_DEPLOYMENT_GUIDE.md` - Full deployment guide
- `.env.example` - Environment template
