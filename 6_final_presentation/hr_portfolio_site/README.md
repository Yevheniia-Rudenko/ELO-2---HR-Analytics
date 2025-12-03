# HR Analytics Portfolio Website

## 🎯 Overview

A professional HR Analytics platform featuring employee attrition analytics, real-time satisfaction surveys, performance management tools, and live data visualization. Built with modern web technologies and Flask backend API.

## ✨ Key Features

### 1. Overview Dashboard
- **4 KPI Cards**: Total employees (1,470), attrition rate (16.1%), avg. satisfaction (2.73/4), avg. tenure (7.0 years)
- **6 Interactive Charts**: 
  - Attrition by department (bar chart)
  - Attrition by age group (line chart)
  - Overtime impact (doughnut chart)
  - Work-life balance distribution (bar chart)
  - Live satisfaction breakdown (bar chart)
  - Satisfaction trends (line chart)
- **Key Insights**: Data-driven insights about attrition patterns and risk factors

### 2. Employee Survey
- **Purpose**: Collect employee feedback semi-annually
- **4 Rating Fields** (1-4 scale):
  - Environment Satisfaction
  - Job Satisfaction
  - Relationship Satisfaction
  - Work-Life Balance
- **Features**: Form validation, real-time data saving, automatic statistics update

### 3. Manager Reviews
- **Purpose**: Annual performance evaluation by managers
- **Evaluation Fields**:
  - Job Involvement (1-4 scale)
  - Performance Rating (1-4 scale)
  - Communication Skills
  - Innovation
  - Leadership
  - Manager Comments
- **Features**: 
  - Employee list with status tracking (Pending/Completed)
  - Individual evaluation forms
  - Real-time status updates

### 4. Live Insights (NEW!)
- **Real-time Statistics**: Total surveys, live satisfaction, total appraisals, live performance
- **Interactive Charts**: Live satisfaction breakdown, satisfaction trends
- **Detailed Statistics**: Progress bars for each category
- **Recent Submissions**: List of last 10 submissions
- **Data Management**: 
  - Export to JSON/CSV
  - View all data
  - Clear all data
- **Auto-refresh**: Every 30 seconds

### 5. About Section
- Project overview and highlights
- Technology stack
- Team member profiles
- Dataset information
- Key findings
- Resources and contact information

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Variables, Grid, Flexbox, gradients, animations
- **JavaScript (ES6+)**: Async/await, Fetch API, Chart.js integration
- **Chart.js 4.4.1**: Interactive data visualization

### Backend
- **Python 3.12.7**: Backend language
- **Flask 3.0.0**: Web framework
- **Flask-CORS 4.0.0**: Cross-origin resource sharing
- **JSON**: Local file-based data storage

## 📁 File Structure

```text
hr_portfolio_site/
├── index.html                  # Main application
├── how-it-works.html          # Documentation page
├── test-data-flow.html        # Test laboratory
├── css/
│   └── styles.css             # All styles and animations
├── js/
│   └── app.js                 # Main logic and API integration
├── simple_api.py              # Flask backend API (local mode, port 5001)
├── api_server.py              # GCP BigQuery API (cloud mode, port 5000)
├── data/
│   ├── questionnaires.json    # Employee surveys
│   └── appraisals.json        # Manager appraisals
├── docs/
│   ├── START_HERE.md          # Quick launch guide
│   ├── USER_GUIDE.md          # Complete user manual
│   ├── FEATURES_LIST.md       # All features explained
│   ├── FORM_TO_DASHBOARD_FLOW.md  # Data flow documentation
│   ├── QUICK_START.md         # Installation guide
│   └── README.md              # This file
└── requirements.txt           # Python dependencies
```

## 🚀 Quick Start

### Prerequisites
- Python 3.7 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation & Launch

**Step 1: Install Dependencies**
```bash
cd /Users/yevrud/ELO-2---HR-Analytics/6_final_presentation/hr_portfolio_site
pip3 install flask flask-cors
```

**Step 2: Start Backend API (Terminal 1)**
```bash
python3 simple_api.py
```

> **Note:** For local development, use `simple_api.py` (port 5001) with JSON file storage.  
> For Google Cloud Platform integration, use `api_server.py` (port 5000) with BigQuery.  
> See [RUNNING_GCP.md](RUNNING_GCP.md) for cloud deployment instructions.

You should see:
```
🚀 HR Analytics API Server Starting...
🌐 Server running on: http://localhost:5001
```

**Step 3: Start Frontend Server (Terminal 2)**
```bash
python3 -m http.server 8888
```

**Step 4: Open in Browser**
```
http://localhost:8888/index.html
```

### Verify Installation
- ✅ API Status indicator shows 🟢 **API Online**
- ✅ Welcome Banner displays with 4 buttons
- ✅ Overview Dashboard shows 4 KPI cards and charts

