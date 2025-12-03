// ==========================================
// API Configuration
// ==========================================

// Cloud Run API URL (will be set after deployment)
// Format: https://hr-analytics-api-[hash]-uc.a.run.app
const CLOUD_RUN_API_URL = 'https://hr-analytics-api-645256012006.us-central1.run.app/api';

// Auto-detect environment and set API configuration
function getAPIConfig() {
    const hostname = window.location.hostname;
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return {
            apiUrl: 'http://localhost:8080/api',
            useAPI: true,
            environment: 'local'
        };
    }
    
    // GitHub Pages - use Cloud Run API
    if (hostname.includes('github.io')) {
        return {
            apiUrl: CLOUD_RUN_API_URL,
            useAPI: true,
            environment: 'production'
        };
    }
    
    // Fallback to Cloud Run
    return {
        apiUrl: CLOUD_RUN_API_URL,
        useAPI: true,
        environment: 'production'
    };
}

// Export configuration
const API_CONFIG = getAPIConfig();
const API_URL = API_CONFIG.apiUrl;
const USE_API_BACKEND = API_CONFIG.useAPI;

console.log(`🔧 Environment: ${API_CONFIG.environment}`);
console.log(`🌐 API URL: ${API_URL}`);
console.log(`✅ API Backend: ${USE_API_BACKEND ? 'Enabled' : 'Disabled'}`);
