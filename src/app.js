const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const result = require('dotenv').config();
if (result.error) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️  WARNING: File .env tidak ditemukan! Silakan buat file .env terlebih dahulu.');
}

const app = express();
const expenseRoutes = require('./routes/expense.routes');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Routes
app.use('/', expenseRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});