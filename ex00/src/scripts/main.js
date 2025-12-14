// Main application entry point
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

// Menu navigation
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        // Remove active class from all items
        menuItems.forEach(i => i.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
        
        // Close menu on mobile after selection
        if (window.innerWidth <= 430) {
            menu.classList.remove('active');
        }
    });
});

// Close menu when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 430) {
        if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
            menu.classList.remove('active');
        }
    }
});

// Temporary: Log when page loads
console.log('✅ Globify loaded successfully!');
console.log('🎵 Ready to implement authentication...');
