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
// Early Tab Navigation Setup (Backup)
// ==========================================
function initializeTabsEarly() {
    const links = document.querySelectorAll('.tab-link');
    if (links.length === 0) return;
    
    console.log('⚡ Early tab setup:', links.length, 'links found');
    links.forEach(link => {
        link.onclick = function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            console.log('⚡ Early click:', tab);
            
            document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const content = document.getElementById(tab);
            if (content) content.classList.add('active');
        };
    });
}

// This runs immediately when script loads as a backup
if (document.readyState === 'loading') {
    console.log('⏳ Document still loading, will wait for DOMContentLoaded');
} else {
    console.log('⚡ Document already loaded, initializing tabs immediately');
    setTimeout(initializeTabsEarly, 0);
}

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

function saveEmployeeToLocal(employeeData) {
    const employees = JSON.parse(localStorage.getItem('hr_employees') || '[]');
    employees.push(employeeData);
    localStorage.setItem('hr_employees', JSON.stringify(employees));
    console.log('✅ Employee saved to localStorage:', employeeData);
}

function updateEmployeeStatusInLocal(employeeId, status) {
    const employees = JSON.parse(localStorage.getItem('hr_employees') || '[]');
    const employee = employees.find(e => e.employeeId === employeeId);
    if (employee) {
        employee.status = status;
        employee.lastUpdated = new Date().toISOString();
        localStorage.setItem('hr_employees', JSON.stringify(employees));
        console.log('✅ Employee status updated in localStorage:', employeeId, status);
    }
}

function getLocalData() {
    return {
        questionnaires: JSON.parse(localStorage.getItem('hr_questionnaires') || '[]'),
        appraisals: JSON.parse(localStorage.getItem('hr_appraisals') || '[]'),
        employees: JSON.parse(localStorage.getItem('hr_employees') || '[]')
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
        console.log('⏳ Waiting for Chart.js to load...');
        console.log('Chart available:', typeof Chart !== 'undefined');
        
        if (typeof Chart !== 'undefined') {
            console.log('✅ Chart.js is ready!');
            resolve();
        } else {
            console.log('⚠️ Chart.js not loaded yet, waiting...');
            const checkInterval = setInterval(() => {
                if (typeof Chart !== 'undefined') {
                    console.log('✅ Chart.js loaded successfully!');
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 50);
        }
    });
}

// Tab Navigation - Initialize ASAP
function initializeTabs() {
    console.log('🔗 Initializing tab navigation...');
    
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log(`  Found ${tabLinks.length} tab links`);
    console.log(`  Found ${tabContents.length} tab contents`);

    if (tabLinks.length === 0) {
        console.error('❌ No tab links found!');
        return;
    }

    tabLinks.forEach((link, index) => {
        const tabName = link.getAttribute('data-tab');
        console.log(`  Tab ${index + 1}: ${tabName}`);
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetTab = this.getAttribute('data-tab');
            console.log(`🔄 Tab clicked: ${targetTab}`);

            // Remove active class from all tabs and links
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked link and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
                console.log(`✅ Tab activated: ${targetTab}`);
            } else {
                console.error(`❌ Tab content not found: ${targetTab}`);
            }
        }, true); // Use capture phase
    });
    
    console.log('✅ Tab navigation initialized');
}

