const TransactionService = require('../services/expense.service');
const formatter = require('../utils/formatter');

const TransactionController = {
    async renderIndex(req, res) {
        try {
            const { search, category } = req.query;
            const [transactions, categories] = await Promise.all([
                TransactionService.getAllTransactions({ search, category_id: category }),
                TransactionService.getAllCategories()
            ]);

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
                categories,
                filters: { search, category },
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

    async renderAnalytics(req, res) {
        try {
            const transactions = await TransactionService.getAllTransactions();

            // 1. Data for Category Chart (Expenses only)
            const categoryData = transactions
                .filter(t => t.type === 'expense')
                .reduce((acc, curr) => {
                    const catName = curr.categories?.name || 'Other';
                    acc[catName] = (acc[catName] || 0) + Number(curr.amount);
                    return acc;
                }, {});

            // 2. Data for Weekly Trend (Last 7 days)
            const dailyData = transactions.reduce((acc, curr) => {
                const date = curr.date;
                if (!acc[date]) acc[date] = { income: 0, expense: 0 };
                if (curr.type === 'income') acc[date].income += Number(curr.amount);
                else acc[date].expense += Number(curr.amount);
                return acc;
            }, {});

            res.render('pages/analytics', {
                categoryData,
                dailyData: JSON.stringify(dailyData),
                formatter
            });
        } catch (error) {
            console.error("Analytics Error:", error);
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