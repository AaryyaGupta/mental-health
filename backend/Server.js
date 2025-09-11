const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const chatRoute = require('./routes/chat');
const communitiesRoute = require('./routes/communities');

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
