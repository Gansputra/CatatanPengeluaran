const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
require('dotenv').config();

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