📚 **Full Installation Guide**: [QUICK_START.md](QUICK_START.md)

---

## 📊 API Endpoints

The Flask backend provides 6 REST API endpoints:

### POST /api/questionnaire
Save employee survey submission
```json
{
  "employeeId": "EMP001",
  "environmentSatisfaction": "4",
  "jobSatisfaction": "3",
  "relationshipSatisfaction": "4",
  "workLifeBalance": "3"
}
```

### POST /api/appraisal
Save manager performance appraisal
```json
{
  "employeeId": "EMP001",
  "performanceRating": "4",
  "jobInvolvement": "3"
}
```

### GET /api/satisfaction-stats
Get aggregated satisfaction statistics

### GET /api/performance-stats
Get aggregated performance statistics

### GET /api/all-data
Retrieve all stored questionnaires and appraisals

### GET /api/health
Health check endpoint (returns `{"status": "healthy"}`)

---

## 🔄 How It Works

### Data Flow
```
User submits form 
  → JavaScript validates data 
  → POST request to Flask API 
  → Data saved to JSON file 
  → Statistics recalculated 
  → Frontend fetches updated stats 
  → KPIs and charts update with animation
```

### Real-time Updates
- Form submissions automatically update dashboard within 500ms
- Live Insights tab auto-refreshes every 30 seconds
- All changes are persisted to JSON files
- Charts animate smoothly when data changes

📚 **Detailed Data Flow**: [FORM_TO_DASHBOARD_FLOW.md](FORM_TO_DASHBOARD_FLOW.md)

---

## 🎨 UI/UX Features

### Modern Design
- CSS variables for consistent theming
- Gradient backgrounds and shadows
- Smooth animations (fadeIn, slideUp, pulse)
- Hover effects on interactive elements
- Custom scrollbar styling

### Responsive Layout
- **Mobile** (< 768px): Single column, touch-friendly
- **Tablet** (768px - 1024px): Two column grid
- **Desktop** (> 1024px): Full multi-column layout

### Navigation
- Compact symmetric navigation bar
- 5 main tabs: Overview, Survey, Reviews, Insights, About
- 2 action buttons: Docs, Test Lab
- Real-time API Status Indicator

---

## 🧪 Testing

### Test Lab
Access the isolated testing environment:
1. Click **"🧪 Test Lab"** in navigation
2. Opens `test-data-flow.html` in new tab
3. Submit test data
4. Watch real-time visualization of data flow

### Manual Testing
1. Navigate to **Survey** tab
2. Enter Employee ID: `TEST001`
3. Select ratings (1-4)
4. Submit form
5. Check **Live Insights** tab for updated statistics

---

## 📚 Documentation

### Quick Links
- **[START_HERE.md](START_HERE.md)** — 3-step quick launch guide
- **[USER_GUIDE.md](USER_GUIDE.md)** — Complete user manual with all features
- **[FEATURES_LIST.md](FEATURES_LIST.md)** — Comprehensive feature list
- **[FORM_TO_DASHBOARD_FLOW.md](FORM_TO_DASHBOARD_FLOW.md)** — How data flows from forms to dashboard
- **[QUICK_START.md](QUICK_START.md)** — Detailed installation guide

### Additional Pages
- **how-it-works.html** — Interactive documentation page
- **test-data-flow.html** — Testing environment with real-time visualization

---

## 💡 Use Cases

### For Portfolio Demonstrations
- Showcase frontend development skills
- Demonstrate API integration
- Highlight data visualization abilities
- Show responsive design implementation

### For HR Professionals
- Track employee satisfaction trends
- Monitor performance metrics
- Export data for further analysis
- Make data-driven decisions

### For Developers
- Learn Flask API development
- Study Chart.js integration
- Explore modern CSS techniques
- Understand data flow architecture

---

## ✅ Features Checklist

### Implemented ✅
- ✅ Five-tab navigation (Overview, Survey, Reviews, Insights, About)
- ✅ Real-time data saving with Flask backend
- ✅ Interactive charts with Chart.js 4.4.1
- ✅ Responsive design for all devices
- ✅ Form validation and success messages
- ✅ Live Insights with auto-refresh
- ✅ Export to JSON/CSV
- ✅ API Status Indicator
- ✅ Welcome Banner with quick actions
- ✅ Test Lab environment
- ✅ Comprehensive documentation

### Optional (Not Implemented) ⚠️
- ⚠️ User authentication system
- ⚠️ Role-based access control
- ⚠️ PostgreSQL database
- ⚠️ Email notifications
- ⚠️ PDF report generation

---

## 🎯 Future Roadmap

