// Main application entry point
import { initRouter } from './router.js';
import { login, logout, isAuthenticated, handleCallback, getAccessToken } from './auth.js';
import { getUserProfile } from './api.js';
import { initMenu } from './menu.js';
import { initPlayer, togglePlayPause, setupProgressBarHandler } from './player.js';

console.log('Globify app starting...');

// Update UI based on authentication state
function updateUIForAuth(authenticated) {
    const menu = document.getElementById('menu');
    const logoutBtn = document.getElementById('logout-btn');
    const playerBar = document.getElementById('player-bar');
    const footer = document.getElementById('footer');
    
    if (authenticated) {
        // Show authenticated UI
        menu.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (footer) footer.style.display = ''; // Reset to CSS default (will show on mobile via media query)
        
        console.log('✅ User is authenticated - UI updated');
    } else {
        // Show login UI
        menu.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (playerBar) playerBar.style.display = 'none';
        if (footer) footer.style.display = 'none'; // Hide menu button on mobile when not authenticated
        
        console.log('❌ User is not authenticated - showing login');
    }
}

// Update header with user information
function updateHeaderWithUser(userData) {
    const userNameElement = document.querySelector('.user-name');
    const userAvatarElement = document.querySelector('.user-avatar img');
    
    if (userData) {
        // Update with user data
        if (userNameElement && userData.display_name) {
            userNameElement.textContent = userData.display_name;
            console.log('✅ Username updated:', userData.display_name);
        }
        
        if (userAvatarElement && userData.images && userData.images.length > 0) {
            userAvatarElement.src = userData.images[0].url;
            userAvatarElement.alt = userData.display_name;
            userAvatarElement.style.display = 'block';
            console.log('✅ Avatar updated:', userData.images[0].url);
        }
    } else {
        // Reset to default
        if (userNameElement) {
            userNameElement.textContent = 'User';
            console.log('🔄 Username reset to default');
        }
        
        if (userAvatarElement) {
            userAvatarElement.style.display = 'none';
            console.log('🔄 Avatar hidden');
        }
    }
    
    console.log('✅ Header updated');
}

// Listen for logout events
window.addEventListener('userLoggedOut', () => {
    console.log('🔔 Logout event received - updating UI');
    updateUIForAuth(false);
    updateHeaderWithUser(null); // Reset header to default
});

// Listen for login events
window.addEventListener('userLoggedIn', async () => {
    console.log('🔔 Login event received - loading user data');
    try {
        const userData = await getUserProfile();
        updateHeaderWithUser(userData);
        updateUIForAuth(true);
        console.log('✅ User data loaded after login');
    } catch (error) {
        console.error('❌ Failed to load user data after login:', error);
    }
});

// Setup all DOM event listeners
function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Get DOM elements
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const playerPlayBtn = document.getElementById('player-play-btn');
    
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
    
    // Player play/pause button handler
    if (playerPlayBtn) {
        playerPlayBtn.addEventListener('click', async () => {
            console.log('🎵 Player play/pause button clicked');
            const accessToken = getAccessToken();
            if (accessToken) {
                await togglePlayPause(accessToken);
            }
        });
    }
    
    // Setup progress bar click handler
    const accessToken = getAccessToken();
    if (accessToken) {
        setupProgressBarHandler(accessToken);
    }
    
    console.log('✅ Event listeners setup complete');
}

// Initialize app
async function initApp() {
    console.log('🚀 Initializing Globify...');
    
    // Always setup event listeners, router and menu
    setupEventListeners();
    initRouter();
    initMenu();
    
    // Check for OAuth callback first (code in query params)
    if (window.location.search.includes('code=')) {
        console.log('📥 Processing OAuth callback...');
        const success = await handleCallback();
        if (success) {
            updateUIForAuth(true);
            
            // Load user data and initialize player after successful callback
            try {
                const userData = await getUserProfile();
                console.log('✅ User profile loaded:', userData.display_name);
                updateHeaderWithUser(userData);
                
                // Initialize player
                const accessToken = getAccessToken();
                if (accessToken) {
                    console.log('🎵 Initializing Spotify Player...');
                    try {
                        const result = await initPlayer(accessToken);
                        if (result?.error === 'premium_required') {
                            console.log('ℹ️ User is not Premium - playback disabled (browsing still works)');
                        } else {
                            console.log('✅ Player initialized successfully');
                        }
                    } catch (error) {
                        console.warn('⚠️ Player initialization failed:', error);
                        if (error.includes('premium') || error.includes('Premium')) {
                            console.log('ℹ️ User is not Premium - playback disabled (browsing still works)');
                        } else {
                            console.log('ℹ️ Player functionality may be limited');
                        }
                    }
                }
            } catch (error) {
                console.error('❌ Failed to load user data after callback:', error);
            }
        }
        console.log('✅ Globify initialized successfully!');
        return;
    }
    
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
        try {
            const userData = await getUserProfile();
            console.log('✅ User profile loaded:', userData.display_name);
            
            // Update header with user info
            updateHeaderWithUser(userData);
            
            // Initialize player
            const accessToken = getAccessToken();
            if (accessToken) {
                console.log('🎵 Initializing Spotify Player...');
                try {
                    const result = await initPlayer(accessToken);
                    if (result?.error === 'premium_required') {
                        console.log('ℹ️ User is not Premium - playback disabled (browsing still works)');
                    } else {
                        console.log('✅ Player initialized successfully');
                    }
                } catch (error) {
                    console.warn('⚠️ Player initialization failed:', error);
                    console.log('ℹ️ Player functionality may be limited');
                }
            }
        } catch (error) {
            console.error('❌ Failed to load user data:', error);
        }
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
