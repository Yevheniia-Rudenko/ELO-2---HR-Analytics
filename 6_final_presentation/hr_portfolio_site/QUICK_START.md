# 🚀 Quick Start Guide - HR Analytics Platform

## Prerequisites

Before starting, ensure you have:
- **Python 3.7+** installed
- **Web browser** (Chrome, Firefox, Safari, or Edge)
- **Terminal/Command Line** access

---

## Step-by-Step Installation

### Step 1: Install Dependencies

```bash
# Navigate to project directory
cd /Users/yevrud/ELO-2---HR-Analytics/6_final_presentation/hr_portfolio_site

# Install Python dependencies
pip3 install flask flask-cors
```

Expected output:
```
Successfully installed flask-3.0.0 flask-cors-4.0.0
```

---

### Step 2: Start Backend API

Open a **new terminal** and run:

```bash
cd /Users/yevrud/ELO-2---HR-Analytics/6_final_presentation/hr_portfolio_site
python3 simple_api.py
```

You should see:
```
============================================================
🚀 HR Analytics API Server Starting...
============================================================
📊 Questionnaires file: data/questionnaires.json
⭐ Appraisals file: data/appraisals.json
🌐 Server running on: http://localhost:5001
============================================================

Endpoints:
  POST /api/questionnaire - Save questionnaire
  POST /api/appraisal - Save appraisal
  GET  /api/satisfaction-stats - Get satisfaction statistics
  GET  /api/performance-stats - Get performance statistics
  GET  /api/all-data - Get all data
  GET  /api/health - Health check
============================================================

 * Running on http://127.0.0.1:5001
 * Press CTRL+C to quit
```

**⚠️ DO NOT CLOSE THIS TERMINAL!** Backend must run continuously.

---

### Step 3: Start Frontend Server

In a **second terminal**:

```bash
cd /Users/yevrud/ELO-2---HR-Analytics/6_final_presentation/hr_portfolio_site
python3 -m http.server 8888
```

You should see:
```
Serving HTTP on 0.0.0.0 port 8888 (http://0.0.0.0:8888/) ...
```

---

### Step 4: Open in Browser

Open your browser and navigate to:
```
http://localhost:8888/index.html
```

---

## ✅ Verify Everything Works

### 1. Check API Status
Look at the top right corner of the navigation bar:
- Should show: 🟢 **API** (green dot)
- If red: Backend is not running — go back to Step 2

### 2. Check Welcome Banner
You should see 4 buttons:
- 📝 Take Survey
- 📈 View Live Data
- 📚 Learn More
- 🧪 Test Lab

### 3. Check Dashboard
The Overview tab should display:
- 4 KPI cards (Total Employees, Attrition Rate, etc.)
- 6 charts (Attrition by Department, Age Group, etc.)
- Key Insights section

---

## 🎯 How It Works

### When You Submit a Survey:

1. Click **"Survey"** tab or **"Take Survey"** button
2. Fill out the form:
   - Employee ID (e.g., EMP001)
   - Rate 4 parameters (1-4 scale)
3. Click **"Submit Survey"**
4. Watch what happens:
   - ✅ Success message appears
   - 📊 Data saved to `data/questionnaires.json`
   - 🔄 **KPI cards update automatically!**
   - 📈 **Charts refresh with new data!**
   - Console shows: `✅ Questionnaire saved to database`

### When Manager Submits Appraisal:

1. Click **"Reviews"** tab
2. Select an employee
3. Click **"Evaluate"**
4. Fill out evaluation form
5. Click **"Submit Appraisal"**
6. Results:
   - ✅ Data saved to `data/appraisals.json`
   - 📊 **Performance stats update!**
   - Status changes to "Completed"
   - Console: `✅ Appraisal saved to database`

---

## 🔍 How to Verify Data is Saving

### Method 1: View JSON Files

```bash
# View all questionnaires
cat data/questionnaires.json

# View all appraisals
cat data/appraisals.json
```

### Method 2: Use API Endpoint

Open in browser:
```
http://localhost:5001/api/all-data
```

You'll see all saved data in JSON format.

### Method 3: Live Insights Tab

1. Click **"Insights"** tab
2. See real-time statistics
3. View recent submissions list
4. Export data to JSON/CSV

---

## 🧪 Test the System

### Quick Test:

1. Click **"🧪 Test Lab"** button in navigation
2. Opens `test-data-flow.html` in new tab
3. Submit a test survey
4. Watch real-time updates:
   - KPI cards change
   - Charts update
   - Statistics recalculate
   - Console logs show data flow

### Manual Test:

1. Go to **"Survey"** tab
2. Enter: `TEST001` as Employee ID
3. Select all **"4 - Very High"**
4. Submit
5. Wait 1 second
6. Go to **"Insights"** tab
7. Check:
   - Total Surveys: 1
   - Live Satisfaction: 4.00
   - All progress bars: 100%

---

