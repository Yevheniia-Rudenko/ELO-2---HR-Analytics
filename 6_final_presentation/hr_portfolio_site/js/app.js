// ==========================================
// HR Analytics System - JavaScript
// ==========================================

// Note: API configuration is now in config.js
// This file is loaded before app.js in index.html

// Get API configuration from config.js
const apiConfig = typeof getAPIConfig === 'function' ? getAPIConfig() : { apiUrl: 'http://localhost:5001/api', useAPI: false };
const API_URL = apiConfig.apiUrl;
const USE_API_BACKEND = apiConfig.useAPI;

console.log('🔧 Environment:', apiConfig.environment);
console.log('📡 API URL:', API_URL);
console.log(USE_API_BACKEND ? '✅ API Backend: Enabled' : '❌ API Backend: Disabled');

const USE_GCP_INTEGRATION = false; // Legacy flag, not used

// ==========================================
// LocalStorage Functions (for GitHub Pages)
// ==========================================
function saveQuestionnaireToLocal(data) {
    const questionnaires = JSON.parse(localStorage.getItem('hr_questionnaires') || '[]');
    questionnaires.push(data);
    localStorage.setItem('hr_questionnaires', JSON.stringify(questionnaires));
    console.log('✅ Questionnaire saved to localStorage:', data);
}

function saveAppraisalToLocal(data) {
    const appraisals = JSON.parse(localStorage.getItem('hr_appraisals') || '[]');
    appraisals.push(data);
    localStorage.setItem('hr_appraisals', JSON.stringify(appraisals));
    console.log('✅ Appraisal saved to localStorage:', data);
}

function getLocalData() {
    return {
        questionnaires: JSON.parse(localStorage.getItem('hr_questionnaires') || '[]'),
        appraisals: JSON.parse(localStorage.getItem('hr_appraisals') || '[]')
    };
}

function showSuccessMessage(formType) {
    const successId = formType === 'questionnaire' ? 'questionnaireSuccess' : 'appraisalSuccess';
    const formId = formType === 'questionnaire' ? 'employeeQuestionnaire' : 'managerAppraisal';
    
    document.getElementById(successId).style.display = 'block';
    document.getElementById(formId).style.display = 'none';
}

