# Google Cloud Platform Setup for Employee Attrition Analytics

## Overview

This document provides comprehensive documentation of the Google Cloud Platform (GCP) infrastructure established for the Employee Attrition Analytics project. It describes the cloud architecture, data storage solutions, analytical tools, and integration patterns implemented to support data-driven HR analytics and collaborative research.

The infrastructure follows cloud-native best practices and provides a scalable foundation for SQL-based analysis, Python-based data science workflows, and interactive business intelligence dashboards.

---

## Infrastructure Components

### GCP Project

All cloud resources are isolated within a dedicated GCP project:

- **Project ID:** `YOUR_GCP_PROJECT_ID`
- **Project Number:** `YOUR_PROJECT_NUMBER`
- **Project Name:** `employee-attrition-analysis`

This project serves as the central workspace for all analytics activities, providing:

- Resource isolation and security boundaries
- IAM-based access control for team collaboration
- Centralized billing and quota management
- Foundation for future pipeline orchestration and additional data sources

### BigQuery Dataset

The analytical data warehouse is structured using BigQuery datasets:

- **Dataset ID:** `IBMAnalytics`
- **Location:** Multi-region (US)
- **Purpose:** Central repository for HR analytics tables

This dataset acts as a logical container for all HR-related tables, enabling efficient querying, schema management, and access control at the dataset level.

### Core Data Table

The primary analytical table contains the IBM HR Employee Attrition dataset:

- **Table Name:** `employee_attrition`
- **Full Reference:** `YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_attrition`
- **Records:** 1,470 employees
- **Attributes:** 35 columns

#### Schema Overview

The table schema encompasses multiple analytical dimensions:

- **Demographics:** Age, Gender, MaritalStatus, DistanceFromHome
- **Employment:** Department, JobRole, JobLevel, YearsAtCompany
- **Compensation:** MonthlyIncome, PercentSalaryHike, StockOptionLevel
- **Work Patterns:** OverTime, NumCompaniesWorked, YearsSinceLastPromotion
- **Satisfaction Metrics:** JobSatisfaction, WorkLifeBalance, EnvironmentSatisfaction, RelationshipSatisfaction
- **Target Variable:** Attrition (Yes/No)

The schema was automatically inferred during CSV ingestion and is optimized for analytical queries without additional preprocessing.

---

## Data Ingestion

The IBM HR Employee Attrition dataset was ingested into BigQuery through the following process:

1. **Source:** CSV file from Kaggle (IBM HR Analytics Employee Attrition & Performance dataset)
2. **Method:** BigQuery Console upload (manual ingestion)
3. **Schema:** Auto-detected during CSV import
4. **Validation:** Data quality checks performed post-ingestion

This one-time data load established the foundation for all subsequent analytical workflows.

---

## Business Intelligence Dashboard

### Looker Studio Integration

An interactive dashboard provides real-time visualization of employee attrition patterns and HR metrics:

- **Dashboard URL:** <https://lookerstudio.google.com/reporting/d2337cc9-accc-4737-b5c1-33b6ccfaad69>
- **Data Source:** Direct BigQuery connection (live data)
- **Refresh Method:** Automatic (no manual extracts required)

### Dashboard Capabilities

The dashboard enables stakeholders to:

- Monitor overall attrition rates and trends
- Compare attrition across departments, job roles, and demographics
- Analyze satisfaction metrics and their correlation with retention
- Identify risk factors including overtime patterns, tenure effects, and compensation disparities
- Export insights for presentations and strategic planning

---

## Collaboration and Access Management

### Team Access

The project supports collaborative analytics through GCP Identity and Access Management (IAM). Team members can be granted appropriate roles based on their responsibilities.

### Standard Role Assignments

Typical role configurations include:

- **BigQuery Data Viewer:** Read access to tables and metadata
- **BigQuery Job User:** Permission to execute query jobs
- **BigQuery Data Editor:** Write access for data preparation workflows
- **Looker Studio Viewer/Editor:** Dashboard access and modification rights

### Collaborative Workflows

With proper IAM configuration, team members can:

- Execute ad-hoc SQL queries in the BigQuery console
- Develop and share analytical notebooks using Python clients
- Collaborate on dashboard design and visualization refinement
- Contribute derived tables and analytical artifacts
- Conduct peer review of analytical methodologies

---

## SQL-Based Analysis Examples

### Attrition Distribution Analysis

Query to examine the overall attrition rate:

```sql
SELECT
  Attrition,
  COUNT(*) AS total,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) AS percentage
FROM `employee-attrition-analysis.IBMAnalytics.employee_attrition`
GROUP BY Attrition
ORDER BY Attrition;
```

This provides class balance understanding for predictive modeling.

### Departmental Attrition Analysis

