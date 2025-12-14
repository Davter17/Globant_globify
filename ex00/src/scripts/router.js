// Simple hash-based router

// Available routes
const routes = {
    'home': 'home-view',
    'favorites': 'favorites-view',
    'playlists': 'playlists-view',
    'playlist': 'playlist-detail-view',
    'search': 'search-view',
    'profile': 'profile-view',
    'login': 'login-view'
};

// Current route
let currentRoute = null;

// Navigate to a route
export function navigateTo(route, params = {}) {
    console.log(`Navigating to: ${route}`, params);
    
    // Hide all views
    Object.values(routes).forEach(viewId => {
        const view = document.getElementById(viewId);
        if (view) view.style.display = 'none';
    });
    
    // Show the requested view
    const viewId = routes[route];
    const view = document.getElementById(viewId);
    
    if (view) {
        view.style.display = 'block';
        currentRoute = { route, params };
        
        // Update hash
        if (params.id) {
            window.location.hash = `#${route}/${params.id}`;
        } else {
            window.location.hash = `#${route}`;
        }
        
        // Trigger route change event
        window.dispatchEvent(new CustomEvent('routechange', { 
            detail: { route, params } 
        }));
    } else {
        console.error(`Route not found: ${route}`);
        navigateTo('home');
    }
}

// Get current route
export function getCurrentRoute() {
    return currentRoute;
}

// Parse hash from URL
function parseHash() {
    const hash = window.location.hash.slice(1); // Remove #
    const [route, id] = hash.split('/');
    return { route: route || 'login', id };
}

// Initialize router
export function initRouter() {
    // Handle hash changes
    window.addEventListener('hashchange', () => {
        const { route, id } = parseHash();
        navigateTo(route, id ? { id } : {});
    });
    
    // Handle menu clicks
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const href = item.getAttribute('href');
            const route = href.slice(1); // Remove #
            navigateTo(route);
        });
    });
    
    // Load initial route
    const { route, id } = parseHash();
    navigateTo(route, id ? { id } : {});
    
    console.log('✅ Router initialized');
}

// Update active menu item
window.addEventListener('routechange', (e) => {
    const { route } = e.detail;
    
    document.querySelectorAll('.menu-item').forEach(item => {
        const href = item.getAttribute('href').slice(1);
        if (href === route) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
});
