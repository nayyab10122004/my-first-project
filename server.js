const express = require('express');
const app = express();
const path = require('path');

// Frontend ki file dikhane ke liye
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Server ko chalaane ke liye
app.listen(3000, () => {
    console.log('Server is working: http://localhost:3000');
});
