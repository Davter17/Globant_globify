// Player functionality

// Player state
let currentTrack = null;
let isPlaying = false;
let playerInstance = null;
let deviceId = null;
let isPremiumUser = true; // Will be set to false if account_error occurs
let progressInterval = null;

// Initialize Spotify Web Playback SDK
export async function initPlayer(accessToken) {
    console.log('🎵 Initializing Spotify Web Playback SDK...');
    console.log('🔑 Access Token available:', !!accessToken);
    
    return new Promise((resolve, reject) => {
        // Check if SDK is already loaded
        if (window.Spotify) {
            console.log('✅ Spotify SDK already loaded, setting up player...');
            setupPlayer(accessToken, resolve, reject);
            return;
        }
        
        console.log('📥 Loading Spotify SDK script...');
        
        // Load Spotify SDK script
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        
        script.onerror = () => {
            console.error('❌ Failed to load Spotify SDK script');
            reject('Failed to load Spotify SDK');
        };
        
        document.body.appendChild(script);
        
        // SDK will call this callback when ready
        window.onSpotifyWebPlaybackSDKReady = () => {
            console.log('✅ Spotify SDK loaded, callback fired');
            setupPlayer(accessToken, resolve, reject);
        };
        
        // Timeout after 10 seconds
        setTimeout(() => {
            if (!window.Spotify) {
                console.error('❌ Spotify SDK failed to load after 10 seconds');
                reject('Timeout loading Spotify SDK');
            }
        }, 10000);
    });
}

function setupPlayer(accessToken, resolve, reject) {
    console.log('🔧 Setting up Spotify Player...');
    
    try {
        const player = new Spotify.Player({
            name: 'Globify Web Player',
            getOAuthToken: cb => { 
                console.log('🔑 Player requesting token...');
                cb(accessToken); 
            },
            volume: 0.5
        });
        
        console.log('✅ Player instance created');
        
        // Error handling
        player.addListener('initialization_error', ({ message }) => {
            console.error('❌ Initialization Error:', message);
            reject(message);
        });
        
        player.addListener('authentication_error', ({ message }) => {
            console.error('❌ Authentication Error:', message);
            reject(message);
        });
        
        player.addListener('account_error', ({ message }) => {
            console.error('❌ Account Error:', message);
            isPremiumUser = false;
            console.warn('⚠️ User does not have Spotify Premium - playback disabled');
            // Resolve anyway so the app can continue (just without playback)
            resolve({ error: 'premium_required', message });
        });
        
        player.addListener('playback_error', ({ message }) => {
            console.error('❌ Playback Error:', message);
        });
        
        // Ready
        player.addListener('ready', ({ device_id }) => {
            console.log('✅ Player Ready with Device ID:', device_id);
            deviceId = device_id;
            playerInstance = player;
            isPremiumUser = true;
            resolve(player);
        });
    
    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('⚠️ Device ID has gone offline:', device_id);
    });
    
    // Player state changed
    player.addListener('player_state_changed', state => {
        if (!state) {
            console.log('⚠️ Player state is null');
            return;
        }
        
        console.log('🎵 Player state changed:', state);
        
        currentTrack = state.track_window.current_track;
        isPlaying = !state.paused;
        
        updatePlayerUI(currentTrack, isPlaying, state.position, state.duration);
        
        // Clear existing interval
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
        
        // Start progress interval if playing
        if (isPlaying) {
            progressInterval = setInterval(() => {
                playerInstance.getCurrentState().then(state => {
                    if (state) {
                        updateProgress(state.position, state.duration);
                    }
                });
            }, 1000); // Update every second
        }
    });
    
        // Connect to the player
        console.log('🔌 Connecting player...');
        player.connect();
        
    } catch (error) {
        console.error('❌ Error setting up player:', error);
        reject(error);
    }
}

// Play a track
export async function playTrack(trackUri, accessToken) {
    console.log('▶️ Playing track:', trackUri);
    
    if (!isPremiumUser) {
        console.warn('⚠️ User is not Premium');
        alert('🎵 Spotify Premium Required\n\nTo play music, you need a Spotify Premium account.\n\nYou can still:\n✅ Browse categories and playlists\n✅ Search for songs\n✅ View your favorites\n\n👉 Upgrade to Premium at spotify.com');
        return;
    }
    
    if (!deviceId) {
        console.error('❌ No device ID available');
        alert('⚠️ Player not ready. Please refresh the page and try again.');
        return;
    }
    
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                uris: [trackUri]
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Play error:', error);
            
            if (response.status === 403 && error.error.reason === 'PREMIUM_REQUIRED') {
                alert('⚠️ Spotify Premium is required to play music. You can still browse!');
            } else {
                alert('⚠️ Could not play track. Please try again.');
            }
        }
    } catch (error) {
        console.error('❌ Error playing track:', error);
        alert('⚠️ Error playing track. Please try again.');
    }
}

// Pause playback
export async function pauseTrack(accessToken) {
    console.log('⏸️ Pausing playback');
    
    if (!deviceId) {
        console.error('❌ No device ID available');
        return;
    }
    
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            console.error('❌ Pause error');
        }
    } catch (error) {
        console.error('❌ Error pausing:', error);
    }
}