// Wait for Chart.js to load
function waitForChart() {
    return new Promise((resolve) => {
        if (typeof Chart !== 'undefined') {
            resolve();
        } else {
            const checkInterval = setInterval(() => {
                if (typeof Chart !== 'undefined') {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 50);
        }
    });
}

// Tab Navigation
document.addEventListener('DOMContentLoaded', async function() {
    // Wait for Chart.js to be ready
    await waitForChart();
    
    // Tab switching functionality
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all tabs and links
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked link and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Initialize charts
    initializeCharts();

    // Load data from GCP if enabled
    if (USE_GCP_INTEGRATION && typeof loadDashboardDataFromBigQuery === 'function') {
        // Wait a bit for charts to initialize
        setTimeout(() => {
            loadDashboardDataFromBigQuery();
        }, 500);
    }

    // Form handlers
    setupFormHandlers();
});

// ==========================================
// Charts Initialization
// ==========================================
function initializeCharts() {
    console.log('Initializing charts...');
    console.log('Chart available:', typeof Chart !== 'undefined');
    
    // Chart 1: Attrition by Department
    const deptCtx = document.getElementById('attritionDeptChart');
    console.log('Department chart canvas:', deptCtx);
    
    if (deptCtx) {
        try {
            new Chart(deptCtx, {
                type: 'bar',
                data: {
                    labels: ['Sales', 'R&D', 'HR'],
                    datasets: [{
                        label: 'Attrition Count',
                        data: [92, 133, 12],
                        backgroundColor: [
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(16, 185, 129, 0.8)'
                        ],
                        borderColor: [
                            'rgb(239, 68, 68)',
                            'rgb(245, 158, 11)',
                            'rgb(16, 185, 129)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 20
                            }
                        }
                    }
                }
            });
            console.log('Department chart created successfully');
        } catch (error) {
            console.error('Error creating department chart:', error);
        }
    }

    // Chart 2: Attrition by Age Group
    const ageCtx = document.getElementById('attritionAgeChart');
    if (ageCtx) {
        new Chart(ageCtx, {
            type: 'line',
            data: {
                labels: ['18-25', '26-35', '36-45', '46-55', '55+'],
                datasets: [{
                    label: 'Attrition Count',
                    data: [40, 116, 43, 26, 8],
                    backgroundColor: 'rgba(37, 99, 235, 0.2)',
                    borderColor: 'rgb(37, 99, 235)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Chart 3: Overtime Impact
    const overtimeCtx = document.getElementById('overtimeChart');
    if (overtimeCtx) {
        new Chart(overtimeCtx, {
            type: 'doughnut',
            data: {
                labels: ['Overtime - Left', 'Overtime - Stayed', 'No Overtime - Left', 'No Overtime - Stayed'],
                datasets: [{
                    data: [127, 289, 110, 944],
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.9)',
                        'rgba(245, 158, 11, 0.9)',
                        'rgba(251, 191, 36, 0.7)',
                        'rgba(16, 185, 129, 0.9)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Chart 4: Work-Life Balance Distribution
    const wlbCtx = document.getElementById('workLifeBalanceChart');
    if (wlbCtx) {
        new Chart(wlbCtx, {
            type: 'bar',
            data: {
                labels: ['Bad (1)', 'Good (2)', 'Better (3)', 'Best (4)'],
                datasets: [{
                    label: 'Employee Count',
                    data: [80, 344, 893, 153],
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)'
                    ],
                    borderColor: [
                        'rgb(239, 68, 68)',
                        'rgb(245, 158, 11)',
                        'rgb(59, 130, 246)',
                        'rgb(16, 185, 129)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// ==========================================
// Form Handlers
// ==========================================
function setupFormHandlers() {
    // Employee Questionnaire Handler
    const questionnaireForm = document.getElementById('employeeQuestionnaire');
    if (questionnaireForm) {
        questionnaireForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                employeeId: document.getElementById('employeeId').value,
                environmentSatisfaction: document.getElementById('environmentSatisfaction').value,
                jobSatisfaction: document.getElementById('jobSatisfaction').value,
                relationshipSatisfaction: document.getElementById('relationshipSatisfaction').value,
                workLifeBalance: document.getElementById('workLifeBalance').value,
                submissionDate: new Date().toISOString()
            };

            // Log to console
            console.log('Employee Questionnaire Submitted:', formData);

            // Save to localStorage (works on GitHub Pages)
            saveQuestionnaireToLocal(formData);
            
            // Send to backend API (only on localhost)
            if (USE_API_BACKEND) {
                fetch(`${API_URL}/questionnaire`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('✅ Questionnaire saved to database:', data);
                        showSuccessMessage('questionnaire');
                        updateLiveInsightsCharts();
                    } else {
                        console.error('❌ Error saving questionnaire:', data.error);
                        alert('Error saving questionnaire. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('❌ Network error:', error);
                    console.log('⚠️ Make sure API server is running: python3 simple_api.py');
                    showSuccessMessage('questionnaire');
                });
            } else {
                // Static mode (GitHub Pages) - show success
                showSuccessMessage('questionnaire');
                updateLiveInsightsCharts();
            }

            // Optional GCP Integration
            if (USE_GCP_INTEGRATION && typeof submitQuestionnaireToGCP === 'function') {
                submitQuestionnaireToGCP(formData);
            }
        });
    }

    // Manager Appraisal Handler
    const appraisalForm = document.getElementById('appraisalForm');
    if (appraisalForm) {
        appraisalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                employeeId: document.getElementById('appraisalEmployeeId').value,
                jobInvolvement: document.getElementById('jobInvolvement').value
            };
            
            // Log to console
            console.log('Manager Appraisal Submitted:', formData);

            // Save to localStorage (works on GitHub Pages)
            saveAppraisalToLocal(formData);
            
            // Send to backend API (only on localhost)
            if (USE_API_BACKEND) {
                fetch(`${API_URL}/appraisal`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('✅ Appraisal saved to database:', data);
                        showSuccessMessage('appraisal');
                        updateEmployeeStatus(formData.employeeId);
                        updateLiveInsightsCharts();
                    } else {
                        console.error('❌ Error saving appraisal:', data.error);
                        alert('Error saving appraisal. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('❌ Network error:', error);
                    console.log('⚠️ Make sure API server is running: python3 simple_api.py');
                    showSuccessMessage('appraisal');
                    document.getElementById('appraisalSuccess').style.display = 'block';
                    document.getElementById('appraisalFormSection').style.display = 'none';
                    updateEmployeeStatus(formData.employeeId);
                });
            } else {
                // Demo mode
                document.getElementById('appraisalSuccess').style.display = 'block';
                document.getElementById('appraisalFormSection').style.display = 'none';
                updateEmployeeStatus(formData.employeeId);
            }

            // Optional GCP Integration
            if (USE_GCP_INTEGRATION && typeof submitAppraisalToGCP === 'function') {
                submitAppraisalToGCP(formData);
            }
        });
    }
}

// ==========================================
// Appraisal Functions
// ==========================================
function openAppraisalForm(employeeId, employeeName) {
    // Populate form
    document.getElementById('appraisalEmployeeId').value = employeeId;
    document.getElementById('employeeName').textContent = employeeName;
    document.getElementById('employeeIdDisplay').textContent = employeeId;

    // Show form section
    document.getElementById('appraisalFormSection').style.display = 'block';
    document.getElementById('appraisalSuccess').style.display = 'none';

    // Reset form
    document.getElementById('appraisalForm').reset();
    document.getElementById('appraisalEmployeeId').value = employeeId;

    // Scroll to form
    document.getElementById('appraisalFormSection').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function closeAppraisalForm() {
    document.getElementById('appraisalFormSection').style.display = 'none';
    document.getElementById('appraisalForm').reset();
}

function viewAppraisal(employeeId) {
    // In production, this would fetch data from backend
    alert(`Viewing appraisal for employee ${employeeId}\n\nThis would show the completed appraisal details.`);
}

function updateEmployeeStatus(employeeId) {
    // Find employee card and update status
    const employeeCards = document.querySelectorAll('.employee-card');
    employeeCards.forEach(card => {
        const button = card.querySelector('.btn');
        if (button && button.getAttribute('onclick').includes(employeeId)) {
            const statusBadge = card.querySelector('.status');
            if (statusBadge) {
                statusBadge.textContent = 'Completed';
                statusBadge.classList.remove('pending');
                statusBadge.classList.add('completed');
            }
            button.textContent = 'View';
            button.classList.remove('btn-primary');
            button.classList.add('btn-view');
            button.setAttribute('onclick', `viewAppraisal('${employeeId}')`);
        }
    });
}

// ==========================================
// Dashboard Stats Update Functions
// ==========================================
function updateDashboardStats() {
    // Update KPI cards and charts with latest data from backend
    if (!USE_API_BACKEND) {
        console.log('⚠️ API backend disabled, skipping stats update');
        return;
    }

    console.log('📊 Updating dashboard statistics...');

    // Fetch satisfaction stats
    fetch(`${API_URL}/satisfaction-stats`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateSatisfactionKPI(data.data);
                updateSatisfactionChart(data.data);
                console.log('✅ Satisfaction stats updated');
            }
        })
        .catch(error => console.error('Error fetching satisfaction stats:', error));

    // Fetch performance stats
    fetch(`${API_URL}/performance-stats`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updatePerformanceKPI(data.data);
                console.log('✅ Performance stats updated');
            }
        })
        .catch(error => console.error('Error fetching performance stats:', error));
}

function updateSatisfactionKPI(stats) {
    // Update Average Satisfaction KPI card
    const kpiValue = document.querySelector('.kpi-card:nth-child(2) .kpi-value');
    if (kpiValue && stats.avg_overall > 0) {
        kpiValue.textContent = `${stats.avg_overall}/4`;
        
        // Add animation
        kpiValue.style.animation = 'none';
        setTimeout(() => {
            kpiValue.style.animation = 'pulse 0.5s ease';
        }, 10);
        
        console.log(`📊 Updated Satisfaction KPI: ${stats.avg_overall}/4`);
    }
}

function updatePerformanceKPI(stats) {
    // Update Average Performance KPI card
    const kpiValue = document.querySelector('.kpi-card:nth-child(4) .kpi-value');
    if (kpiValue && stats.avg_performance > 0) {
        kpiValue.textContent = `${stats.avg_performance}/4`;
        
        // Add animation
        kpiValue.style.animation = 'none';
        setTimeout(() => {
            kpiValue.style.animation = 'pulse 0.5s ease';
        }, 10);
        
        console.log(`⭐ Updated Performance KPI: ${stats.avg_performance}/4`);
    }
}

function updateSatisfactionChart(stats) {
    // Update Satisfaction Scores chart
    if (typeof satisfactionChart !== 'undefined' && satisfactionChart) {
        satisfactionChart.data.datasets[0].data = [
            stats.avg_environment,
            stats.avg_job,
            stats.avg_relationship,
            stats.avg_work_life_balance
        ];
        satisfactionChart.update();
        console.log('📊 Updated Satisfaction Chart');
    }
}

// Load initial stats on page load
document.addEventListener('DOMContentLoaded', function() {
    if (USE_API_BACKEND) {
        setTimeout(() => {
            updateDashboardStats();
        }, 1000);
    } else {
        // Load from localStorage if API is disabled
        console.log('📦 Loading initial data from localStorage...');
        setTimeout(() => {
            updateLiveInsightsCharts();
            updateRecentSubmissionsFromLocal();
        }, 500);
    }
});

// ==========================================
// Data Export Functions (Optional Enhancement)
// ==========================================
function exportDashboardData() {
    // Export dashboard data as CSV
    const data = {
        totalEmployees: 1470,
        attritionRate: 16.1,
        avgSatisfaction: 2.73,
        avgTenure: 7.0
    };
    
    console.log('Exporting dashboard data:', data);
    // In production: generate CSV and download
}

// ==========================================
// Local Storage for Demo (Optional)
// ==========================================
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// ==========================================
// Animation Effects
// ==========================================
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Trigger animations on page load
window.addEventListener('load', function() {
    // Animate KPI values
    const kpiValues = document.querySelectorAll('.kpi-value');
    kpiValues.forEach(el => {
        const targetValue = parseFloat(el.textContent);
        if (!isNaN(targetValue)) {
            animateValue(el, 0, targetValue, 1000);
        }
    });
});

console.log('HR Analytics System initialized successfully');

// ==========================================
// Live Insights Tab Functions
// ==========================================

let liveSatisfactionChart = null;
let satisfactionTrendChart = null;
let trendDataHistory = [];

// Check API Status
async function checkAPIStatus() {
    const indicator = document.getElementById('apiStatusIndicator');
    const statusText = document.getElementById('apiStatusText');
    const apiStatus = document.querySelector('.api-status');
    
    if (!indicator || !statusText) return;
    
    // Hide API status on GitHub Pages (production)
    if (!USE_API_BACKEND) {
        if (apiStatus) apiStatus.style.display = 'none';
        return;
    }
    
    indicator.className = 'status-dot checking';
    statusText.textContent = 'Checking API...';
    
    try {
        const response = await fetch(`${API_URL}/health`, { method: 'GET' });
        if (response.ok) {
            indicator.className = 'status-dot online';
            statusText.textContent = 'API Online';
        } else {
            throw new Error('API not responding');
        }
    } catch (error) {
        indicator.className = 'status-dot offline';
        statusText.textContent = 'API Offline';
        console.error('API Status Check Failed:', error);
    }
}

// Update Live Insights Charts from localStorage
function updateLiveInsightsCharts() {
    const localData = getLocalData();
    const questionnaires = localData.questionnaires;
    
    if (questionnaires.length === 0) {
        console.log('ℹ️ No questionnaire data yet. Submit a survey to see live insights!');
        return;
    }
    
    // Calculate statistics
    const stats = {
        total_responses: questionnaires.length,
        avg_environment: questionnaires.reduce((sum, q) => sum + parseInt(q.environmentSatisfaction), 0) / questionnaires.length,
        avg_job: questionnaires.reduce((sum, q) => sum + parseInt(q.jobSatisfaction), 0) / questionnaires.length,
        avg_relationship: questionnaires.reduce((sum, q) => sum + parseInt(q.relationshipSatisfaction), 0) / questionnaires.length,
        avg_work_life_balance: questionnaires.reduce((sum, q) => sum + parseInt(q.workLifeBalance), 0) / questionnaires.length
    };
    
    stats.avg_overall = (stats.avg_environment + stats.avg_job + stats.avg_relationship + stats.avg_work_life_balance) / 4;
    
    // Update KPI cards
    document.getElementById('totalResponses').textContent = stats.total_responses;
    document.getElementById('avgSatisfaction').textContent = stats.avg_overall.toFixed(1);
    
    // Update charts
    if (liveSatisfactionChart) {
        liveSatisfactionChart.data.datasets[0].data = [
            stats.avg_environment,
            stats.avg_job,
            stats.avg_relationship,
            stats.avg_work_life_balance
        ];
        liveSatisfactionChart.update();
    }
    
    console.log('✅ Live insights updated from localStorage:', stats);
}

// Initialize Live Charts
function initializeLiveCharts() {
    const satChartCanvas = document.getElementById('liveSatisfactionChart');
    const trendChartCanvas = document.getElementById('satisfactionTrendChart');
    
    if (satChartCanvas && typeof Chart !== 'undefined') {
        liveSatisfactionChart = new Chart(satChartCanvas, {
            type: 'bar',
            data: {
                labels: ['Environment', 'Job', 'Relationships', 'Work-Life'],
                datasets: [{
                    label: 'Satisfaction Score',
                    data: [0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(37, 99, 235, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(139, 92, 246, 0.8)'
                    ],
                    borderColor: [
                        'rgb(37, 99, 235)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(139, 92, 246)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 4,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    if (trendChartCanvas && typeof Chart !== 'undefined') {
        satisfactionTrendChart = new Chart(trendChartCanvas, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Overall Satisfaction',
                    data: [],
                    borderColor: 'rgb(37, 99, 235)',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 4,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }
}

// Refresh Live Insights
async function refreshLiveInsights() {
    console.log('🔄 Refreshing Live Insights...');
    
    // If API backend is disabled, use localStorage
    if (!USE_API_BACKEND) {
        console.log('📦 Loading data from localStorage...');
        updateLiveInsightsCharts();
        updateRecentSubmissionsFromLocal();
        console.log('✅ Live Insights refreshed from localStorage');
        return;
    }
    
    try {
        // Fetch satisfaction stats
        const satResponse = await fetch(`${API_URL}/satisfaction-stats`);
        const satData = await satResponse.json();
        
        if (satData.success) {
            const stats = satData.data;
            
            // Update KPI cards
            document.getElementById('liveTotalSurveys').textContent = stats.total_responses;
            document.getElementById('liveSatisfaction').textContent = `${stats.avg_overall.toFixed(1)}/4`;
            
            // Update trend indicators
            const satPercent = (stats.avg_overall / 4 * 100).toFixed(0);
            const surveyTrend = document.getElementById('surveyTrend');
            surveyTrend.textContent = `${satPercent}% satisfaction rate`;
            surveyTrend.className = satPercent >= 75 ? 'kpi-trend positive' : satPercent >= 50 ? 'kpi-trend neutral' : 'kpi-trend negative';
            
            // Update detailed stats
            document.getElementById('detailEnv').textContent = stats.avg_environment.toFixed(1);
            document.getElementById('detailJob').textContent = stats.avg_job.toFixed(1);
            document.getElementById('detailRel').textContent = stats.avg_relationship.toFixed(1);
            document.getElementById('detailWLB').textContent = stats.avg_work_life_balance.toFixed(1);
            
            // Update progress bars
            document.getElementById('progressEnv').style.width = `${(stats.avg_environment / 4 * 100)}%`;
            document.getElementById('progressJob').style.width = `${(stats.avg_job / 4 * 100)}%`;
            document.getElementById('progressRel').style.width = `${(stats.avg_relationship / 4 * 100)}%`;
            document.getElementById('progressWLB').style.width = `${(stats.avg_work_life_balance / 4 * 100)}%`;
            
            // Update live satisfaction chart
            if (liveSatisfactionChart) {
                liveSatisfactionChart.data.datasets[0].data = [
                    stats.avg_environment,
                    stats.avg_job,
                    stats.avg_relationship,
                    stats.avg_work_life_balance
                ];
                liveSatisfactionChart.update();
            }
            
            // Update satisfaction insight
            const highest = Math.max(stats.avg_environment, stats.avg_job, stats.avg_relationship, stats.avg_work_life_balance);
            const lowest = Math.min(stats.avg_environment, stats.avg_job, stats.avg_relationship, stats.avg_work_life_balance);
            const categories = ['Environment', 'Job', 'Relationships', 'Work-Life Balance'];
            const values = [stats.avg_environment, stats.avg_job, stats.avg_relationship, stats.avg_work_life_balance];
            const highestCat = categories[values.indexOf(highest)];
            const lowestCat = categories[values.indexOf(lowest)];
            
            if (stats.total_responses > 0) {
                document.getElementById('satisfactionInsight').textContent = 
                    `Highest: ${highestCat} (${highest.toFixed(1)}), Lowest: ${lowestCat} (${lowest.toFixed(1)})`;
            }
            
            // Add to trend history
            if (stats.total_responses > 0 && (trendDataHistory.length === 0 || 
                trendDataHistory[trendDataHistory.length - 1] !== stats.avg_overall)) {
                trendDataHistory.push(stats.avg_overall);
                
                if (satisfactionTrendChart) {
                    satisfactionTrendChart.data.labels = trendDataHistory.map((_, i) => `#${i + 1}`);
                    satisfactionTrendChart.data.datasets[0].data = trendDataHistory;
                    satisfactionTrendChart.update();
                }
                
                document.getElementById('trendDataPoints').textContent = 
                    `${trendDataHistory.length} data points tracked`;
            }
        }
        
        // Fetch performance stats
        const perfResponse = await fetch(`${API_URL}/performance-stats`);
        const perfData = await perfResponse.json();
        
        if (perfData.success) {
            const stats = perfData.data;
            document.getElementById('liveTotalAppraisals').textContent = stats.total_appraisals;
            document.getElementById('livePerformance').textContent = `${stats.avg_performance.toFixed(1)}/4`;
            
            const perfPercent = (stats.avg_performance / 4 * 100).toFixed(0);
            const perfTrend = document.getElementById('performanceTrend');
            perfTrend.textContent = `${perfPercent}% performance rate`;
            perfTrend.className = perfPercent >= 75 ? 'kpi-trend positive' : perfPercent >= 50 ? 'kpi-trend neutral' : 'kpi-trend negative';
        }
        
        // Fetch all data for recent submissions
        const allDataResponse = await fetch(`${API_URL}/all-data`);
        const allData = await allDataResponse.json();
        
        if (allData.success) {
            updateRecentSubmissions(allData.data);
        }
        
        console.log('✅ Live Insights refreshed successfully');
        
    } catch (error) {
        console.error('❌ Error refreshing live insights:', error);
    }
}

// Update Recent Submissions List
function updateRecentSubmissions(data) {
    const listContainer = document.getElementById('recentSubmissionsList');
    if (!listContainer) return;
    
    const allSubmissions = [
        ...data.questionnaires.map(q => ({
            type: 'Survey',
            id: q.id || 'N/A',
            employeeId: q.employeeId,
            timestamp: q.saved_at || q.submissionDate,
            badge: 'Survey'
        })),
        ...data.appraisals.map(a => ({
            type: 'Appraisal',
            id: a.id || 'N/A',
            employeeId: a.employeeId,
            timestamp: a.saved_at || a.appraisalDate,
            badge: 'Review'
        }))
    ];
    
    // Sort by timestamp (most recent first)
    allSubmissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Take top 10
    const recent = allSubmissions.slice(0, 10);
    
    if (recent.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No submissions yet. Fill out a survey to see data here!</p>';
    } else {
        listContainer.innerHTML = recent.map(item => `
            <div class="recent-item animate-fade-in">
                <div class="recent-item-info">
                    <div class="recent-item-title">${item.type} - ${item.employeeId}</div>
                    <div class="recent-item-meta">ID: ${item.id} • ${new Date(item.timestamp).toLocaleString()}</div>
                </div>
                <span class="recent-item-badge">${item.badge}</span>
            </div>
        `).join('');
    }
}

// Update Recent Submissions from localStorage
function updateRecentSubmissionsFromLocal() {
    const localData = getLocalData();
    const listContainer = document.getElementById('recentSubmissionsList');
    if (!listContainer) return;
    
    const allSubmissions = [
        ...localData.questionnaires.map((q, idx) => ({
            type: 'Survey',
            id: idx + 1,
            employeeId: q.employeeId,
            timestamp: q.submissionDate,
            badge: 'Survey'
        })),
        ...localData.appraisals.map((a, idx) => ({
            type: 'Appraisal',
            id: idx + 1,
            employeeId: a.employeeId,
            timestamp: a.appraisalDate,
            badge: 'Review'
        }))
    ];
    
    // Sort by timestamp (most recent first)
    allSubmissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Take top 10
    const recent = allSubmissions.slice(0, 10);
    
    if (recent.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No submissions yet. Fill out a survey to see data here!</p>';
    } else {
        listContainer.innerHTML = recent.map(item => `
            <div class="recent-item animate-fade-in">
                <div class="recent-item-info">
                    <div class="recent-item-title">${item.type} - ${item.employeeId}</div>
                    <div class="recent-item-meta">ID: ${item.id} • ${new Date(item.timestamp).toLocaleString()}</div>
                </div>
                <span class="recent-item-badge">${item.badge}</span>
            </div>
        `).join('');
    }
}

// Export Functions
async function exportDataAsJSON() {
    try {
        let data;
        
        if (USE_API_BACKEND) {
            const response = await fetch(`${API_URL}/all-data`);
            const apiData = await response.json();
            data = apiData.data;
        } else {
            data = getLocalData();
        }
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hr-analytics-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        alert('✅ Data exported as JSON successfully!');
    } catch (error) {
        alert('❌ Error exporting data: ' + error.message);
    }
}

async function exportDataAsCSV() {
    try {
        let data;
        
        if (USE_API_BACKEND) {
            const response = await fetch(`${API_URL}/all-data`);
            const apiData = await response.json();
            data = apiData.data;
        } else {
            data = getLocalData();
        }
        
        // Convert questionnaires to CSV
        let csv = 'Type,Employee ID,Timestamp,Environment,Job,Relationship,Work-Life Balance\n';
        
        data.questionnaires.forEach(q => {
            csv += `Survey,${q.employeeId},${q.saved_at || q.submissionDate},${q.environmentSatisfaction},${q.jobSatisfaction},${q.relationshipSatisfaction},${q.workLifeBalance}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hr-analytics-data-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        
        alert('✅ Data exported as CSV successfully!');
    } catch (error) {
        alert('❌ Error exporting data: ' + error.message);
    }
}

async function viewAllData() {
    try {
        let data;
        
        if (USE_API_BACKEND) {
            const response = await fetch(`${API_URL}/all-data`);
            const apiData = await response.json();
            data = apiData.data;
        } else {
            data = getLocalData();
        }
        
        const win = window.open('', '_blank');
        win.document.write(`
            <html>
            <head>
                <title>All HR Analytics Data</title>
                <style>
                    body { font-family: monospace; padding: 20px; background: #1e1e1e; color: #00ff00; }
                    pre { white-space: pre-wrap; word-wrap: break-word; }
                </style>
            </head>
            <body>
                <h1>📊 All HR Analytics Data</h1>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </body>
            </html>
        `);
    } catch (error) {
        alert('❌ Error viewing data: ' + error.message);
    }
}

async function clearAllData() {
    if (!confirm('⚠️ Are you sure you want to delete ALL data? This action cannot be undone!')) {
        return;
    }
    
    alert('ℹ️ This feature requires backend implementation. For now, manually delete data/*.json files.');
}

// Initialize Live Insights when tab is opened
document.addEventListener('DOMContentLoaded', function() {
    checkAPIStatus();
    initializeLiveCharts();
    
    // Refresh live insights every 30 seconds
    setInterval(() => {
        const liveTab = document.getElementById('data-insights');
        if (liveTab && liveTab.classList.contains('active')) {
            refreshLiveInsights();
        }
    }, 30000);
    
    // Also refresh when switching to Live Insights tab
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (this.getAttribute('data-tab') === 'data-insights') {
                setTimeout(refreshLiveInsights, 100);
            }
        });
    });
});

