// Spotify API Integration

import { SPOTIFY_CONFIG, SPOTIFY_ENDPOINTS, STORAGE_KEYS, QUERY_DEFAULTS } from './config.js';
import { logout } from './auth.js';

// Step 6.1: Base fetch function with authentication
export async function spotifyFetch(endpoint, options = {}) {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (!token) {
        console.error('❌ No access token found');
        logout();
        throw new Error('Not authenticated');
    }
    
    const url = endpoint.startsWith('http') 
        ? endpoint 
        : `${SPOTIFY_CONFIG.API_BASE_URL}${endpoint}`;
    
    const config = {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    };
    
    try {
        console.log(`🌐 Fetching: ${url}`);
        const response = await fetch(url, config);
        
        // Handle 401 - Token expired
        if (response.status === 401) {
            console.error('❌ Token expired or invalid');
            logout();
            throw new Error('Token expired');
        }
        
        // Handle 429 - Rate limiting
        if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After') || 1;
            console.warn(`⏳ Rate limited. Retry after ${retryAfter}s`);
            throw new Error(`Rate limited. Retry after ${retryAfter} seconds`);
        }
        
        // Handle other errors
        if (!response.ok) {
            const error = await response.json();
            console.error('❌ API Error:', error);
            throw new Error(error.error?.message || 'API request failed');
        }
        
        const data = await response.json();
        console.log('✅ Data received:', data);
        return data;
        
    } catch (error) {
        console.error('❌ Fetch error:', error);
        throw error;
    }
}

// Step 6.2: User API

export async function getUserProfile() {
    console.log('👤 Fetching user profile...');
    try {
        const data = await spotifyFetch(SPOTIFY_ENDPOINTS.USER_PROFILE);
        
        // Save user data for later use
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
        
        return data;
    } catch (error) {
        console.error('❌ Error fetching user profile:', error);
        throw error;
    }
}

export async function getSavedTracks(limit = QUERY_DEFAULTS.LIMIT) {
    console.log('💾 Fetching saved tracks...');
    try {
        const params = new URLSearchParams({
            limit: limit.toString()
        });
        
        const data = await spotifyFetch(`${SPOTIFY_ENDPOINTS.USER_TRACKS}?${params}`);
        return data;
    } catch (error) {
        console.error('❌ Error fetching saved tracks:', error);
        throw error;
    }
}

// Step 6.3: Browse API

export async function getCategories(limit = QUERY_DEFAULTS.LIMIT) {
    console.log('📚 Fetching categories...');
    try {
        const params = new URLSearchParams({
            limit: limit.toString()
        });
        
        const data = await spotifyFetch(`${SPOTIFY_ENDPOINTS.CATEGORIES}?${params}`);
        return data;
    } catch (error) {
        console.error('❌ Error fetching categories:', error);
        throw error;
    }
}

export async function getCategoryPlaylists(categoryId, limit = QUERY_DEFAULTS.LIMIT) {
    console.log(`📋 Fetching playlists for category: ${categoryId}...`);
    try {
        const params = new URLSearchParams({
            limit: limit.toString(),
            country: 'US' // Add country parameter to help with regional categories
        });
        
        const endpoint = SPOTIFY_ENDPOINTS.CATEGORY_PLAYLISTS(categoryId);
        const fullUrl = `${endpoint}?${params}`;
        console.log(`🔗 Full URL: ${fullUrl}`);
        
        const data = await spotifyFetch(fullUrl);
        return data;
    } catch (error) {
        console.error('❌ Error fetching category playlists:', error);
        console.error('Category ID:', categoryId);
        console.error('Full error:', error);
        throw error;
    }
}

// Get Featured Playlists (fallback when categories fail)
export async function getFeaturedPlaylists(limit = QUERY_DEFAULTS.LIMIT) {
    console.log('🌟 Fetching featured playlists...');
    try {
        const params = new URLSearchParams({
            limit: limit.toString(),
            country: 'US'
        });
        
        const data = await spotifyFetch(`${SPOTIFY_ENDPOINTS.FEATURED_PLAYLISTS}?${params}`);
        console.log(`✅ Loaded ${data.playlists.items.length} featured playlists`);
        return data;
    } catch (error) {
        console.error('❌ Error fetching featured playlists:', error);
        throw error;
    }
}

