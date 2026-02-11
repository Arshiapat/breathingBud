// API for fetching air quality
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Defines GET endpoint for air quality data, which means frontend is requesting data from server
router.get('/:lat/:lon', async (req, res) => {
    // Extracts latitude and longitude from URL parameters
    const { lat, lon } = req.params;
    try {
        // Makes HTTP GET request to OpenAQ API for air quality data
        const response = await axios.get(`https://api.openaq.org/v2/latest?coordinates=${lat},${lon}`);
        // Sends API response back to frontend
        res.json(response.data); 
    
    } catch (error) {
        console.error('Error fetching air quality data:', error);
        res.status(500).json({ error: 'Failed to fetch air quality data' });
    }
});

// Exports router so that it can be used in server.js
module.exports = router;