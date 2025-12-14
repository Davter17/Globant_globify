// Main application entry point
import { initRouter } from './router.js';
import { STORAGE_KEYS } from './config.js';

console.log('Globify app starting...');

// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
const menuItems = document.querySelectorAll('.menu-item');

// Mobile menu toggle
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
}

// Close menu when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 430) {
        if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
            menu.classList.remove('active');
        }
    }
});

// Close menu on mobile after route change
window.addEventListener('routechange', () => {
    if (window.innerWidth <= 430) {
        menu.classList.remove('active');
    }
});

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    
    if (token && expiry && Date.now() < expiry) {
        console.log('✅ User is authenticated');
        return true;
    }
    
    console.log('❌ User is not authenticated');
    return false;
}

// Initialize app
function initApp() {
    console.log('🚀 Initializing Globify...');
    
    // Initialize router
    initRouter();
    
    // Check authentication
    const isAuthenticated = checkAuth();
    
    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        window.location.hash = '#login';
    }
    
    console.log('✅ Globify initialized successfully!');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