// Step 6.4: Playlists API

export async function getUserPlaylists(limit = QUERY_DEFAULTS.LIMIT) {
    console.log('📋 Fetching user playlists...');
    try {
        const params = new URLSearchParams({
            limit: limit.toString()
        });
        
        const data = await spotifyFetch(`${SPOTIFY_ENDPOINTS.USER_PLAYLISTS}?${params}`);
        return data;
    } catch (error) {
        console.error('❌ Error fetching user playlists:', error);
        throw error;
    }
}

export async function getPlaylist(playlistId) {
    console.log(`📋 Fetching playlist: ${playlistId}...`);
    try {
        const endpoint = SPOTIFY_ENDPOINTS.PLAYLIST(playlistId);
        const data = await spotifyFetch(endpoint);
        return data;
    } catch (error) {
        console.error('❌ Error fetching playlist:', error);
        throw error;
    }
}

export async function getPlaylistTracks(playlistId, limit = QUERY_DEFAULTS.LIMIT) {
    console.log(`🎵 Fetching tracks for playlist: ${playlistId}...`);
    try {
        const params = new URLSearchParams({
            limit: limit.toString()
        });
        
        const endpoint = SPOTIFY_ENDPOINTS.PLAYLIST_TRACKS(playlistId);
        const data = await spotifyFetch(`${endpoint}?${params}`);
        return data;
    } catch (error) {
        console.error('❌ Error fetching playlist tracks:', error);
        throw error;
    }
}

// Step 6.5: Search API

export async function searchTracks(query, limit = QUERY_DEFAULTS.LIMIT) {
    console.log(`🔍 Searching for: ${query}...`);
    try {
        const params = new URLSearchParams({
            q: query,
            type: 'track',
            limit: limit.toString()
        });
        
        const data = await spotifyFetch(`${SPOTIFY_ENDPOINTS.SEARCH}?${params}`);
        return data;
    } catch (error) {
        console.error('❌ Error searching tracks:', error);
        throw error;
    }
}

// Search for playlists by genre/keyword
export async function searchPlaylists(query, limit = QUERY_DEFAULTS.LIMIT) {
    console.log(`🔍 Searching playlists for: ${query}...`);
    try {
        const params = new URLSearchParams({
            q: query,
            type: 'playlist',
            limit: limit.toString()
        });
        
        const data = await spotifyFetch(`${SPOTIFY_ENDPOINTS.SEARCH}?${params}`);
        console.log(`✅ Found ${data.playlists.items.length} playlists`);
        return data;
    } catch (error) {
        console.error('❌ Error searching playlists:', error);
        throw error;
    }
}

// Step 6.6: Player API

export async function playTrack(uri, contextUri = null, position = 0) {
    console.log(`▶️ Playing track: ${uri}...`);
    try {
        const body = contextUri 
            ? { context_uri: contextUri, offset: { position } }
            : { uris: [uri] };
        
        await spotifyFetch(SPOTIFY_ENDPOINTS.PLAY, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
        
        return true;
    } catch (error) {
        console.error('❌ Error playing track:', error);
        throw error;
    }
}

export async function pauseTrack() {
    console.log('⏸️ Pausing playback...');
    try {
        await spotifyFetch(SPOTIFY_ENDPOINTS.PAUSE, {
            method: 'PUT'
        });
        
        return true;
    } catch (error) {
        console.error('❌ Error pausing track:', error);
        throw error;
    }
}

export async function getCurrentPlayback() {
    console.log('🎵 Getting current playback state...');
    try {
        const data = await spotifyFetch(SPOTIFY_ENDPOINTS.PLAYER);
        return data;
    } catch (error) {
        console.error('❌ Error getting playback state:', error);
        throw error;
    }
}

// Helper: Format track duration (ms to mm:ss)
export function formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Helper: Get first artist name
export function getArtistName(track) {
    return track.artists && track.artists.length > 0 
        ? track.artists[0].name 
        : 'Unknown Artist';
}

// Helper: Get all artist names
export function getArtistNames(track) {
    return track.artists && track.artists.length > 0
        ? track.artists.map(a => a.name).join(', ')
        : 'Unknown Artist';
}
