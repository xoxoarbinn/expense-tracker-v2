const API_URL = '/expenses';

const btn = document.getElementById('addBtn');
const list = document.getElementById('expenseList');
const totalDisplay = document.getElementById('totalAmount');

// ============================================
// FETCH DATA FROM SERVER
// ============================================

async function loadExpenses() {
    const response = await fetch(API_URL);
    const expenses = await response.json();
    renderExpenses(expenses);
}

// ============================================
// SEND NEW EXPENSE TO SERVER
// ============================================

async function addExpense(name, amount, category) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount, category })
    });
    return await response.json();
}

// ============================================
// DELETE EXPENSE FROM SERVER
// ============================================

async function deleteExpense(id) {
    await fetch(API_URL + '/' + id, {
        method: 'DELETE'
    });
}

// ============================================
// DISPLAY EXPENSES ON PAGE
// ============================================

function renderExpenses(expenses) {
    list.innerHTML = '';
    
    let total = 0;
    
    expenses.forEach(expense => {
        total += expense.amount;
        
        const div = document.createElement('div');
        div.innerHTML = `
            <span>${expense.date} — ${expense.category} — ${expense.name} — Rs. ${expense.amount.toFixed(2)}</span>
            <button class="del-btn" data-id="${expense.id}">X</button>
        `;
        list.appendChild(div);
    });
    
    totalDisplay.textContent = total.toFixed(2);
}

// ============================================
// ADD BUTTON CLICK
// ============================================

btn.addEventListener('click', async function() {
    const name = document.getElementById('exname').value.trim();
    const amount = parseFloat(document.getElementById('amt').value);
    const category = document.getElementById('category').value;
    
    if (!name) {
        alert('ENTER NAME!');
        document.getElementById('exname').focus();
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        alert('ENTER VALID AMOUNT');
        document.getElementById('amt').focus();
        return;
    }
    
    // Send to server
    await addExpense(name, amount, category);
    
    // Reload everything from server
    await loadExpenses();
    
    // Clear form
    document.getElementById('exname').value = '';
    document.getElementById('amt').value = '';
    document.getElementById('category').value = 'Food';
    document.getElementById('exname').focus();
});

// ============================================
// DELETE BUTTON CLICK
// ============================================

list.addEventListener('click', async function(e) {
    if (e.target.classList.contains('del-btn')) {
        const id = e.target.dataset.id;
        await deleteExpense(id);
        await loadExpenses();
    }
});

// ============================================
// ENTER KEY NAVIGATION
// ============================================

document.getElementById('exname').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('amt').focus();
    }
});

document.getElementById('amt').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('category').focus();
    }
});

document.getElementById('category').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        btn.click();
    }
});

// ============================================
// LOAD ON PAGE START
// ============================================

loadExpenses();