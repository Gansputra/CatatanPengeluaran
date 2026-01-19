const ExpenseService = require('../services/expense.service');
const formatter = require('../utils/formatter');

const ExpenseController = {
    async renderIndex(req, res) {
        try {
            const expenses = await ExpenseService.getAllExpenses();
            const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
            res.render('pages/index', { 
                expenses, 
                total: formatter.formatCurrency(total),
                formatter 
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    async addExpense(req, res) {
        try {
            const { title, amount, category } = req.body;
            await ExpenseService.createExpense({ title, amount, category });
            res.redirect('/');
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

module.exports = ExpenseController;