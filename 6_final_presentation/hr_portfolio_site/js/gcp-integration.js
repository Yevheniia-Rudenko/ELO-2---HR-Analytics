// ==========================================
// GCP BigQuery Integration (Optional)
// ==========================================

/**
 * This file provides integration with Google Cloud Platform BigQuery
 * to fetch real-time data for the HR Analytics dashboard.
 * 
 * Two modes available:
 * 1. Local API Server (Python Flask) - Recommended for development
 * 2. Direct BigQuery API - Requires OAuth (for production)
 */

const GCP_CONFIG = {
    projectId: 'YOUR_GCP_PROJECT_ID',  // Replace with your GCP project ID
    projectNumber: 'YOUR_PROJECT_NUMBER',  // Replace with your project number
    datasetId: 'IBMAnalytics',
    tableId: 'employee_attrition',
    // API server URL (local development or deployed)
    apiUrl: 'http://localhost:5000/api'  // Change to your deployed URL
};

/**
 * Fetch data from local API server
 */
async function fetchFromAPI(endpoint) {
    try {
        const response = await fetch(`${GCP_CONFIG.apiUrl}/${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error || 'Unknown error');
        }
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return null;
    }
}

/**
 * Fetch data from BigQuery using REST API
 * Note: This requires proper authentication and CORS configuration
 */
async function fetchFromBigQuery(query) {
    const endpoint = `https://bigquery.googleapis.com/bigquery/v2/projects/${GCP_CONFIG.projectId}/queries`;
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add authorization header with OAuth token
                // 'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                query: query,
                useLegacySql: false,
                maxResults: 10000
            })
        });

        if (!response.ok) {
            throw new Error(`BigQuery API error: ${response.status}`);
        }

        const data = await response.json();
        return parseQueryResults(data);
    } catch (error) {
        console.error('Error fetching from BigQuery:', error);
        return null;
    }
}

/**
 * Parse BigQuery query results into usable format
 */
function parseQueryResults(data) {
    if (!data.rows) return [];
    
    const schema = data.schema.fields;
    return data.rows.map(row => {
        const obj = {};
        row.f.forEach((field, index) => {
            obj[schema[index].name] = field.v;
        });
        return obj;
    });
}

/**
 * Example queries for dashboard data
 */
const QUERIES = {
    // Get overall attrition statistics
    attritionStats: `
        SELECT
            Attrition,
            COUNT(*) as total,
            ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
        FROM `YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_attrition`
        GROUP BY Attrition
        ORDER BY Attrition
    `,
    
    // Get department-wise attrition
    departmentAttrition: `
        SELECT
            Department,
            COUNT(*) as attrition_count,
            ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
        FROM \`YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_attrition\`
        WHERE Attrition = "Yes"
        GROUP BY Department
        ORDER BY attrition_count DESC
    `,
    
    // Get age group attrition
    ageGroupAttrition: `
        SELECT
            CASE
                WHEN Age BETWEEN 18 AND 25 THEN '18-25'
                WHEN Age BETWEEN 26 AND 35 THEN '26-35'
                WHEN Age BETWEEN 36 AND 45 THEN '36-45'
                WHEN Age BETWEEN 46 AND 55 THEN '46-55'
                ELSE '55+'
            END as age_group,
            COUNT(CASE WHEN Attrition = 'Yes' THEN 1 END) as left_count,
            COUNT(*) as total_count,
            ROUND(COUNT(CASE WHEN Attrition = 'Yes' THEN 1 END) * 100.0 / COUNT(*), 2) as attrition_rate
        FROM \`YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_attrition\`
        GROUP BY age_group
        ORDER BY 
            CASE age_group
                WHEN '18-25' THEN 1
                WHEN '26-35' THEN 2
                WHEN '36-45' THEN 3
                WHEN '46-55' THEN 4
                ELSE 5
            END
    `,
    
    // Get overtime impact
    overtimeImpact: `
        SELECT
            OverTime,
            Attrition,
            COUNT(*) as count
        FROM \`YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_attrition\`
        GROUP BY OverTime, Attrition
        ORDER BY OverTime, Attrition
    `,
    
    // Get work-life balance distribution
    workLifeBalance: `
        SELECT
            WorkLifeBalance,
            COUNT(*) as count
        FROM \`YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_attrition\`
        GROUP BY WorkLifeBalance
        ORDER BY WorkLifeBalance
    `,
    
    // Get satisfaction metrics
    satisfactionMetrics: `
        SELECT
            ROUND(AVG(JobSatisfaction), 2) as avg_job_satisfaction,
            ROUND(AVG(EnvironmentSatisfaction), 2) as avg_env_satisfaction,
            ROUND(AVG(RelationshipSatisfaction), 2) as avg_rel_satisfaction,
            ROUND(AVG(WorkLifeBalance), 2) as avg_work_life_balance
        FROM \`YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_attrition\`
    `
};