## 📊 Understanding the Dashboard

### Overview Tab
- **KPI Cards**: High-level metrics
- **Charts**: Visual data analysis
- **Insights**: Key findings and recommendations

### Survey Tab
- **Purpose**: Collect employee feedback
- **Frequency**: Quarterly recommended
- **Data**: Saves to `data/questionnaires.json`

### Reviews Tab
- **Purpose**: Manager evaluations
- **Frequency**: Annual recommended
- **Data**: Saves to `data/appraisals.json`

### Insights Tab
- **Purpose**: Real-time analytics
- **Features**: Live stats, trends, export
- **Auto-refresh**: Every 30 seconds

---

## 💡 Tips & Tricks

### For First-Time Users:
1. Start with **Overview** tab to see sample data
2. Try **Test Lab** to understand data flow
3. Read **USER_GUIDE.md** for detailed instructions
4. Submit test data to see real-time updates

### For Developers:
1. Check console (F12) for debugging info
2. Monitor Network tab to see API requests
3. Review `data/*.json` files to see stored data
4. Modify `app.js` configuration if needed

### For HR Professionals:
1. Export data regularly (JSON/CSV)
2. Monitor Live Insights for trends
3. Use filters to analyze specific periods
4. Share dashboard link with stakeholders

---

## 🐛 Common Issues & Solutions

### Problem: API shows Offline
**Symptoms:** Red dot, "API Offline" message  
**Solution:**
```bash
# Check if backend is running
lsof -i :5001

# If not, start it:
cd /path/to/project
python3 simple_api.py
```

### Problem: Port Already in Use
**Symptoms:** `Address already in use` error  
**Solution:**
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill

# Kill process on port 8888
lsof -ti:8888 | xargs kill

# Then restart servers
```

### Problem: Charts Not Showing
**Symptoms:** Empty chart areas  
**Solution:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Check console for errors (F12)
3. Verify Chart.js loaded: Check Network tab
4. Clear browser cache

### Problem: Data Not Saving
**Symptoms:** Form submits but stats don't update  
**Solution:**
1. Check API status (should be green)
2. Open DevTools → Network tab
3. Submit form and check for POST request
4. Verify response is 200 OK
5. Check `USE_API_BACKEND = true` in `app.js`

### Problem: Statistics Not Updating
**Symptoms:** KPIs show old values  
**Solution:**
1. Click refresh button in Live Insights
2. Check `data/*.json` files exist
3. Verify backend is calculating stats
4. Check console for JavaScript errors

---

## 📁 Project Structure

```
hr_portfolio_site/
├── index.html                  # Main application
├── how-it-works.html          # Documentation page
├── test-data-flow.html        # Test environment
├── css/
│   └── styles.css             # All styles
├── js/
│   └── app.js                 # Main logic
├── simple_api.py              # Flask backend
├── data/
│   ├── questionnaires.json    # Survey data
│   └── appraisals.json        # Appraisal data
├── docs/
│   ├── START_HERE.md          # This file
│   ├── USER_GUIDE.md          # Complete guide
│   ├── FEATURES_LIST.md       # Feature list
│   ├── FORM_TO_DASHBOARD_FLOW.md  # Data flow
│   ├── QUICK_START.md         # Installation
│   └── README.md              # Overview
└── requirements.txt           # Python dependencies
```

---

## 🔄 Next Steps

1. ✅ **Explore**: Click through all tabs
2. ✅ **Test**: Submit sample data
3. ✅ **Read**: Review USER_GUIDE.md
4. ✅ **Customize**: Modify for your needs
5. ✅ **Deploy**: Prepare for production

---

## 📚 Additional Resources

### Documentation
- **[USER_GUIDE.md](USER_GUIDE.md)** — Complete user manual
- **[FEATURES_LIST.md](FEATURES_LIST.md)** — All features
- **[FORM_TO_DASHBOARD_FLOW.md](FORM_TO_DASHBOARD_FLOW.md)** — Data flow
- **[README.md](README.md)** — Project overview

### External Links
- **GitHub Repository**: https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics
- **Chart.js Docs**: https://www.chartjs.org/docs/
- **Flask Docs**: https://flask.palletsprojects.com/

---

## 🆘 Getting Help

### Check Logs
```bash
# Backend logs
# Look at terminal where simple_api.py is running

# Frontend logs
# Open browser DevTools (F12) → Console tab
```

### Debug Mode
In `app.js`, enable debug logging:
```javascript
const DEBUG_MODE = true;  // Shows detailed console logs
```

### Contact
- **Author**: Yevheniia Rudenko
- **Project**: MIT Emerging Talent - ELO-2
- **Repository**: https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics

---

## 🎉 You're All Set!

The system is now running and ready to use. Happy analyzing! 📊

**Need more help?** Read the [USER_GUIDE.md](USER_GUIDE.md) for detailed instructions.

---

**Version:** 2.0  
**Last Updated:** December 2025
