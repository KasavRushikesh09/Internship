const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = 'your_secret_key'; // Change to a strong secret

// *User Registration API (POST /users)*
app.post('/users', async (req, res) => {
    const { name, email, password, role } = req.body;

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [result] = await db.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, role || 'user']
        );
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// *User Login API (POST /login)*
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// *Middleware for JWT Authentication*
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(403).json({ error: "Invalid token" });
    }
};

// *Fetch All Users (GET /users)*
app.get('/users', authenticate, async (req, res) => {
    try {
        const [users] = await db.query("SELECT id, name, email, role FROM users");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// *Update User (PUT /users/:id)*
app.put('/users/:id', authenticate, async (req, res) => {
    const { name, email, role } = req.body;
    const { id } = req.params;

    try {
        await db.query("UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?", [name, email, role, id]);
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// *Delete User (DELETE /users/:id)*
app.delete('/users/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        await db.query("DELETE FROM users WHERE id = ?", [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// *Start Server*
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));