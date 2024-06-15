// server.js

// Import required modules
require('express-async-errors');
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const matchesRoutes = require("./routes/matches.route")

// Initialize Express app
const app = express();

app.use(express.json())
app.use('/api', matchesRoutes)

app.use((err, req, res, next) => {
    res
    .status(err?.cause?.status || 500)
    .json({ error: err?.message || 'Internal Server Error' });
})

// Define MongoDB connection URL
const mongoURI = process.env.DB_URL

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(-1); // Exit application on error
    });

// Define a test route
app.get('/', (req, res) => {
    res.send('Sever is started!');
});

// Start the server
const port = 7000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