// Resume playback
export async function resumeTrack(accessToken) {
    console.log('▶️ Resuming playback');
    
    if (!deviceId) {
        console.error('❌ No device ID available');
        return;
    }
    
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            console.error('❌ Resume error');
        }
    } catch (error) {
        console.error('❌ Error resuming:', error);
    }
}

// Toggle play/pause
export async function togglePlayPause(accessToken) {
    if (isPlaying) {
        await pauseTrack(accessToken);
    } else {
        await resumeTrack(accessToken);
    }
}

// Seek to position in track
export async function seekToPosition(positionMs, accessToken) {
    console.log('⏩ Seeking to position:', positionMs, 'ms');
    
    if (!isPremiumUser) {
        console.warn('⚠️ Seek requires Spotify Premium');
        return;
    }
    
    if (!deviceId) {
        console.error('❌ No device ID available');
        return;
    }
    
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${positionMs}&device_id=${deviceId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            console.error('❌ Seek error:', response.status);
        } else {
            console.log('✅ Seeked to:', formatTime(positionMs));
        }
    } catch (error) {
        console.error('❌ Error seeking:', error);
    }
}

// Update player UI
function updatePlayerUI(track, playing, position = 0, duration = 0) {
    if (!track) {
        console.log('⚠️ No track to display');
        return;
    }
    
    console.log('🎵 Updating player UI:', track.name, 'by', track.artists[0].name);
    
    // Show player bar
    const playerBar = document.getElementById('player-bar');
    if (playerBar) {
        playerBar.style.display = 'flex';
    }
    
    // Update track info
    const trackImage = document.getElementById('player-track-image');
    const trackName = document.getElementById('player-track-name');
    const trackArtist = document.getElementById('player-track-artist');
    
    if (trackImage && track.album.images.length > 0) {
        trackImage.src = track.album.images[0].url;
        trackImage.alt = track.name;
    }
    
    if (trackName) {
        trackName.textContent = track.name;
    }
    
    if (trackArtist) {
        trackArtist.textContent = track.artists.map(a => a.name).join(', ');
    }
    
    // Update play/pause button
    const playButton = document.getElementById('player-play-btn');
    if (playButton) {
        playButton.textContent = playing ? '⏸️' : '▶️';
        playButton.setAttribute('data-playing', playing);
        console.log('🔘 Button updated:', playing ? 'PAUSE' : 'PLAY');
    }
    
    // Update progress bar
    updateProgress(position, duration);
}

// Format time in mm:ss
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Update progress bar
function updateProgress(position, duration) {
    const currentTimeEl = document.getElementById('player-current-time');
    const durationEl = document.getElementById('player-duration');
    const progressFill = document.getElementById('player-progress-fill');
    
    if (currentTimeEl && duration > 0) {
        currentTimeEl.textContent = formatTime(position);
    }
    
    if (durationEl && duration > 0) {
        durationEl.textContent = formatTime(duration);
    }
    
    if (progressFill && duration > 0) {
        const percentage = (position / duration) * 100;
        progressFill.style.width = `${percentage}%`;
    }
}

// Setup progress bar click handler
export function setupProgressBarHandler(accessToken) {
    const progressBar = document.getElementById('player-progress-fill');
    const progressBarContainer = progressBar?.parentElement;
    
    if (progressBarContainer) {
        // Remove existing listener if any
        const newProgressBar = progressBarContainer.cloneNode(true);
        progressBarContainer.parentNode.replaceChild(newProgressBar, progressBarContainer);
        
        // Add click listener
        newProgressBar.addEventListener('click', async (e) => {
            if (!playerInstance) {
                console.warn('⚠️ Player not ready');
                return;
            }
            
            // Get click position relative to progress bar
            const rect = newProgressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            
            // Get current state to know the duration
            const state = await playerInstance.getCurrentState();
            if (state && state.duration) {
                const newPosition = Math.floor(state.duration * percentage);
                await seekToPosition(newPosition, accessToken);
            }
        });
        
        console.log('✅ Progress bar click handler setup');
    }
}

// Get current track
export function getCurrentTrack() {
    return currentTrack;
}

// Get playing state
export function getIsPlaying() {
    return isPlaying;
}

// Get device ID
export function getDeviceId() {
    return deviceId;
}

// Check if user is Premium
export function getIsPremiumUser() {
    return isPremiumUser;
}

// Play playlist context (entire playlist)
export async function playPlaylistContext(contextUri, accessToken) {
    console.log('▶️ Playing playlist context:', contextUri);
    
    if (!isPremiumUser) {
        console.warn('⚠️ User is not Premium');
        alert('🎵 Spotify Premium Required\n\nTo play music, you need a Spotify Premium account.\n\nYou can still:\n✅ Browse categories and playlists\n✅ Search for songs\n✅ View your favorites\n\n👉 Upgrade to Premium at spotify.com');
        return;
    }
    
    if (!deviceId) {
        console.error('❌ No device ID available');
        alert('⚠️ Player not ready. Please refresh the page and try again.');
        return;
    }
    
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                context_uri: contextUri
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Play context error:', error);
            
            if (response.status === 403 && error.error.reason === 'PREMIUM_REQUIRED') {
                alert('⚠️ Spotify Premium is required to play music. You can still browse!');
            } else {
                alert('⚠️ Could not play playlist. Please try again.');
            }
        }
    } catch (error) {
        console.error('❌ Error playing playlist context:', error);
        alert('⚠️ Error playing playlist. Please try again.');
    }
}
