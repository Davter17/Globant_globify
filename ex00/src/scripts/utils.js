// Utility functions for DOM manipulation and helpers

// Create an element with attributes and children
export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else if (key.startsWith('on')) {
            const event = key.slice(2).toLowerCase();
            element.addEventListener(event, value);
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Add children
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    });
    
    return element;
}

// Show loading state
export function showLoading(container = null) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'flex';
    }
    
    if (container) {
        container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading...</p></div>';
    }
}

// Hide loading state
export function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

// Show error message
export function showError(message, container = null) {
    console.error('Error:', message);
    
    const errorHTML = `
        <div class="error-message" style="
            padding: 20px;
            background: rgba(255, 0, 110, 0.1);
            border: 1px solid var(--accent-color);
            border-radius: 8px;
            text-align: center;
            color: var(--accent-color);
        ">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
    
    if (container) {
        container.innerHTML = errorHTML;
    } else {
        // Show in main content
        const mainContent = document.querySelector('.view-container');
        if (mainContent) {
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = errorHTML;
            mainContent.prepend(errorDiv.firstElementChild);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        }
    }
}

// Format duration from ms to mm:ss
export function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Truncate text with ellipsis
export function truncateText(text, maxLength = 50) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Debounce function for search inputs
export function debounce(func, delay = 300) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Get placeholder image if none exists
export function getImageUrl(images, defaultSize = 'medium') {
    if (!images || images.length === 0) {
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23282828" width="300" height="300"/%3E%3Ctext fill="%23b3b3b3" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="48"%3E🎵%3C/text%3E%3C/svg%3E';
    }
    
    // Return best quality image
    if (images.length === 1) return images[0].url;
    
    // Try to get medium size (640x640)
    const medium = images.find(img => img.width === 640 || img.height === 640);
    if (medium) return medium.url;
    
    // Return largest
    return images[0].url;
}

// Empty state message
export function showEmptyState(container, message, icon = '🎵') {
    container.innerHTML = `
        <div style="
            text-align: center;
            padding: 60px 20px;
            color: var(--text-secondary);
        ">
            <div style="font-size: 64px; margin-bottom: 16px;">${icon}</div>
            <p style="font-size: 18px;">${message}</p>
        </div>
    `;
}

// Sanitize HTML to prevent XSS
export function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Check if token is expired
export function isTokenExpired(expiryTime) {
    if (!expiryTime) return true;
    return Date.now() >= expiryTime;
}

console.log('✅ Utilities loaded');
