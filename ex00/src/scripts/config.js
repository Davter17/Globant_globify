// Spotify API Configuration
// IMPORTANT: The actual Client ID is in config.local.js (not tracked by git)

import { LOCAL_CONFIG } from './config.local.js';

export const SPOTIFY_CONFIG = {
    CLIENT_ID: LOCAL_CONFIG.CLIENT_ID,
    REDIRECT_URI: 'https://localhost:8080/callback',
    AUTH_ENDPOINT: 'https://accounts.spotify.com/authorize',
    TOKEN_ENDPOINT: 'https://accounts.spotify.com/api/token',
    API_BASE_URL: 'https://api.spotify.com/v1',
    SCOPES: [
        'user-read-private',
        'user-read-email',
        'user-library-read',
        'user-top-read',
        'playlist-read-private',
        'playlist-read-collaborative',
        'streaming',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing'
    ].join(' ')
};

// Storage keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'spotify_access_token',
    TOKEN_EXPIRY: 'spotify_token_expiry',
    USER_DATA: 'spotify_user_data'
};

// API Endpoints
export const SPOTIFY_ENDPOINTS = {
    USER_PROFILE: '/me',
    USER_PLAYLISTS: '/me/playlists',
    USER_TRACKS: '/me/tracks',
    CATEGORIES: '/browse/categories',
    CATEGORY_PLAYLISTS: (categoryId) => `/browse/categories/${categoryId}/playlists`,
    PLAYLIST: (playlistId) => `/playlists/${playlistId}`,
    PLAYLIST_TRACKS: (playlistId) => `/playlists/${playlistId}/tracks`,
    SEARCH: '/search',
    PLAYER: '/me/player',
    PLAY: '/me/player/play',
    PAUSE: '/me/player/pause'
};

// Query parameters defaults
export const QUERY_DEFAULTS = {
    LIMIT: 50,
    MARKET: 'US'
};