// Initialize tabs immediately when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 DOM Content Loaded');
    
    // Initialize tabs FIRST - before anything else
    initializeTabs();
    
    // Wait for Chart.js to be ready
    await waitForChart();
    console.log('📊 Chart.js is ready');

    console.log('📊 Starting chart initialization...');
    // Initialize charts
    initializeCharts();

    // Load employees from localStorage
    loadEmployeesFromLocal();

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
    console.log('📊 Initializing charts...');
    console.log('  Chart.js available:', typeof Chart !== 'undefined');
    if (typeof Chart !== 'undefined') {
        console.log('  Chart.js version:', Chart.version);
    }
    
    // Chart 1: Attrition by Department
    const deptCtx = document.getElementById('attritionDeptChart');
    console.log('  🔍 Department chart canvas:', deptCtx ? 'FOUND' : 'NOT FOUND');
    
    if (deptCtx) {
        try {
            console.log('  📊 Creating department chart...');
            const deptChart = new Chart(deptCtx, {
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
            console.log('  ✅ Department chart created successfully');
        } catch (error) {
            console.error('  ❌ Error creating department chart:', error);
        }
    } else {
        console.warn('  ⚠️ Department chart canvas element not found');
    }

    // Chart 2: Attrition by Age Group
    const ageCtx = document.getElementById('attritionAgeChart');
    console.log('  🔍 Age chart canvas:', ageCtx ? 'FOUND' : 'NOT FOUND');
    
    if (ageCtx) {
        try {
            console.log('  📊 Creating age chart...');
            const ageChart = new Chart(ageCtx, {
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
        console.log('  ✅ Age chart created successfully');
        } catch (error) {
            console.error('  ❌ Error creating age chart:', error);
        }
    } else {
        console.warn('  ⚠️ Age chart canvas element not found');
    }

    // Chart 3: Overtime Impact
    const overtimeCtx = document.getElementById('overtimeChart');
    console.log('  🔍 Overtime chart canvas:', overtimeCtx ? 'FOUND' : 'NOT FOUND');
    if (overtimeCtx) {
        try {
            console.log('  📊 Creating overtime chart...');
            const overtimeChart = new Chart(overtimeCtx, {
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
        console.log('  ✅ Overtime chart created successfully');
        } catch (error) {
            console.error('  ❌ Error creating overtime chart:', error);
        }
    } else {
        console.warn('  ⚠️ Overtime chart canvas element not found');
    }

    // Chart 4: Work-Life Balance Distribution
    const wlbCtx = document.getElementById('workLifeBalanceChart');
    console.log('  🔍 Work-Life Balance chart canvas:', wlbCtx ? 'FOUND' : 'NOT FOUND');
    if (wlbCtx) {
        try {
            console.log('  📊 Creating work-life balance chart...');
            const wlbChart = new Chart(wlbCtx, {
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
        console.log('  ✅ Work-Life Balance chart created successfully');
        } catch (error) {
            console.error('  ❌ Error creating work-life balance chart:', error);
        }
    } else {
        console.warn('  ⚠️ Work-Life Balance chart canvas element not found');
    }
    
    console.log('✅ Chart initialization complete!');
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
            
            // Get form data - match BigQuery schema
            const formData = {
                employeeId: document.getElementById('appraisalEmployeeId').value,
                performanceRating: parseInt(document.getElementById('performanceRating').value),
                appraisalDate: new Date().toISOString()
                // Note: jobInvolvement and managerComments not in BigQuery schema yet
            };
            
            // Log to console
            console.log('Manager Appraisal Submitted:', formData);

            // Save to localStorage (works on GitHub Pages)
            saveAppraisalToLocal(formData);
            
            // Close form and update status immediately
            document.getElementById('appraisalSuccess').style.display = 'block';
            document.getElementById('appraisalFormSection').style.display = 'none';
            updateEmployeeStatus(formData.employeeId);
            
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
                        updateLiveInsightsCharts();
                    } else {
                        console.error('❌ Error saving appraisal:', data.error);
                    }
                })
                .catch(error => {
                    console.error('❌ Network error:', error);
                    console.log('⚠️ Appraisal saved locally but not synced to API');
                });
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
    console.log(`📝 Opening appraisal form for ${employeeName} (${employeeId})`);
    
    // Check if employee already has appraisal
    const localData = getLocalData();
    const hasAppraisal = localData.appraisals.some(a => a.employeeId === employeeId);
    
    if (hasAppraisal) {
        console.log(`⚠️ Appraisal already exists for ${employeeId}`);
        alert(`⚠️ Appraisal already submitted for ${employeeName}!\n\nThis employee's performance review has already been completed.\nUse the "View" button to see the appraisal details.`);
        return;
    }
    
    console.log(`✅ No existing appraisal found, opening form`);
    
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
    // Get all appraisals for this employee from localStorage
    const localData = getLocalData();
    const appraisals = localData.appraisals.filter(a => a.employeeId === employeeId);
    
    if (appraisals.length === 0) {
        alert('📋 No appraisal data found for this employee.');
        return;
    }
    
    // Show the most recent appraisal
    const latestAppraisal = appraisals[appraisals.length - 1];
    const date = new Date(latestAppraisal.appraisalDate).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    const rating = latestAppraisal.performanceRating;
    const ratingText = rating === 1 ? '⭐ Low' : 
                       rating === 2 ? '⭐⭐ Good' : 
                       rating === 3 ? '⭐⭐⭐ Excellent' : 
                       '⭐⭐⭐⭐ Outstanding';
    
    const message = `📋 Performance Appraisal\n\n` +
          `👤 Employee ID: ${employeeId}\n` +
          `📅 Appraisal Date: ${date}\n` +
          `⭐ Performance Rating: ${ratingText}\n\n` +
          `Total Appraisals on Record: ${appraisals.length}`;
    
    alert(message);
} +
              `⭐ Performance Rating: ${rating} - ${ratingText}\n\n` +
              `✅ Appraisal completed and saved to BigQuery`);
    } else {
        alert(`No appraisal found for employee ${employeeId}`);
    }
}

function updateEmployeeStatus(employeeId) {
    console.log(`🔄 Updating status for employee: ${employeeId}`);
    
    // Find employee card by data-employee-id attribute
    const employeeCard = document.querySelector(`.employee-card[data-employee-id="${employeeId}"]`);
    
    if (employeeCard) {
        console.log(`✅ Found employee card for ${employeeId}`);
        
        const statusBadge = employeeCard.querySelector('.status');
        const button = employeeCard.querySelector('.btn');
        
        if (statusBadge) {
            console.log(`🏷️ Updating status badge from "${statusBadge.textContent}" to "Completed"`);
            statusBadge.textContent = 'Completed';
            statusBadge.classList.remove('pending');
            statusBadge.classList.add('completed');
        }
        
        if (button) {
            console.log(`🔘 Updating button from "${button.textContent}" to "View"`);
            button.textContent = 'View';
            button.classList.remove('btn-primary');
            button.classList.remove('btn-small');
            button.classList.add('btn-view');
            button.classList.add('btn-small');
            button.setAttribute('onclick', `viewAppraisal('${employeeId}')`);
        }
        
        // Update status in localStorage
        updateEmployeeStatusInLocal(employeeId, 'completed');
        
        console.log(`✅ Updated employee status: ${employeeId} -> Completed`);
    } else {
        console.error(`❌ Employee card not found for ID: ${employeeId}`);
        console.log(`Available employee cards:`, document.querySelectorAll('.employee-card'));
    }
}

// ==========================================
// Add Employee Functions
// ==========================================
function toggleAddEmployeeForm() {
    const form = document.getElementById('addEmployeeForm');
    if (form.style.display === 'none') {
        form.style.display = 'block';
        // Clear form
        document.getElementById('newEmployeeName').value = '';
        document.getElementById('newEmployeeId').value = '';
        document.getElementById('newEmployeePosition').value = '';
    } else {
        form.style.display = 'none';
    }
}

function loadEmployeesFromLocal() {
    const localData = getLocalData();
    const employees = localData.employees || [];
    const appraisals = localData.appraisals || [];
    
    const employeeList = document.getElementById('employeeList');
    if (!employeeList) return;
    
    // Clear existing custom employees (keep default ones if needed)
    const customEmployees = employeeList.querySelectorAll('.employee-card[data-custom="true"]');
    customEmployees.forEach(card => card.remove());
    
    // Load employees from localStorage
    employees.forEach(emp => {
        // Check if employee already has appraisal
        const hasAppraisal = appraisals.some(a => a.employeeId === emp.employeeId);
        const status = hasAppraisal ? 'completed' : (emp.status || 'pending');
        
        const newCard = document.createElement('div');
        newCard.className = 'employee-card';
        newCard.setAttribute('data-employee-id', emp.employeeId);
        newCard.setAttribute('data-custom', 'true');
        
        const statusClass = status === 'completed' ? 'completed' : 'pending';
        const statusText = status === 'completed' ? 'Completed' : 'Appraisal Pending';
        const buttonClass = status === 'completed' ? 'btn-view' : 'btn-primary';
        const buttonText = status === 'completed' ? 'View' : 'Evaluate';
        const buttonAction = status === 'completed' ? 
            `viewAppraisal('${emp.employeeId}')` : 
            `openAppraisalForm('${emp.employeeId}', '${emp.name}')`;
        
        newCard.innerHTML = `
            <div class="employee-info">
                <h4>${emp.name}</h4>
                <p>${emp.position} | ID: ${emp.employeeId}</p>
                <span class="status ${statusClass}">${statusText}</span>
            </div>
            <button class="btn btn-small ${buttonClass}" onclick="${buttonAction}">
                ${buttonText}
            </button>
        `;
        
        employeeList.appendChild(newCard);
    });
    
    console.log(`✅ Loaded ${employees.length} employees from localStorage`);
}

function addNewEmployee() {
    const name = document.getElementById('newEmployeeName').value.trim();
    const employeeId = document.getElementById('newEmployeeId').value.trim();
    const position = document.getElementById('newEmployeePosition').value.trim();

    // Validation
    if (!name || !employeeId || !position) {
        alert('Please fill in all fields');
        return;
    }

    // Check if employee ID already exists
    const existingCards = document.querySelectorAll('.employee-card');
    for (let card of existingCards) {
        if (card.getAttribute('data-employee-id') === employeeId) {
            alert(`Employee ID ${employeeId} already exists!`);
            return;
        }
    }

    // Prepare data for API
    const employeeData = {
        employeeId: employeeId,
        name: name,
        position: position,
        department: 'General', // Default department
        status: 'pending', // Initial status
        dateAdded: new Date().toISOString()
    };

    // Save to localStorage
    saveEmployeeToLocal(employeeData);

    // Create new employee card
    const employeeList = document.getElementById('employeeList');
    const newCard = document.createElement('div');
    newCard.className = 'employee-card';
    newCard.setAttribute('data-employee-id', employeeId);
    newCard.innerHTML = `
        <div class="employee-info">
            <h4>${name}</h4>
            <p>${position} | ID: ${employeeId}</p>
            <span class="status pending">Appraisal Pending</span>
        </div>
        <button class="btn btn-small btn-primary" onclick="openAppraisalForm('${employeeId}', '${name}')">
            Evaluate
        </button>
    `;

    employeeList.appendChild(newCard);

    // Send to backend API if available
    if (USE_API_BACKEND) {
        fetch(`${API_URL}/employee`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(employeeData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('✅ Employee saved to database:', data);
            } else {
                console.error('❌ Error saving employee:', data.error);
            }
        })
        .catch(error => {
            console.error('❌ Network error:', error);
            console.log('⚠️ Employee added locally but not synced to API');
        });
    }

    // Hide form and show success message
    toggleAddEmployeeForm();
    
    // Scroll to new employee
    newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Highlight new card briefly
    newCard.style.animation = 'pulse 0.5s ease';
    
    console.log(`✅ Added new employee: ${name} (${employeeId})`);
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
    // Update Average Satisfaction KPI card (only on live insights tab, not static historical data)
    const liveKpiValue = document.querySelector('#data-insights .kpi-value');
    if (liveKpiValue && stats.avg_overall > 0) {
        liveKpiValue.textContent = `${stats.avg_overall}/4`;
        
        // Add animation
        liveKpiValue.style.animation = 'none';
        setTimeout(() => {
            liveKpiValue.style.animation = 'pulse 0.5s ease';
        }, 10);
        
        console.log(`📊 Updated Satisfaction KPI: ${stats.avg_overall}/4`);
    }
}

