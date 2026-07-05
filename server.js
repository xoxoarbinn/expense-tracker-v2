const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());

// Serve your HTML/CSS/JS files
app.use(express.static(path.join(__dirname)));

// Allow frontend to talk to backend (CORS)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// ============================================
// DATABASE
// ============================================

const db = new sqlite3.Database('./expenses.db');

db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        amount REAL,
        category TEXT,
        date TEXT
    )
`);

// ============================================
// ROUTES
// ============================================

app.get('/hello', (req, res) => {
    res.json({ message: 'Server is alive!' });
});

app.get('/expenses', (req, res) => {
    db.all('SELECT * FROM expenses', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/expenses', (req, res) => {
    const { name, amount, category } = req.body;
    const date = new Date().toLocaleDateString();

    db.run(
        'INSERT INTO expenses (name, amount, category, date) VALUES (?, ?, ?, ?)',
        [name, amount, category, date],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, name, amount, category, date });
        }
    );
});

app.delete('/expenses/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM expenses WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Deleted' });
    });
});

// ============================================
// START
// ============================================

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});