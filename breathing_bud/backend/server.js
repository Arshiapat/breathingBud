const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

//Database connection
const pool = new Pool({
  host: 'database',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'hackstack'
});

//Initializes the database
// Table for inhaler usage
// columnName RULES
pool.query(`
  CREATE TABLE IF NOT EXISTS inhaler_usage (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    inhaler_type VARCHAR(100) NOT NULL,
    dose INT NOT NULL,
    taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).then(() => console.log('Inhaler usage db table initialized'));

//Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Route for inhaler usage
// Creates POST endpoint, which means frontend is sending data to server
app.get('/api/inhaler', async (req, res) => {
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

app.post('/api/items', async (req, res) => {
  const { name } = req.body;
  const result = await pool.query(
    'INSERT INTO items (name) VALUES ($1) RETURNING *',
    [name]
  );
  res.json(result.rows[0]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
