const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const chatRoute = require('./routes/chat');
const communitiesRoute = require('./routes/communities');
const fitcheckRoute = require('./routes/fitcheck');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;

// More secure CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : true,
    credentials: true
}));

// Body parser with size limits for security
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/chat', chatRoute);
app.use('/api/communities', communitiesRoute);
app.use('/api/fitcheck', fitcheckRoute);

// Google OAuth code exchange (server-side token handling)
app.post('/api/oauth/google/exchange', async (req, res) => {
    try {
        const { code, redirectUri } = req.body || {};
        if (!code) return res.status(400).json({ error: 'Missing authorization code' });

        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        if (!clientId || !clientSecret) {
            return res.status(500).json({ error: 'Server OAuth credentials not configured' });
        }

        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri || `${process.env.PUBLIC_URL || ''}/index.html`,
                grant_type: 'authorization_code'
            }).toString()
        });

        const tokenJson = await tokenRes.json();
        if (!tokenRes.ok) {
            return res.status(400).json({ error: 'Token exchange failed', details: tokenJson });
        }

        // Never send refresh_token back to insecure clients in production; included here for completeness.
        res.json({
            access_token: tokenJson.access_token,
            expires_in: tokenJson.expires_in,
            id_token: tokenJson.id_token,
            scope: tokenJson.scope,
            token_type: tokenJson.token_type
        });
    } catch (err) {
        console.error('Google OAuth exchange error', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

console.log('🌟 Zephy Student Wellness Hub Server Started');
console.log('📍 Available at: http://localhost:' + PORT);
console.log('🏫 Features: Anonymous Communities, Polls, Wellness Checks');
console.log('🔒 Privacy: Complete anonymity for students');
