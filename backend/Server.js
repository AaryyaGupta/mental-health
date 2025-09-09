require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const chatRoute = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/chat', chatRoute);

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