### Phase 1: Authentication
- User login/logout
- Role-based access (Employee/Manager/HR)
- Session management
- Password security

### Phase 2: Database
- Migrate from JSON to PostgreSQL
- Database migrations
- Backup and recovery
- Query optimization

### Phase 3: Advanced Analytics
- Predictive attrition models
- Employee risk scoring
- Trend analysis
- Custom date ranges

### Phase 4: Production
- HTTPS setup
- Production WSGI server (Gunicorn)
- Environment variables
- Logging and monitoring

---

## 🌐 Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 90+     | ✅ Full |
| Firefox | 88+     | ✅ Full |
| Safari  | 14+     | ✅ Full |
| Edge    | 90+     | ✅ Full |
| IE 11   | —       | ⚠️ Limited |

---

## 📦 Dependencies

### Frontend
- Chart.js 4.4.1 (CDN)

### Backend
```txt
Flask==3.0.0
Flask-CORS==4.0.0
```

Install with:
```bash
pip3 install -r requirements.txt
```

---

## 🐛 Troubleshooting

### API Offline
**Problem:** Red dot in navigation  
**Solution:** Start backend with `python3 simple_api.py`

### Port Already in Use
**Problem:** `Address already in use` error  
**Solution:**
```bash
lsof -ti:5001 | xargs kill  # Kill backend
lsof -ti:8888 | xargs kill  # Kill frontend
```

### Charts Not Displaying
**Problem:** Empty chart areas  
**Solution:** Hard refresh page (Ctrl+Shift+R or Cmd+Shift+R)

### Data Not Saving
**Problem:** Form submits but stats don't update  
**Solution:** Check API status is green, verify POST requests in DevTools Network tab

📚 **More Solutions**: See [USER_GUIDE.md - Troubleshooting](USER_GUIDE.md#-troubleshooting)

---

## 👥 Team

- **Yevheniia Rudenko** — Lead Developer & Project Manager
- **Oleksandr Maksymikhin** — Data Analysis & ML Models
- **Majd ABUALSOUD** — Research & Documentation

---

## 📄 Project Context

This platform is part of the **MIT Emerging Talent ELO-2 HR Analytics** project, demonstrating:

- ✅ **Full-stack Development**: Frontend (HTML/CSS/JS) + Backend (Flask/Python)
- ✅ **Data Visualization**: Interactive charts with Chart.js
- ✅ **HR Analytics**: Domain knowledge and practical application
- ✅ **UI/UX Design**: Modern, responsive, user-friendly interface
- ✅ **API Development**: RESTful API with JSON storage
- ✅ **Real-time Updates**: Live data processing and visualization

### Dataset
Based on **IBM HR Analytics Employee Attrition & Performance** dataset:
- 1,470 employee records
- 35 features including demographics, job roles, satisfaction scores
- Real insights about employee attrition patterns

---

## 📊 Key Findings

From the data analysis:
- **R&D department** has highest attrition with 133 departures (56.1% of total)
- **Sales department** follows with 92 departures (38.8% of total)
- **Young employees** (18-25) have 36% attrition rate
- **Overtime** increases attrition by 2.9x (rounded to 3x)
- **Work-life balance** is crucial for retention (29% report poor balance)
- **Average satisfaction** correlates with performance

---

## 📞 Contact & Links

### GitHub Repository
**Main Project**: [ELO-2---HR-Analytics](https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics)

### Related Links
- **Chart.js Documentation**: https://www.chartjs.org/docs/
- **Flask Documentation**: https://flask.palletsprojects.com/
- **MIT Emerging Talent**: https://emergingtalent.mit.edu/

### Questions or Feedback?
For questions, suggestions, or collaboration opportunities, please visit the main repository and open an issue.

---

## 📜 License

MIT License - Part of MIT Emerging Talent Program

Copyright (c) 2025 Yevheniia Rudenko

---

## 🎉 Acknowledgments

- **MIT Emerging Talent** for the learning opportunity
- **IBM** for the HR Analytics dataset
- **Chart.js** team for excellent visualization library
- **Flask** community for robust web framework

---

## 🚀 Getting Started

Ready to explore? Follow these steps:

1. **Read**: [START_HERE.md](START_HERE.md) for quick 3-step launch
2. **Install**: Follow installation instructions above
3. **Explore**: Navigate through all 5 tabs
4. **Test**: Submit sample data and watch real-time updates
5. **Learn**: Read [USER_GUIDE.md](USER_GUIDE.md) for details

**Questions?** Check [USER_GUIDE.md - FAQ](USER_GUIDE.md#-frequently-asked-questions-faq)

---

**Version:** 2.0  
**Last Updated:** December 2025  
**Status:** ✅ Production Ready

---

**Made with ❤️ by the ELO-2 HR Analytics Team**

