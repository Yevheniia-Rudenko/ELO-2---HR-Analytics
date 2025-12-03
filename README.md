# 🌟 HR Analytics Platform — Employee Attrition Analysis

[![CI Checks](https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics/workflows/CI%20Checks/badge.svg)](https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics/actions)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Google Cloud](https://img.shields.io/badge/Google%20Cloud-Ready-4285F4?logo=google-cloud)](https://cloud.google.com/)

> **An interactive web platform for HR analytics, employee attrition prediction, and workforce optimization.**

Developed as part of the **MIT Emerging Talent ELO2 module** by **Yevheniia Rudenko**, **Oleksandr Maksymikhin**, and **Majd ABUALSOUD**.

---

## 🎯 What is This Platform?

**HR Analytics Platform** is a comprehensive web-based solution for analyzing employee data and predicting workforce attrition. It combines modern data analytics, interactive visualizations, and optional cloud integration to help HR departments make data-driven decisions.

### 🌟 Key Features

✨ **Interactive Dashboard** — Real-time KPIs and visual analytics  
📊 **4 Main Sections** — Overview, Employee Survey, Manager Appraisal, Project Info  
📈 **Advanced Charts** — Department analysis, age groups, overtime impact, work-life balance  
🔄 **Dual Architecture** — Static demo mode + optional Google Cloud integration  
📱 **Responsive Design** — Works on desktop, tablet, and mobile devices  
🔒 **Secure & Private** — All sensitive data removed, ready for public deployment  

### 🎓 Perfect For

- **HR Departments** — Monitor employee satisfaction and identify attrition risks
- **Managers** — Assess team performance and work-life balance
- **Business Analysts** — Analyze workforce trends and predict turnover
- **Students & Researchers** — Learn HR analytics and data visualization
- **Portfolio Projects** — Showcase full-stack development skills

---

## 🚀 Quick Start

### Option 1: Demo Mode (No Setup Required)

```bash
# Clone repository
git clone https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics.git
cd ELO-2---HR-Analytics/6_final_presentation/hr_portfolio_site

# Open in browser
open index.html
```

**That's it!** The platform works immediately with pre-loaded data.

### Option 2: With Google Cloud Integration

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete setup instructions.

---

## 📚 Documentation

- 📖 **[User Guide](./USER_GUIDE.md)** — Complete walkthrough for end users (Ukrainian)
- 🚀 **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** — Technical deployment instructions
- 🎯 **[Improvement Roadmap](./IMPROVEMENT_ROADMAP.md)** — Future enhancements and ideas
- ☁️ **[GCP Setup](./2_data_preparation/gcp_setup.md)** — Google Cloud Platform configuration
- 🧪 **[BigQuery Testing](./6_final_presentation/hr_portfolio_site/BIGQUERY_TESTING.md)** — SQL queries and testing

---

## 💡 Use Cases

### Scenario 1: HR Manager Analyzes Team Health

1. Opens **Overview** dashboard
2. Sees Attrition Rate = 16.1% (above industry average of 13%)
3. Reviews **Department Analysis** — Sales has highest attrition
4. Checks **Overtime Impact** — 30% of overtime workers leave
5. **Action:** Reduce overtime in Sales department, improve work-life balance

### Scenario 2: Employee Survey Collection

1. Employee opens **Questionary** section
2. Fills out satisfaction survey (job satisfaction, work-life balance)
3. Adds comment about heavy workload
4. Submits form
5. **Result:** HR receives early warning signal about potential issues

### Scenario 3: Manager Performance Review

1. Manager opens **Managers Appraisal** section
2. Rates employee performance (1-4 scale)
3. Indicates promotion potential (Low/Medium/High)
4. Adds detailed feedback
5. **Result:** Data stored for HR analysis and career planning

---

## 🔧 Technology Stack

### Frontend

- **HTML5/CSS3** — Semantic markup and modern styling
- **JavaScript ES6+** — Interactive features and API integration
- **Chart.js 4.4.1** — Beautiful data visualizations
- **Responsive Design** — Mobile-first approach

### Backend

- **Python 3.9+** — Data processing and API server
- **Flask 3.0.0** — RESTful API framework
- **Flask-CORS 4.0.0** — Cross-origin resource sharing

### Cloud (Optional)

- **Google Cloud Platform** — Cloud infrastructure
- **BigQuery** — Scalable data warehouse (1,470 employee records)
- **Cloud Run** — Serverless container deployment
- **Service Accounts** — Secure authentication  

---

## 📁 Project Structure

```text
ELO-2---HR-Analytics/
├── 📂 6_final_presentation/
│   └── hr_portfolio_site/           # ⭐ Main web platform
│       ├── index.html               # Interactive dashboard
│       ├── css/styles.css           # Responsive styling
│       ├── js/
│       │   ├── app.js              # Main application logic
│       │   └── gcp-integration.js  # Optional cloud integration
│       ├── api_server.py           # Flask REST API (7 endpoints)
│       ├── requirements.txt        # Python dependencies
│       └── README.md               # Platform documentation
├── 📂 0_domain_study/               # HR analytics research
├── 📂 1_datasets/                   # IBM HR Analytics dataset (1,470 records)
├── 📂 2_data_preparation/           # Data cleaning + GCP setup
├── 📂 3_data_exploration/           # EDA and visualizations
├── 📂 4_data_analysis/              # Statistical analysis
├── 📂 5_communication_strategy/     # Insights and recommendations
├── 📂 .github/workflows/            # CI/CD (markdown-lint, python-syntax)
├── 📄 USER_GUIDE.md                 # 📖 User documentation (Ukrainian)
├── 📄 DEPLOYMENT_GUIDE.md           # 🚀 Technical deployment guide
├── 📄 IMPROVEMENT_ROADMAP.md        # 🎯 Future enhancements
└── 📄 README.md                     # This file
```

---

## 🎨 Platform Screenshots

### Dashboard Overview

![Dashboard](./assets/dashboard-preview.png)
*Real-time KPIs and interactive charts showing attrition analysis*

### Employee Survey

![Survey](./assets/survey-preview.png)
*Easy-to-use form for collecting employee feedback*

### Manager Appraisal

![Appraisal](./assets/appraisal-preview.png)
*Performance review interface for managers*

---

## 📊 Key Metrics & Insights

Based on analysis of **1,470 employee records** from IBM HR Analytics dataset:

| Metric | Value | Insight |
|--------|-------|---------|
| **Total Employees** | 1,470 | Comprehensive dataset |
| **Attrition Rate** | 16.1% | Above industry average (13%) |
| **Average Age** | 37 years | Mid-career workforce |
| **Avg Monthly Income** | $6,503 | Competitive compensation |
| **High-Risk Department** | Sales | Needs immediate attention |
| **Overtime Impact** | 30% higher attrition | Critical factor |

### Key Findings

1. 🔴 **Overtime is the #1 predictor** of employee attrition
2. 📉 **Sales department** has highest turnover (critical)
3. ⚖️ **Work-life balance rating** directly correlates with retention
4. 👥 **Age group 26-35** most likely to leave (career mobility)
5. 💰 **Competitive salary alone doesn't prevent attrition**

---

## 🛠️ Installation & Setup

### Prerequisites

- **Python 3.9+** ([Download](https://www.python.org/downloads/))
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)
- **Git** ([Download](https://git-scm.com/))
- **Google Cloud Account** (optional, for cloud integration)

### Local Installation

```bash
# 1. Clone repository
git clone https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics.git
cd ELO-2---HR-Analytics

# 2. Navigate to platform
cd 6_final_presentation/hr_portfolio_site

# 3. For demo mode (static data)
open index.html  # macOS
# or
start index.html  # Windows
# or
xdg-open index.html  # Linux

# 4. For GCP integration (optional)
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure GCP credentials (see DEPLOYMENT_GUIDE.md)
export GOOGLE_APPLICATION_CREDENTIALS="path/to/key.json"

# Start API server
python3 api_server.py

# Enable GCP in frontend (js/app.js)
# Change: USE_GCP_INTEGRATION = true
```

---

## 🚀 Deployment Options

### 1. GitHub Pages (Recommended for Portfolio)

```bash
# Deploy static demo version
git checkout -b gh-pages
cp -r 6_final_presentation/hr_portfolio_site/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

**Live at:** `https://yourusername.github.io/ELO-2---HR-Analytics/`

### 2. Google Cloud Run (Production)

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for:

- Container build & deployment
- Custom domain setup
- SSL/HTTPS configuration
- Monitoring & logging

### 3. Other Platforms

- **Netlify** — `netlify deploy --prod`
- **Vercel** — `vercel --prod`
- **Firebase Hosting** — `firebase deploy`

---

## 🎯 Goals & Achievements

### ✅ Completed

1. ✅ Understand the role of **data and AI in human resource management**
2. ✅ Build **interactive web platform** with real HR dataset
3. ✅ Implement **cloud-ready architecture** with GCP integration
4. ✅ Create **comprehensive documentation** for users and developers
5. ✅ Deliver **insightful visualizations** and **actionable recommendations**
6. ✅ Develop **dual-mode system** (demo + production ready)
7. ✅ Apply **CI/CD best practices** with GitHub Actions

### 🎓 Learning Outcomes

- **Data Analytics:** EDA, statistical analysis, visualization
- **Full-Stack Development:** HTML/CSS/JS, Python Flask, REST APIs
- **Cloud Technologies:** Google Cloud Platform, BigQuery, Cloud Run
- **DevOps:** CI/CD pipelines, containerization, deployment
- **HR Domain Knowledge:** Attrition factors, workforce metrics, employee satisfaction

---

## 🛠️ Tech Stack

- **Python** (Pandas, NumPy, Scikit-learn, Matplotlib, Seaborn)
- **Machine Learning** (Supervised & Unsupervised models)
- **Google Cloud Platform (GCP)** – BigQuery, AI Platform, Cloud Storage
- **Visualization Tools** – Tableau, Looker Studio, Plotly
- **Version Control** – Git & GitHub
- **Development** – VS Code, Jupyter Notebook, Google Colab

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9 or higher
- Git
- VS Code (recommended)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics.git
   cd ELO-2---HR-Analytics
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

### Running the Project

Refer to specific readme files in each folder for detailed instructions on running notebooks and scripts.

---

## 👥 Team

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/Yevheniia-Rudenko.png" width="100px;" alt="Yevheniia Rudenko"/><br />
      <sub><b>Yevheniia Rudenko</b></sub><br />
      <sub>Data Scientist & Project Lead</sub><br />
      <a href="https://github.com/Yevheniia-Rudenko">GitHub</a>
    </td>
    <td align="center">
      <img src="https://github.com/OleksandrMaksymikhin.png" width="100px;" alt="Oleksandr Maksymikhin"/><br />
      <sub><b>Oleksandr Maksymikhin</b></sub><br />
      <sub>ML Engineer & Backend Developer</sub><br />
      <a href="https://github.com/OleksandrMaksymikhin">GitHub</a>
    </td>
    <td align="center">
      <img src="https://github.com/majdadel20.png" width="100px;" alt="Majd ABUALSOUD"/><br />
      <sub><b>Majd ABUALSOUD</b></sub><br />
      <sub>Full Stack Developer & DevOps</sub><br />
      <a href="https://github.com/majdadel20">GitHub</a>
    </td>
  </tr>
</table>

**Program:** MIT Emerging Talent — ELO2 Module  
**University:** Massachusetts Institute of Technology  
**Year:** 2024-2025

---

## 📚 Documentation

- 📖 **[User Guide](./USER_GUIDE.md)** — Complete user walkthrough (Ukrainian)
- 🚀 **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** — Technical deployment instructions
- 🎯 **[Improvement Roadmap](./IMPROVEMENT_ROADMAP.md)** — Future enhancements
- 🤝 **[Contributing Guidelines](contributing.md)** — How to contribute
- 📋 **[Project Guide](guide.md)** — Project overview
- 📜 **[License](LICENSE)** — MIT License

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

See [IMPROVEMENT_ROADMAP.md](./IMPROVEMENT_ROADMAP.md) for ideas on what to contribute.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to:

- ✅ Use commercially
- ✅ Modify and adapt
- ✅ Distribute
- ✅ Private use

**Attribution appreciated but not required.**

---

## 🌟 Acknowledgments

- **MIT Emerging Talent Program** — For the opportunity and guidance
- **IBM HR Analytics Dataset** — For providing realistic employee data
- **Google Cloud Platform** — For cloud infrastructure support
- **Chart.js Team** — For excellent visualization library
- **Open Source Community** — For tools and inspiration

---

## 📞 Contact & Support

### 📧 Get in Touch

- **Issues:** [GitHub Issues](https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics/discussions)
- **Email:** See team profiles above

### 📚 Additional Resources

- 📖 [User Guide](./USER_GUIDE.md) — Complete user documentation (Ukrainian)
- 🚀 [Deployment Guide](./DEPLOYMENT_GUIDE.md) — Technical deployment
- 🎯 [Improvement Roadmap](./IMPROVEMENT_ROADMAP.md) — Future plans
- 🔧 [API Documentation](./6_final_presentation/hr_portfolio_site/README.md) — API reference

---

## 🎓 Academic Context

This project demonstrates practical application of:

- **Data Science:** EDA, statistical analysis, data visualization
- **Software Engineering:** Full-stack development, REST APIs, testing
- **Cloud Computing:** GCP, BigQuery, serverless deployment
- **HR Analytics:** Employee attrition, workforce optimization, predictive modeling
- **Project Management:** Agile methodology, Git workflow, documentation

**Perfect for:**

- 🎯 Portfolio presentations
- 📚 Academic demonstrations
- 💼 Job interviews
- 🏢 Real company implementation (with proper configuration)

---

## 🔮 Future Directions

We plan to:

- 🤖 **Machine Learning Predictions** — Predict which employees may leave
- 📊 **Advanced Analytics** — Cohort analysis, sentiment analysis, real-time alerts
- 📧 **Email Notifications** — Automated alerts for HR managers
- 🔒 **Authentication System** — Multi-user support with role-based access
- 📱 **Mobile Applications** — Native iOS/Android apps
- 🔌 **HRIS Integrations** — Connect with Workday, SAP, etc.
- ☁️ **Full Cloud Deployment** — Production-ready GCP infrastructure

See [IMPROVEMENT_ROADMAP.md](./IMPROVEMENT_ROADMAP.md) for detailed plans.

---

## ⭐ Star This Project

If you find this project useful, please consider giving it a star ⭐

It helps others discover the project and motivates us to continue improving it!

---

<div align="center">

**Built with ❤️ by the HR Analytics Team**

[Report Bug](https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics/issues) · [Request Feature](https://github.com/Yevheniia-Rudenko/ELO-2---HR-Analytics/issues) · [Documentation](./USER_GUIDE.md)

---

**© 2024-2025 HR Analytics Team | MIT Emerging Talent Program**

*Exploring people through data — the heart of HR analytics.* ✨

</div>
