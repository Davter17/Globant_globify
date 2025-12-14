# Spotify API Setup Instructions

## Step-by-Step Guide

### 1. Create Spotify Developer Account
1. Go to https://developer.spotify.com/dashboard
2. Log in with your Spotify account (create one if you don't have it)

### 2. Create a New Application
1. Click on "Create app" button
2. Fill in the required information:
   - **App name**: Globify (or any name you prefer)
   - **App description**: Web-based music player for Globant Piscine
   - **Redirect URI**: `http://localhost:8080/callback`
   - **Which API/SDKs are you planning to use?**: Select "Web API"
3. Accept the Terms of Service
4. Click "Save"

### 3. Get Your Credentials
1. In your app dashboard, you'll see:
   - **Client ID** (a long string like: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`)
   - Click "Show client secret" if you need it (not required for this project)

### 4. Configure Redirect URI
1. Click on "Settings" in your app dashboard
2. In "Redirect URIs" section, make sure you have:
   - `http://localhost:8080/callback`
3. If deploying to production, add your production URL too
4. Click "Save"

### 5. Update Your Config File
1. Open `src/scripts/config.js`
2. Replace `YOUR_CLIENT_ID_HERE` with your actual Client ID:
   ```javascript
   export const SPOTIFY_CONFIG = {
       CLIENT_ID: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p', // Your actual Client ID
       // ... rest of the config
   };
   ```

### 6. Test Your Setup
1. Start the Docker container: `docker-compose up`
2. Open http://localhost:8080
3. Try to log in with Spotify
4. If everything works, you should be redirected back to your app

## Important Notes

- ⚠️ **NEVER** commit your Client ID to a public repository
- The `.gitignore` file is already configured to ignore `config.local.js`
- For production, use environment variables instead of hardcoding credentials
- The Redirect URI must EXACTLY match what you configured in Spotify Dashboard

## Troubleshooting

### "Invalid client" error
- Check that your Client ID is correct
- Make sure there are no extra spaces in the config

### "Invalid redirect URI" error
- Verify the redirect URI in your Spotify app settings matches exactly: `http://localhost:8080/callback`
- Check for trailing slashes or protocol mismatches (http vs https)

### "The access token expired" error
- This is normal, tokens expire after 1 hour
- The app should handle re-authentication automatically

## Scopes Explained

The app requests these permissions:
- `user-read-private` - Read user's profile info
- `user-read-email` - Read user's email
- `user-library-read` - Read saved tracks
- `playlist-read-private` - Read private playlists
- `streaming` - Play music in the browser
- `user-read-playback-state` - Read current playback
- `user-modify-playback-state` - Control playback (play/pause)

## Next Steps

Once your Spotify API is configured, you can:
1. Test the Docker setup
2. Implement authentication flow
3. Start building the UI
4. Connect to Spotify API endpoints

---

**Ready to continue?** Head back to `steps.md` and continue with Phase 2!
