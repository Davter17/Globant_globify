// Authentication handling with Spotify OAuth 2.0

import { SPOTIFY_CONFIG, STORAGE_KEYS } from './config.js';
import { navigateTo } from './router.js';

// Generate random string for state parameter
function generateRandomString(length = 16) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// Generate code verifier for PKCE
function generateCodeVerifier() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return base64URLEncode(array);
}

// Generate code challenge from verifier
async function generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return base64URLEncode(new Uint8Array(hash));
}

// Base64 URL encode
function base64URLEncode(buffer) {
    const base64 = btoa(String.fromCharCode(...buffer));
    return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

// Step 5.1: Login Flow with PKCE (using local backend)
export async function login() {
    console.log('🔐 Initiating Spotify login with PKCE...');
    
    const state = generateRandomString(16);
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    // Store for later use
    localStorage.setItem('spotify_auth_state', state);
    localStorage.setItem('spotify_code_verifier', codeVerifier);
    
    const params = new URLSearchParams({
        client_id: SPOTIFY_CONFIG.CLIENT_ID,
        response_type: 'code',
        redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
        state: state,
        scope: SPOTIFY_CONFIG.SCOPES,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge
    });
    
    const authUrl = `${SPOTIFY_CONFIG.AUTH_ENDPOINT}?${params.toString()}`;
    console.log('🔗 Auth URL:', authUrl);
    console.log('📋 Params:', {
        client_id: SPOTIFY_CONFIG.CLIENT_ID,
        response_type: 'code',
        redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
        code_challenge_method: 'S256'
    });
    console.log('🔗 Redirecting to Spotify...');
    
    window.location.href = authUrl;
}

// Step 5.2: Callback Handler - Exchange code for token via local backend
export async function handleCallback() {
    console.log('🔍 Checking for callback parameters...');
    
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    
    if (error) {
        console.error('❌ Authorization error:', error);
        logout();
        return false;
    }
    
    if (code) {
        console.log('✅ Authorization code received!');
        
        // Verify state
        const storedState = localStorage.getItem('spotify_auth_state');
        if (state !== storedState) {
            console.error('❌ State mismatch');
            logout();
            return false;
        }
        
        // Get code verifier
        const codeVerifier = localStorage.getItem('spotify_code_verifier');
        
        console.log('🔄 Exchanging code for token via backend...');
        
        try {
            const response = await fetch('http://127.0.0.1:3000/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: code,
                    code_verifier: codeVerifier,
                    redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
                    client_id: SPOTIFY_CONFIG.CLIENT_ID
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                console.error('❌ Token exchange failed:', data);
                logout();
                return false;
            }
            
            const accessToken = data.access_token;
            const expiresIn = data.expires_in;
            
            // Store token
            const expiryTime = Date.now() + (parseInt(expiresIn) * 1000);
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
            
            // Clean up
            localStorage.removeItem('spotify_auth_state');
            localStorage.removeItem('spotify_code_verifier');
            
            console.log('✅ Authentication successful!');
            
            // Clean URL
            window.history.replaceState(null, null, window.location.pathname);
            
            // Redirect to home
            navigateTo('home');
            
            return true;
        } catch (error) {
            console.error('❌ Error:', error);
            logout();
            return false;
        }
    }
    
    return false;
}

// Step 5.3: Logout
export function logout() {
    console.log('👋 Logging out...');
    
    // Clear all stored data
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem('spotify_auth_state');
    
    // Redirect to login
    navigateTo('login');
    
    console.log('✅ Logged out successfully');
}

// Step 5.4: Check if user is authenticated
export function isAuthenticated() {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    
    if (!token || !expiry) {
        return false;
    }
    
    // Check if token is expired
    if (Date.now() >= parseInt(expiry)) {
        console.log('⏰ Token expired');
        logout();
        return false;
    }
    
    return true;
}

// Get access token
export function getAccessToken() {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

console.log('✅ Auth module loaded');
