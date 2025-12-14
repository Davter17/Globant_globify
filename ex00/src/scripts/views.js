// Views - Render content for each view

import { 
    getCategories, 
    getCategoryPlaylists,
    getFeaturedPlaylists,
    getSavedTracks,
    getUserPlaylists,
    getPlaylist,
    searchTracks,
    searchPlaylists
} from './api.js';
import { formatDuration, getArtistNames } from './api.js';

// ===== HOME VIEW =====

// Predefined categories (fallback when Spotify Browse API is not available)
const PREDEFINED_CATEGORIES = [
    { id: 'pop', name: 'Pop', icon: '🎤', query: 'pop hits' },
    { id: 'rock', name: 'Rock', icon: '🎸', query: 'rock classics' },
    { id: 'hiphop', name: 'Hip Hop', icon: '🎧', query: 'hip hop' },
    { id: 'electronic', name: 'Electronic', icon: '🎹', query: 'electronic dance' },
    { id: 'jazz', name: 'Jazz', icon: '🎺', query: 'jazz' },
    { id: 'classical', name: 'Classical', icon: '🎻', query: 'classical music' },
    { id: 'latin', name: 'Latin', icon: '💃', query: 'latin music' },
    { id: 'indie', name: 'Indie', icon: '🎼', query: 'indie alternative' },
    { id: 'metal', name: 'Metal', icon: '🤘', query: 'heavy metal' },
    { id: 'country', name: 'Country', icon: '🤠', query: 'country music' },
    { id: 'rnb', name: 'R&B', icon: '✨', query: 'r&b soul' },
    { id: 'reggae', name: 'Reggae', icon: '🌴', query: 'reggae' }
];

let currentCategoryId = null;
let currentCategoryName = null;

export async function renderHomeView() {
    console.log('🏠 Rendering Home view...');
    
    const categoriesContainer = document.getElementById('categories-container');
    const playlistsContainer = document.getElementById('playlists-container');
    const viewTitle = document.querySelector('#home-view .view-title');
    
    // Reset view
    playlistsContainer.style.display = 'none';
    categoriesContainer.style.display = 'grid';
    viewTitle.textContent = 'Browse Categories';
    
    // Show predefined categories (no loading needed)
    const categories = PREDEFINED_CATEGORIES;
    
    console.log(`✅ Showing ${categories.length} music categories`);
    
    // Render categories with emoji icons
    categoriesContainer.innerHTML = categories.map((category, index) => {
        const isHighlighted = index < 3; // First 3 are highlighted on desktop
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
            'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
            'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)',
            'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
            'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
        ];
        const gradient = gradients[index % gradients.length];
        
        return `
            <div class="category-card ${isHighlighted ? 'highlight' : ''}" data-category-id="${category.id}" data-category-query="${category.query}">
                <div class="category-image" style="display: flex; align-items: center; justify-content: center; font-size: 48px; background: ${gradient};">
                    ${category.icon}
                </div>
                <h3 class="category-name">${category.name}</h3>
            </div>
        `;
    }).join('');
    
    // Add click handlers
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', async () => {
            const categoryName = card.querySelector('.category-name').textContent;
            const categoryQuery = card.dataset.categoryQuery;
            console.log(`🎯 User clicked on category: "${categoryName}" (query: ${categoryQuery})`);
            await showCategoryPlaylistsBySearch(categoryQuery, categoryName);
        });
    });
}

