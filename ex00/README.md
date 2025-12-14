# Globify - Spotify Web Music Player

A vanilla JavaScript web-based music player using Spotify's API.

## Features

- Login/Logout with Spotify OAuth 2.0
- Browse music categories and playlists
- Search for tracks
- View and play saved tracks
- Basic music player (play/pause)
- Fully responsive design (mobile & desktop)

## Prerequisites

- Docker and Docker Compose
- Spotify Developer Account
- Modern web browser

## Installation

### 1. Spotify API Setup

Follow the detailed instructions in [SPOTIFY_SETUP.md](./SPOTIFY_SETUP.md)

Quick steps:
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Note your **Client ID**
4. Add `http://localhost:8080/callback` to Redirect URIs
5. Save your changes

### 2. Configure the Application

Copy the config template and add your Client ID:

```bash
cp src/scripts/config.local.example.js src/scripts/config.local.js
```

Then edit `src/scripts/config.local.js` and replace `YOUR_CLIENT_ID_HERE` with your actual Client ID:

```javascript
export const LOCAL_CONFIG = {
    CLIENT_ID: 'your_actual_client_id_here' // Replace this!
};
```

⚠️ **Important**: `config.local.js` is ignored by git to protect your credentials

### 3. Run with Docker

```bash
# Build and start the application
docker-compose up --build

# Access the application at http://localhost:8080
```

## Usage

1. Open http://localhost:8080 in your browser
2. Click "Login with Spotify"
3. Authorize the application
4. Start browsing and playing music!

## Project Structure

```
ex00/
├── src/
│   ├── index.html              # Main HTML file
│   ├── styles/
│   │   └── main.css           # Application styles
│   ├── scripts/
│   │   ├── main.js            # Entry point
│   │   ├── auth.js            # Authentication logic
│   │   ├── api.js             # Spotify API calls
│   │   ├── player.js          # Player functionality
│   │   ├── router.js          # Client-side routing
│   │   └── components/        # UI components
│   └── assets/                # Static assets
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker Compose setup
└── nginx.conf                # Nginx configuration
```

## Development

This project uses vanilla JavaScript/TypeScript with no external libraries.

## Technologies Used

- Vanilla JavaScript
- CSS3
- Spotify Web API
- Spotify OAuth 2.0
- Docker & Nginx

## License

This is a student project for Globant Piscine.

## Authors

[Your Team Name]
