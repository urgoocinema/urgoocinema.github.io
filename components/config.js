// API Configuration
// Switch between development and production URLs

const config = {
    development: {
        API_BASE_URL: 'http://localhost:3001/api'
    },
    production: {
        API_BASE_URL: 'https://your-production-domain.com/api' // Change this to your production URL
    }
};

// Simple browser-based environment detection
// You can manually change this to 'production' when deploying
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('localhost');

const environment = isDevelopment ? 'development' : 'production';
export const API_BASE_URL = config[environment].API_BASE_URL;

// Export for manual override if needed
export { config };