Identify departments with highest attrition rates:

```sql
SELECT
  Department,
  COUNT(*) AS attrition_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) AS attrition_percentage
FROM `employee-attrition-analysis.IBMAnalytics.employee_attrition`
WHERE Attrition = "Yes"
GROUP BY Department
ORDER BY attrition_count DESC;
```

This highlights organizational areas requiring HR intervention.

### Job Satisfaction Analysis

Compare average satisfaction metrics across job roles:

```sql
SELECT
  JobRole,
  COUNT(*) AS employee_count,
  ROUND(AVG(JobSatisfaction), 2) AS avg_job_satisfaction,
  ROUND(AVG(EnvironmentSatisfaction), 2) AS avg_environment_satisfaction,
  ROUND(AVG(WorkLifeBalance), 2) AS avg_work_life_balance
FROM `employee-attrition-analysis.IBMAnalytics.employee_attrition`
GROUP BY JobRole
ORDER BY avg_job_satisfaction DESC;
```

This identifies roles with systematic satisfaction challenges.

### Risk Factor Segmentation

Analyze the intersection of overtime and work-life balance on attrition:

```sql
SELECT
  OverTime,
  WorkLifeBalance,
  Attrition,
  COUNT(*) AS segment_count
FROM `employee-attrition-analysis.IBMAnalytics.employee_attrition`
GROUP BY OverTime, WorkLifeBalance, Attrition
ORDER BY segment_count DESC;
```

Results can inform targeted retention strategies and policy adjustments.

---

## Python-Based Analytics Integration

### Architecture

The BigQuery Python client library enables seamless integration between cloud storage and local analytical environments, supporting:

- Exploratory data analysis (EDA)
- Feature engineering for machine learning
- Statistical hypothesis testing
- Custom visualization development
- Model training and evaluation

### Authentication Methods

Two primary authentication patterns are supported:

1. **Service Account:** JSON key file for production environments
2. **Application Default Credentials:** Automatic credential discovery for development

### Sample Python Workflow

```python
from google.cloud import bigquery
import pandas as pd

# Initialize BigQuery client
client = bigquery.Client(project='employee-attrition-analysis')

# Define analytical query
query = """
SELECT
  Age,
  Department,
  JobRole,
  MonthlyIncome,
  YearsAtCompany,
  Attrition
FROM `employee-attrition-analysis.IBMAnalytics.employee_attrition`
WHERE Attrition = 'Yes'
"""

# Execute query and load into DataFrame
query_job = client.query(query)
df = query_job.to_dataframe()

# Perform local analysis
print(f"Total attrition cases: {len(df)}")
print(f"\nAttrition by department:\n{df['Department'].value_counts()}")
```

### Advanced Use Cases

The Python integration supports:

- **Machine Learning:** scikit-learn, TensorFlow, PyTorch model development
- **Visualization:** matplotlib, seaborn, plotly interactive charts
- **Statistical Analysis:** scipy, statsmodels hypothesis testing
- **Feature Engineering:** pandas transformations, custom metric calculations
- **Model Deployment:** Integration with Vertex AI for production ML pipelines

---

## System Architecture Summary

### Technology Stack

The current implementation leverages the following components:

- **BigQuery:** Cloud data warehouse (single source of truth)
- **SQL:** Primary query language for aggregation and analysis
- **Python:** Advanced analytics, EDA, and machine learning workflows
- **Looker Studio:** Business intelligence and stakeholder dashboards
- **IAM:** Role-based access control for secure collaboration

### Integration Patterns

Data flows through the system as follows:

1. **Source Data:** CSV ingestion into BigQuery tables
2. **SQL Analysis:** Ad-hoc queries in BigQuery console
3. **Python Analysis:** BigQuery client library → pandas DataFrame → ML/visualization
4. **Dashboarding:** Looker Studio direct connection to BigQuery
5. **Collaboration:** IAM roles enabling multi-user access across all layers

### Extensibility

The architecture supports future enhancements including:

- **Data Transformation:** dbt (data build tool) for analytics engineering
- **Pipeline Orchestration:** Apache Airflow or Cloud Composer for scheduled workflows
- **Additional Data Sources:** Integration of payroll, performance reviews, recruitment data
- **Advanced Analytics:** Vertex AI for production ML models and predictions
- **Specialized Dashboards:** Role-specific views for executives, HR managers, and department heads

---

## Operational Status

The infrastructure is fully operational and production-ready. All components have been tested and validated for analytical workloads. The system is currently supporting:

- Ad-hoc SQL analysis and reporting
- Python-based exploratory data analysis
- Interactive dashboard access for stakeholders
- Collaborative research and peer review

No additional configuration is required to begin analytical work. All core capabilities are available for immediate use.
