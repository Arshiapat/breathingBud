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
const inhalerRoutes = require('./routes/inhaler');
app.use('/api/inhaler', inhalerRoutes);

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
