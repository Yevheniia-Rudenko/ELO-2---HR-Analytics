// ==========================================
// API Configuration
// ==========================================

// Cloud Run API URL (will be set after deployment)
// Format: https://hr-analytics-api-[hash]-uc.a.run.app
const CLOUD_RUN_API_URL = 'https://hr-analytics-api-645256012006.us-central1.run.app/api';

// Auto-detect environment and set API configuration
function getAPIConfig() {
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // Local development - check for localhost AND development ports
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && 
        (port === '8888' || port === '5500' || port === '3000')) {
        return {
            apiUrl: 'http://localhost:8080/api',
            useAPI: true,
            environment: 'local'
        };
    }
    
    // GitHub Pages - use Cloud Run API
    return {
        apiUrl: CLOUD_RUN_API_URL,
        useAPI: true,
        environment: 'production'
    };
}

// Note: API_URL and USE_API_BACKEND are initialized in app.js
// This file only provides the getAPIConfig() function