// Show playlists for a category using search
async function showCategoryPlaylistsBySearch(query, categoryName) {
    console.log(`📋 Searching playlists for: ${categoryName} (query: "${query}")`);
    
    const categoriesContainer = document.getElementById('categories-container');
    const playlistsContainer = document.getElementById('playlists-container');
    const viewTitle = document.querySelector('#home-view .view-title');
    
    // Hide categories, show playlists
    categoriesContainer.style.display = 'none';
    playlistsContainer.style.display = 'grid';
    
    // Update title with back button
    viewTitle.innerHTML = `
        <button class="btn-back" id="back-to-categories">←</button>
        <span>${categoryName}</span>
    `;
    
    // Add back button handler
    document.getElementById('back-to-categories')?.addEventListener('click', renderHomeView);
    
    // Show loading
    playlistsContainer.innerHTML = '<div class="loading">Loading playlists...</div>';
    
    try {
        const data = await searchPlaylists(query, 50);
        // Filter out null/invalid playlists
        const playlists = data.playlists.items.filter(playlist => 
            playlist && playlist.id && playlist.name && playlist.images && playlist.images.length > 0
        );
        
        console.log(`✅ Found ${playlists.length} valid playlists for "${categoryName}"`);
        
        if (playlists.length === 0) {
            playlistsContainer.innerHTML = `
                <div class="empty-state">
                    <p>😕 No playlists found for "${categoryName}"</p>
                    <button class="btn-primary" id="back-from-empty">← Back to Categories</button>
                </div>
            `;
            document.getElementById('back-from-empty')?.addEventListener('click', renderHomeView);
            return;
        }
        
        // Render playlists
        playlistsContainer.innerHTML = playlists.map(playlist => `
            <div class="playlist-card" data-playlist-id="${playlist.id}">
                <div class="playlist-image">
                    <img src="${playlist.images[0].url}" alt="${playlist.name}">
                    <div class="playlist-overlay">
                        <button class="btn-play">▶</button>
                    </div>
                </div>
                <h3 class="playlist-name">${playlist.name}</h3>
                <p class="playlist-description">${playlist.description || ''}</p>
                <p class="playlist-tracks">${playlist.tracks?.total || 0} tracks</p>
            </div>
        `).join('');
        
        // Add click handlers
        const playlistCards = document.querySelectorAll('.playlist-card');
        playlistCards.forEach(card => {
            card.addEventListener('click', () => {
                const playlistId = card.dataset.playlistId;
                window.location.hash = `#playlist/${playlistId}`;
            });
        });
        
    } catch (error) {
        console.error('❌ Error searching playlists:', error);
        playlistsContainer.innerHTML = `
            <div class="error-message">
                <p>❌ Failed to load playlists</p>
                <p>${error.message}</p>
                <button class="btn-primary" id="back-from-error">← Back to Categories</button>
            </div>
        `;
        document.getElementById('back-from-error')?.addEventListener('click', renderHomeView);
    }
}

async function showCategoryPlaylists(categoryId, categoryName) {
    console.log(`📋 Loading playlists for category: ${categoryName}`);
    
    currentCategoryId = categoryId;
    currentCategoryName = categoryName;
    
    const categoriesContainer = document.getElementById('categories-container');
    const playlistsContainer = document.getElementById('playlists-container');
    const viewTitle = document.querySelector('#home-view .view-title');
    
    // Hide categories, show playlists
    categoriesContainer.style.display = 'none';
    playlistsContainer.style.display = 'block';
    
    // Update title
    viewTitle.textContent = categoryName;
    
    // Show loading
    playlistsContainer.innerHTML = '<div class="loading">Loading playlists...</div>';
    
    try {
        console.log(`🔍 Fetching playlists for category: ${categoryId}`);
        const data = await getCategoryPlaylists(categoryId, 50);
        
        if (!data.playlists || !data.playlists.items || data.playlists.items.length === 0) {
            console.warn('⚠️ No playlists data returned or empty');
            playlistsContainer.innerHTML = `
                <div class="empty-state">
                    <p>😕 This category has no playlists available</p>
                    <p>This might be due to regional restrictions or the category being unavailable.</p>
                    <p style="font-size: 13px; margin-top: 10px;">Try selecting a different category.</p>
                    <button class="btn-primary" id="back-from-empty">← Back to Categories</button>
                </div>
            `;
            document.getElementById('back-from-empty')?.addEventListener('click', renderHomeView);
            return;
        }
        
        const playlists = data.playlists.items;
        
        console.log(`✅ Loaded ${playlists.length} playlists`);
        
        if (playlists.length === 0) {
            playlistsContainer.innerHTML = `
                <div class="empty-state">
                    <p>😕 No playlists found for "${categoryName}"</p>
                    <p>This category might not be available in your region</p>
                    <button class="btn-primary" id="back-from-empty">← Back to Categories</button>
                </div>
            `;
            document.getElementById('back-from-empty')?.addEventListener('click', renderHomeView);
            return;
        }
        
        // Render playlists
        playlistsContainer.innerHTML = playlists.map(playlist => `
            <div class="playlist-card" data-playlist-id="${playlist.id}">
                <div class="playlist-image">
                    <img src="${playlist.images[0]?.url || ''}" alt="${playlist.name}">
                    <div class="playlist-overlay">
                        <button class="btn-play">▶</button>
                    </div>
                </div>
                <h3 class="playlist-name">${playlist.name}</h3>
                <p class="playlist-description">${playlist.description || ''}</p>
                <p class="playlist-tracks">${playlist.tracks.total} tracks</p>
            </div>
        `).join('');
        
        // Add click handlers
        const playlistCards = document.querySelectorAll('.playlist-card');
        playlistCards.forEach(card => {
            card.addEventListener('click', () => {
                const playlistId = card.dataset.playlistId;
                window.location.hash = `#playlist/${playlistId}`;
            });
        });
        
    } catch (error) {
        console.error('❌ Error loading playlists:', error);
        console.error('Category ID:', categoryId);
        console.error('Error details:', error.message);
        
        // If category not available (404), fallback to featured playlists
        if (error.message === 'Not Found') {
            console.warn(`⚠️ Category "${categoryName}" not available, showing featured playlists as fallback`);
            
            playlistsContainer.innerHTML = `
                <div class="loading">
                    <p>Category not available in your region</p>
                    <p>Loading featured playlists instead...</p>
                </div>
            `;
            
            // Wait a moment so user sees the message
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Show featured playlists
            await showFeaturedPlaylists();
            return;
        }
        
        // Other errors
        playlistsContainer.innerHTML = `
            <div class="error-message">
                <p>❌ Failed to load playlists</p>
                <p>${error.message}</p>
                <button class="btn-primary" id="back-from-error" style="margin-top: 15px;">← Back to Categories</button>
            </div>
        `;
        
        document.getElementById('back-from-error')?.addEventListener('click', renderHomeView);
    }
}