/**
 * Load dashboard data from BigQuery via API server
 */
async function loadDashboardDataFromBigQuery() {
    console.log('🔄 Loading data from BigQuery via API server...');
    
    try {
        // Fetch all data in one request
        const allData = await fetchFromAPI('all-data');
        
        if (allData) {
            console.log('✅ Data loaded successfully:', allData);
            
            // Update KPIs
            updateKPIsFromGCP(allData.attrition_stats, allData.satisfaction_metrics);
            
            // Update charts
            updateChartsFromGCP(
                allData.department_attrition,
                allData.age_attrition,
                allData.overtime_impact,
                allData.work_life_balance
            );
            
            console.log('✅ Dashboard updated with BigQuery data');
            
            // Show success notification
            showNotification('Data loaded from BigQuery successfully!', 'success');
        } else {
            throw new Error('No data received from API');
        }
    } catch (error) {
        console.error('❌ Error loading BigQuery data:', error);
        console.log('ℹ️ Falling back to static data');
        showNotification('Using static data (API server not available)', 'info');
    }
}

/**
 * Update KPI cards with real data from GCP
 */
function updateKPIsFromGCP(attritionStats, satisfactionMetrics) {
    if (!attritionStats || !satisfactionMetrics) return;
    
    // Find attrition rate
    const attritionRecord = attritionStats.find(r => r.attrition === 'Yes');
    if (attritionRecord) {
        const kpiCards = document.querySelectorAll('.kpi-card');
        if (kpiCards[1]) {
            kpiCards[1].querySelector('.kpi-value').textContent = `${attritionRecord.percentage}%`;
            kpiCards[1].querySelector('.kpi-label').textContent = `${attritionRecord.total} employees left`;
        }
    }
    
    // Update satisfaction
    if (satisfactionMetrics.job_satisfaction) {
        const kpiCards = document.querySelectorAll('.kpi-card');
        if (kpiCards[2]) {
            kpiCards[2].querySelector('.kpi-value').textContent = 
                `${satisfactionMetrics.job_satisfaction}/4`;
        }
    }
}

/**
 * Update charts with real data from GCP
 */
function updateChartsFromGCP(deptData, ageData, overtimeData, wlbData) {
    console.log('📊 Updating charts with GCP data...');
    
    // Store data globally for chart updates
    window.gcpData = {
        departments: deptData,
        ages: ageData,
        overtime: overtimeData,
        workLifeBalance: wlbData
    };
    
    // Re-initialize charts with new data
    if (typeof initializeChartsWithGCPData === 'function') {
        initializeChartsWithGCPData();
    }
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Submit questionnaire to BigQuery
 */
async function submitQuestionnaireToGCP(formData) {
    // In production, this would insert data into BigQuery
    const insertQuery = `
        INSERT INTO \`YOUR_GCP_PROJECT_ID.IBMAnalytics.employee_surveys\`
        (employee_id, environment_satisfaction, job_satisfaction, 
         relationship_satisfaction, work_life_balance, survey_date)
        VALUES
        ('${formData.employeeId}', ${formData.environmentSatisfaction}, 
         ${formData.jobSatisfaction}, ${formData.relationshipSatisfaction},
         ${formData.workLifeBalance}, CURRENT_TIMESTAMP())
    `;
    
    console.log('Would execute:', insertQuery);
    // return await fetchFromBigQuery(insertQuery);
}

/**
 * Submit appraisal to BigQuery
 */
async function submitAppraisalToGCP(formData) {
    // In production, this would insert data into BigQuery
    const insertQuery = `
        INSERT INTO \`YOUR_GCP_PROJECT_ID.IBMAnalytics.performance_appraisals\`
        (employee_id, job_involvement, performance_rating, 
         manager_comments, appraisal_date)
        VALUES
        ('${formData.employeeId}', ${formData.jobInvolvement}, 
         ${formData.performanceRating}, '${formData.managerComments}',
         CURRENT_TIMESTAMP())
    `;
    
    console.log('Would execute:', insertQuery);
    // return await fetchFromBigQuery(insertQuery);
}

// Export functions for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadDashboardDataFromBigQuery,
        submitQuestionnaireToGCP,
        submitAppraisalToGCP,
        fetchFromBigQuery,
        QUERIES
    };
}
