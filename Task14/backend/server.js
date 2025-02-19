const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Routes
// POST /blogs
app.post('/blogs', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const [result] = await pool.query(
      'INSERT INTO blogs (title, content, author) VALUES (?, ?, ?)',
      [title, content, author]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /blogs
app.get('/blogs', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add GET /blogs/:id, PUT /blogs/:id, DELETE /blogs/:id similarly
// GET single blog
app.get('/blogs/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // UPDATE blog
  app.put('/blogs/:id', async (req, res) => {
    try {
      const { title, content, author } = req.body;
      await pool.query(
        'UPDATE blogs SET title = ?, content = ?, author = ? WHERE id = ?',
        [title, content, author, req.params.id]
      );
      res.json({ message: 'Blog updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // DELETE blog
  app.delete('/blogs/:id', async (req, res) => {
    try {
      await pool.query('DELETE FROM blogs WHERE id = ?', [req.params.id]);
      res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});