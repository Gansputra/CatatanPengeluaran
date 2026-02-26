const TransactionService = require('../services/expense.service');
const formatter = require('../utils/formatter');

const TransactionController = {
    async renderIndex(req, res) {
        try {
            const transactions = await TransactionService.getAllTransactions();

            // Hitung total (Income - Expense)
            const stats = transactions.reduce((acc, curr) => {
                if (curr.type === 'income') {
                    acc.income += Number(curr.amount);
                } else {
                    acc.expense += Number(curr.amount);
                }
                return acc;
            }, { income: 0, expense: 0 });

            res.render('pages/index', {
                transactions,
                stats: {
                    income: formatter.formatCurrency(stats.income),
                    expense: formatter.formatCurrency(stats.expense),
                    balance: formatter.formatCurrency(stats.income - stats.expense)
                },
                formatter
            });
        } catch (error) {
            console.error("Index Error:", error);
            res.status(500).send(error.message);
        }
    },

    async renderAddPage(req, res) {
        try {
            const categories = await TransactionService.getAllCategories();
            res.render('pages/add', { categories });
        } catch (error) {
            console.error("Add Page Error:", error);
            res.status(500).send(error.message);
        }
    },

    async addTransaction(req, res) {
        try {
            const { amount, type, category_id, note, date } = req.body;
            await TransactionService.createTransaction({ amount, type, category_id, note, date });
            res.redirect('/');
        } catch (error) {
            console.error("Add Error:", error);
            res.status(500).send(error.message);
        }
    }
};

module.exports = TransactionController;