function updatePerformanceKPI(stats) {
    // Update Average Performance KPI card (only on live insights tab)
    const liveKpiValue = document.querySelector('#data-insights .kpi-card:nth-child(3) .kpi-value');
    if (liveKpiValue && stats.avg_performance > 0) {
        liveKpiValue.textContent = `${stats.avg_performance}/4`;
        
        // Add animation
        liveKpiValue.style.animation = 'none';
        setTimeout(() => {
            liveKpiValue.style.animation = 'pulse 0.5s ease';
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

// Load initial stats on page load - DISABLED for Overview (shows historical static data)
// Live data is loaded only when user navigates to Insights tab
document.addEventListener('DOMContentLoaded', function() {
    // Don't auto-load stats on page load to preserve static historical data in Overview
    console.log('✅ Page loaded - Overview shows historical data, Insights will load on demand');
    
    if (!USE_API_BACKEND) {
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
    // Animate KPI values only on Insights tab, not on Overview (which shows static historical data)
    const kpiValues = document.querySelectorAll('#data-insights .kpi-value');
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
            
            // Update trend chart with all historical data
            if (stats.total_responses > 0) {
                // Fetch all questionnaires to build trend
                const allDataResponse = await fetch(`${API_URL}/all-data`);
                const allData = await allDataResponse.json();
                
                if (allData.success && allData.data && allData.data.questionnaires) {
                    const questionnaires = allData.data.questionnaires;
                    
                    // Calculate average satisfaction for each submission
                    const trendPoints = questionnaires.map((q, index) => {
                        const avg = (
                            parseInt(q.environmentSatisfaction || 0) +
                            parseInt(q.jobSatisfaction || 0) +
                            parseInt(q.relationshipSatisfaction || 0) +
                            parseInt(q.workLifeBalance || 0)
                        ) / 4;
                        return avg;
                    });
                    
                    if (satisfactionTrendChart && trendPoints.length > 0) {
                        satisfactionTrendChart.data.labels = trendPoints.map((_, i) => `#${i + 1}`);
                        satisfactionTrendChart.data.datasets[0].data = trendPoints;
                        satisfactionTrendChart.update();
                        
                        document.getElementById('trendDataPoints').textContent = 
                            `${trendPoints.length} data points tracked`;
                        
                        console.log(`📈 Trend updated with ${trendPoints.length} data points`);
                    }
                }
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

