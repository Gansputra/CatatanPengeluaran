const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/expense.controller');

router.get('/', ExpenseController.renderIndex);
router.get('/add', (req, res) => res.render('pages/add'));
router.post('/add', ExpenseController.addExpense);

module.exports = router;