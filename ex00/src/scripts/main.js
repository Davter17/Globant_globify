// Main application entry point
import { initRouter } from './router.js';
import { login, logout, isAuthenticated, handleCallback } from './auth.js';

console.log('Globify app starting...');

// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

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

// Login button handler
if (loginBtn) {
    console.log('✅ Login button found, attaching event listener');
    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('🔐 Login button clicked!');
        await login();
    });
} else {
    console.error('❌ Login button NOT found in DOM!');
}

// Logout button handler
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        console.log('Logout button clicked');
        logout();
    });
}

// Update UI based on authentication state
function updateUIForAuth(authenticated) {
    const menu = document.getElementById('menu');
    const logoutBtn = document.getElementById('logout-btn');
    const playerBar = document.getElementById('player-bar');
    
    if (authenticated) {
        // Show authenticated UI
        menu.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'block';
        
        console.log('✅ User is authenticated - UI updated');
    } else {
        // Show login UI
        menu.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (playerBar) playerBar.style.display = 'none';
        
        console.log('❌ User is not authenticated - showing login');
    }
}

// Initialize app
async function initApp() {
    console.log('🚀 Initializing Globify...');
    
    // Check for OAuth callback first (code in query params)
    if (window.location.search.includes('code=')) {
        console.log('📥 Processing OAuth callback...');
        const success = await handleCallback();
        if (success) {
            updateUIForAuth(true);
        }
        return;
    }
    
    // Initialize router
    initRouter();
    
    // Check authentication and update UI
    const authenticated = isAuthenticated();
    updateUIForAuth(authenticated);
    
    if (!authenticated) {
        // Redirect to login if not authenticated
        console.log('Redirecting to login view...');
        window.location.hash = '#login';
    } else {
        // Load user data
        console.log('👤 Loading user data...');
        // This will be implemented in Phase 6
    }
    
    console.log('✅ Globify initialized successfully!');
}

// Wait for DOM to be ready
console.log('📄 Document ready state:', document.readyState);
if (document.readyState === 'loading') {
    console.log('⏳ Waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    console.log('✅ DOM already loaded, initializing immediately');
    initApp();
}
