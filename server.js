const express = require('express');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

const app = express();
app.use(express.json());

// Serve static files (your HTML/CSS/JS)
app.use(express.static(path.join(__dirname)));

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// ============================================
// DATABASE (lowdb - JSON file)
// ============================================

const adapter = new JSONFile('db.json');
const db = new Low(adapter, { expenses: [] });

// Load database
async function initDb() {
    await db.read();
    db.data = db.data || { expenses: [] };
    await db.write();
}
initDb();

// ============================================
// ROUTES
// ============================================

// Test route
app.get('/hello', (req, res) => {
    res.json({ message: 'Server is alive!' });
});

// GET all expenses
app.get('/expenses', async (req, res) => {
    await db.read();
    res.json(db.data.expenses);
});

// POST new expense
app.post('/expenses', async (req, res) => {
    const { name, amount, category } = req.body;
    const date = new Date().toLocaleDateString();

    const expense = {
        id: Date.now(),
        name,
        amount,
        category,
        date
    };

    await db.read();
    db.data.expenses.push(expense);
    await db.write();

    res.json(expense);
});

// DELETE expense
app.delete('/expenses/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    await db.read();
    db.data.expenses = db.data.expenses.filter(e => e.id !== id);
    await db.write();

    res.json({ message: 'Deleted' });
});

// ============================================
// START
// ============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});