// Show Featured Playlists (fallback when categories are not available)
async function showFeaturedPlaylists() {
    console.log('🌟 Loading featured playlists...');
    
    const categoriesContainer = document.getElementById('categories-container');
    const playlistsContainer = document.getElementById('playlists-container');
    const viewTitle = document.querySelector('#home-view .view-title');
    
    // Hide categories, show playlists
    categoriesContainer.style.display = 'none';
    playlistsContainer.style.display = 'block';
    
    // Update title
    viewTitle.textContent = 'Featured Playlists';
    
    // Show loading
    playlistsContainer.innerHTML = '<div class="loading">Loading playlists...</div>';
    
    try {
        const data = await getFeaturedPlaylists(50);
        const playlists = data.playlists.items;
        
        console.log(`✅ Loaded ${playlists.length} featured playlists`);
        
        if (playlists.length === 0) {
            playlistsContainer.innerHTML = `
                <div class="empty-state">
                    <p>😕 No playlists available</p>
                    <p>Please try again later</p>
                </div>
            `;
            return;
        }
        
        // Render playlists
        playlistsContainer.innerHTML = playlists.map(playlist => `
            <div class="playlist-card" data-playlist-id="${playlist.id}">
                <div class="playlist-image">
                    <img src="${playlist.images[0]?.url || ''}" alt="${playlist.name}">
                    <div class="playlist-overlay">
                        <button class="btn-play">▶</button>
                    </div>
                </div>
                <h3 class="playlist-name">${playlist.name}</h3>
                <p class="playlist-description">${playlist.description || ''}</p>
                <p class="playlist-tracks">${playlist.tracks.total} tracks</p>
            </div>
        `).join('');
        
        // Add click handlers
        const playlistCards = document.querySelectorAll('.playlist-card');
        playlistCards.forEach(card => {
            card.addEventListener('click', () => {
                const playlistId = card.dataset.playlistId;
                window.location.hash = `#playlist/${playlistId}`;
            });
        });
        
    } catch (error) {
        console.error('❌ Error loading featured playlists:', error);
        playlistsContainer.innerHTML = `
            <div class="error-message">
                <p>❌ Failed to load playlists</p>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// ===== FAVORITES VIEW =====

export async function renderFavoritesView() {
    console.log('❤️ Rendering Favorites view...');
    
    const container = document.getElementById('favorites-list');
    if (!container) return;
    
    // Show loading
    container.innerHTML = '<div class="loading">Loading your favorites...</div>';
    
    try {
        const data = await getSavedTracks(50);
        const tracks = data.items;
        
        console.log(`✅ Loaded ${tracks.length} favorite tracks`);
        
        if (tracks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>💔 No favorite tracks yet</p>
                    <p>Start liking songs on Spotify!</p>
                </div>
            `;
            return;
        }
        
        // Render tracks with header
        container.innerHTML = `
            <div class="tracks-header">
                <div class="track-header-number">#</div>
                <div class="track-header-title">Title</div>
                <div class="track-header-album">Album</div>
                <div class="track-header-duration">⏱</div>
            </div>
            ${tracks.map((item, index) => {
                const track = item.track;
                return `
                    <div class="track-item" data-track-uri="${track.uri}">
                        <div class="track-number">${index + 1}</div>
                        <div class="track-image">
                            <img src="${track.album.images[2]?.url || track.album.images[0]?.url || ''}" alt="${track.name}">
                        </div>
                        <div class="track-info">
                            <div class="track-name">${track.name}</div>
                            <div class="track-artist">${getArtistNames(track)}</div>
                        </div>
                        <div class="track-album">${track.album.name}</div>
                        <div class="track-duration">${formatDuration(track.duration_ms)}</div>
                    </div>
                `;
            }).join('')}
        `;
        
        // Add click handlers
        const trackItems = document.querySelectorAll('#favorites-list .track-item');
        trackItems.forEach(item => {
            item.addEventListener('click', () => {
                const uri = item.dataset.trackUri;
                console.log('🎵 Play track from favorites:', uri);
                alert('Play functionality will be implemented in Phase 14 (Player Controls)');
            });
        });
        
    } catch (error) {
        console.error('❌ Error loading favorites:', error);
        container.innerHTML = `
            <div class="error-message">
                <p>❌ Failed to load favorites</p>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// ===== PLAYLISTS VIEW =====

export async function renderPlaylistsView() {
    console.log('📚 Rendering Playlists view...');
    
    const container = document.getElementById('user-playlists-container');
    if (!container) return;
    
    // Show loading
    container.innerHTML = '<div class="loading">Loading your playlists...</div>';
    
    try {
        const data = await getUserPlaylists(50);
        const playlists = data.items;
        
        console.log(`✅ Loaded ${playlists.length} playlists`);
        
        if (playlists.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>📋 No playlists yet</p>
                    <p>Create playlists on Spotify!</p>
                </div>
            `;
            return;
        }
        
        // Render playlists
        container.innerHTML = playlists.map(playlist => `
            <div class="playlist-card" data-playlist-id="${playlist.id}">
                <div class="playlist-image">
                    <img src="${playlist.images[0]?.url || ''}" alt="${playlist.name}">
                    <div class="playlist-overlay">
                        <button class="btn-play">▶</button>
                    </div>
                </div>
                <h3 class="playlist-name">${playlist.name}</h3>
                <p class="playlist-description">${playlist.description || ''}</p>
                <p class="playlist-tracks">${playlist.tracks.total} tracks</p>
            </div>
        `).join('');
        
        // Add click handlers
        const playlistCards = document.querySelectorAll('.playlist-card');
        playlistCards.forEach(card => {
            card.addEventListener('click', () => {
                const playlistId = card.dataset.playlistId;
                window.location.hash = `#playlist/${playlistId}`;
            });
        });
        
    } catch (error) {
        console.error('❌ Error loading playlists:', error);
        container.innerHTML = `
            <div class="error-message">
                <p>❌ Failed to load playlists</p>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// ===== PLAYLIST DETAIL VIEW =====

export async function renderPlaylistDetailView(params) {
    console.log('📋 Rendering Playlist Detail view...');
    
    const playlistId = params?.id;
    
    if (!playlistId) {
        console.error('❌ No playlist ID provided');
        window.location.hash = '#playlists';
        return;
    }
    
    const heroContainer = document.getElementById('playlist-hero');
    const tracksContainer = document.getElementById('playlist-tracks');
    
    if (!heroContainer || !tracksContainer) {
        console.error('❌ Playlist detail containers not found');
        return;
    }
    
    // Show loading
    heroContainer.innerHTML = '<div class="loading">Loading playlist...</div>';
    tracksContainer.innerHTML = '';
    
    try {
        console.log(`🔍 Fetching playlist: ${playlistId}`);
        const playlist = await getPlaylist(playlistId);
        
        console.log(`✅ Loaded playlist: ${playlist.name}`);
        
        // Render hero section
        heroContainer.innerHTML = `
            <button class="btn-back" id="back-to-playlists">← Back</button>
            <div class="playlist-hero-content">
                <div class="playlist-hero-image">
                    <img src="${playlist.images[0]?.url || ''}" alt="${playlist.name}">
                </div>
                <div class="playlist-hero-info">
                    <p class="playlist-type">Playlist</p>
                    <h1 class="playlist-hero-title">${playlist.name}</h1>
                    <p class="playlist-hero-description">${playlist.description || 'No description'}</p>
                    <div class="playlist-hero-meta">
                        <span>${playlist.owner.display_name}</span>
                        <span>•</span>
                        <span>${playlist.tracks.total} songs</span>
                        ${playlist.followers?.total ? `<span>•</span><span>${playlist.followers.total.toLocaleString()} likes</span>` : ''}
                    </div>
                    <button class="btn-primary btn-play-all" id="play-all-btn">
                        ▶ Play All
                    </button>
                </div>
            </div>
        `;
        
        // Add back button handler
        document.getElementById('back-to-playlists')?.addEventListener('click', () => {
            window.history.back();
        });
        
        // Add play all handler (will be implemented in Phase 14)
        document.getElementById('play-all-btn')?.addEventListener('click', () => {
            console.log('🎵 Play all tracks from playlist:', playlistId);
            alert('Play functionality will be implemented in Phase 14 (Player Controls)');
        });
        
        // Load tracks
        const tracks = playlist.tracks.items;
        
        if (tracks.length === 0) {
            tracksContainer.innerHTML = `
                <div class="empty-state">
                    <p>📋 This playlist is empty</p>
                </div>
            `;
            return;
        }
        
        // Render tracks
        tracksContainer.innerHTML = `
            <div class="tracks-header">
                <div class="track-header-number">#</div>
                <div class="track-header-title">Title</div>
                <div class="track-header-album">Album</div>
                <div class="track-header-duration">⏱</div>
            </div>
            ${tracks.map((item, index) => {
                const track = item.track;
                if (!track) return ''; // Skip if track is null
                
                return `
                    <div class="track-item" data-track-uri="${track.uri}" data-track-index="${index}">
                        <div class="track-number">${index + 1}</div>
                        <div class="track-image">
                            <img src="${track.album.images[2]?.url || track.album.images[0]?.url || ''}" alt="${track.name}">
                        </div>
                        <div class="track-info">
                            <div class="track-name">${track.name}</div>
                            <div class="track-artist">${getArtistNames(track)}</div>
                        </div>
                        <div class="track-album">${track.album.name}</div>
                        <div class="track-duration">${formatDuration(track.duration_ms)}</div>
                    </div>
                `;
            }).join('')}
        `;
        
        // Add click handlers
        const trackItems = document.querySelectorAll('.track-item');
        trackItems.forEach(item => {
            item.addEventListener('click', () => {
                const uri = item.dataset.trackUri;
                const index = item.dataset.trackIndex;
                console.log('🎵 Play track:', uri, 'at position:', index);
                alert('Play functionality will be implemented in Phase 14 (Player Controls)');
            });
        });
        
    } catch (error) {
        console.error('❌ Error loading playlist:', error);
        heroContainer.innerHTML = `
            <div class="error-message">
                <p>❌ Failed to load playlist</p>
                <p>${error.message}</p>
                <button class="btn-primary" id="back-from-error">← Back</button>
            </div>
        `;
        tracksContainer.innerHTML = '';
        
        document.getElementById('back-from-error')?.addEventListener('click', () => {
            window.history.back();
        });
    }
}

// ===== PROFILE VIEW =====

export function renderProfileView() {
    console.log('👤 Rendering Profile view...');
    
    const container = document.getElementById('profile-details');
    if (!container) return;
    
    // Get user data from localStorage
    const userData = localStorage.getItem('spotify_user_data');
    
    if (!userData) {
        container.innerHTML = `
            <div class="error-message">
                <p>❌ No user data available</p>
            </div>
        `;
        return;
    }
    
    try {
        const user = JSON.parse(userData);
        
        console.log('✅ Rendering profile for:', user.display_name);
        
        container.innerHTML = `
            <div class="profile-card">
                <div class="profile-header">
                    ${user.images && user.images.length > 0 
                        ? `<img src="${user.images[0].url}" alt="${user.display_name}" class="profile-image-large">`
                        : '<div class="profile-image-placeholder">👤</div>'
                    }
                    <h2 class="profile-name">${user.display_name}</h2>
                    <p class="profile-email">${user.email || 'No email'}</p>
                </div>
                <div class="profile-stats">
                    <div class="stat-item">
                        <div class="stat-value">${user.followers?.total || 0}</div>
                        <div class="stat-label">Followers</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${user.product || 'free'}</div>
                        <div class="stat-label">Account Type</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${user.country || 'N/A'}</div>
                        <div class="stat-label">Country</div>
                    </div>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('❌ Error parsing user data:', error);
        container.innerHTML = `
            <div class="error-message">
                <p>❌ Error loading profile</p>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// ===== SEARCH VIEW =====

export async function renderSearchView() {
    console.log('🔍 Rendering Search view...');
    
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('search-results');
    
    if (!searchInput || !searchButton || !resultsContainer) return;
    
    // Clear previous results
    resultsContainer.innerHTML = `
        <div class="search-placeholder">
            <p>🔍 Search for songs, artists, or albums</p>
        </div>
    `;
    
    // Handle search
    const performSearch = async () => {
        const query = searchInput.value.trim();
        
        if (!query) {
            resultsContainer.innerHTML = `
                <div class="search-placeholder">
                    <p>⚠️ Please enter a search term</p>
                </div>
            `;
            return;
        }
        
        console.log('🔍 Searching for:', query);
        resultsContainer.innerHTML = '<div class="loading">Searching...</div>';
        
        try {
            const data = await searchTracks(query, 50);
            const tracks = data.tracks.items;
            
            console.log(`✅ Found ${tracks.length} tracks`);
            
            if (tracks.length === 0) {
                resultsContainer.innerHTML = `
                    <div class="empty-state">
                        <p>😕 No results found for "${query}"</p>
                    </div>
                `;
                return;
            }
            
            // Render results with header
            resultsContainer.innerHTML = `
                <div class="tracks-header">
                    <div class="track-header-number">#</div>
                    <div class="track-header-title">Title</div>
                    <div class="track-header-album">Album</div>
                    <div class="track-header-duration">⏱</div>
                </div>
                ${tracks.map((track, index) => `
                    <div class="track-item" data-track-uri="${track.uri}">
                        <div class="track-number">${index + 1}</div>
                        <div class="track-image">
                            <img src="${track.album.images[2]?.url || track.album.images[0]?.url || ''}" alt="${track.name}">
                        </div>
                        <div class="track-info">
                            <div class="track-name">${track.name}</div>
                            <div class="track-artist">${getArtistNames(track)}</div>
                        </div>
                        <div class="track-album">${track.album.name}</div>
                        <div class="track-duration">${formatDuration(track.duration_ms)}</div>
                    </div>
                `).join('')}
            `;
            
            // Add click handlers
            const trackItems = document.querySelectorAll('#search-results .track-item');
            trackItems.forEach(item => {
                item.addEventListener('click', () => {
                    const uri = item.dataset.trackUri;
                    console.log('🎵 Play track from search:', uri);
                    alert('Play functionality will be implemented in Phase 14 (Player Controls)');
                });
            });
            
        } catch (error) {
            console.error('❌ Error searching:', error);
            resultsContainer.innerHTML = `
                <div class="error-message">
                    <p>❌ Search failed</p>
                    <p>${error.message}</p>
                </div>
            `;
        }
    };
    
    // Event listeners
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}
