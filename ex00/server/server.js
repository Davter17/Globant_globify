import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Endpoint to exchange authorization code for access token
app.post('/api/token', async (req, res) => {
    const { code, code_verifier, redirect_uri, client_id } = req.body;
    
    console.log('🔄 Exchanging code for token...');
    
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirect_uri,
                client_id: client_id,
                code_verifier: code_verifier
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error('❌ Token exchange failed:', data);
            return res.status(response.status).json(data);
        }
        
        console.log('✅ Token exchange successful');
        res.json(data);
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Token exchange server running on port ${PORT}`);
});
