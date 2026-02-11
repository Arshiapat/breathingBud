// API for inhaler usage
const express = require('express');
const router = express.Router();
const pool = require('../db'); // we’ll make db.js next

// Route for inhaler usage
// Creates POST endpoint, which means frontend is sending data to server
router.post('/', async (req, res) => {
  try {
    // Takes data send by frontend (expect JSON)
    // These three values will be saved to db
    const {user_id, inhaler_type, dose} = req.body;
    // INSET INTO adds new row to inhaler_usage table
    // $1, $2, $3 are placeholders for the values in the array [user_id, inhaler_type, dose]
    // RETURNING * means that after inserting the new row, the database will return the entire row that was just inserted to frontend
    const result = await pool.query('INSERT INTO inhaler_usage (user_id, inhaler_type, dose) VALUES ($1, $2, $3) RETURNING *',
      [user_id, inhaler_type, dose]);
    
    // Sends new row back to frontend
    res.json(result.rows[0]);
  // Catches error and sends error message back to frontend
  } catch (error) {
    console.error('Error saving inhaler usage:', error);
    res.status(500).json({ error: 'Failed to save inhaler usage' });
  }
  
});