// Menu component - Handle navigation and active states

export function initMenu() {
    console.log('📱 Initializing menu...');
    
    const menuItems = document.querySelectorAll('.menu-item');
    const menu = document.getElementById('menu');
    const menuToggle = document.getElementById('menu-toggle');
    
    // Update active menu item based on current route
    function updateActiveMenuItem(route) {
        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            const routeName = href ? href.replace('#', '') : '';
            
            if (routeName === route || (route === '' && routeName === 'home')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // Listen for route changes
    window.addEventListener('routechange', (e) => {
        const route = e.detail?.route || window.location.hash.replace('#', '') || 'home';
        updateActiveMenuItem(route);
        
        // Close mobile menu after navigation
        if (window.innerWidth <= 1120 && menu) {
            menu.classList.remove('active');
        }
    });
    
    // Handle menu item clicks
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Let the router handle navigation
            // Just close mobile menu
            if (window.innerWidth <= 1120 && menu) {
                menu.classList.remove('active');
            }
        });
    });
    
    // Mobile menu toggle
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1120) {
                if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
                    menu.classList.remove('active');
                }
            }
        });
    }
    
    // Set initial active state
    const initialRoute = window.location.hash.replace('#', '') || 'home';
    updateActiveMenuItem(initialRoute);
    
    console.log('✅ Menu initialized');
}

// Get current user data
export function getCurrentUser() {
    const userData = localStorage.getItem('spotify_user_data');
    if (userData) {
        try {
            return JSON.parse(userData);
        } catch (error) {
            console.error('❌ Error parsing user data:', error);
            return null;
        }
    }
    return null;
}

// Render user count in menu (optional - for future use)
export function updateMenuCounts(counts) {
    // counts = { favorites: 0, playlists: 0 }
    // This can be used to show counts next to menu items
    if (counts.favorites !== undefined) {
        const favoritesItem = document.querySelector('a[href="#favorites"]');
        if (favoritesItem) {
            const countSpan = favoritesItem.querySelector('.menu-count') || document.createElement('span');
            countSpan.className = 'menu-count';
            countSpan.textContent = counts.favorites;
            if (!favoritesItem.querySelector('.menu-count')) {
                favoritesItem.appendChild(countSpan);
            }
        }
    }
    
    if (counts.playlists !== undefined) {
        const playlistsItem = document.querySelector('a[href="#playlists"]');
        if (playlistsItem) {
            const countSpan = playlistsItem.querySelector('.menu-count') || document.createElement('span');
            countSpan.className = 'menu-count';
            countSpan.textContent = counts.playlists;
            if (!playlistsItem.querySelector('.menu-count')) {
                playlistsItem.appendChild(countSpan);
            }
        }
    }
}
