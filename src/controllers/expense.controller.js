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
            const [transactions, budgets, categories] = await Promise.all([
                TransactionService.getAllTransactions(),
                TransactionService.getAllBudgets(),
                TransactionService.getAllCategories()
            ]);

            // Get current month and year for filtering
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            // 1. Data for Budget Tracking (Current Month Expenses)
            const budgetMonthYear = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;

            const currentMonthBudgets = budgets.filter(b => b.month_year === budgetMonthYear);

            const monthlyCategorySpending = transactions
                .filter(t => {
                    const tDate = new Date(t.date);
                    return t.type === 'expense' &&
                        tDate.getMonth() === currentMonth &&
                        tDate.getFullYear() === currentYear;
                })
                .reduce((acc, curr) => {
                    const catId = curr.category_id;
                    acc[catId] = (acc[catId] || 0) + Number(curr.amount);
                    return acc;
                }, {});

            // Map budgets with current spending
            const budgetData = currentMonthBudgets.map(b => ({
                id: b.id,
                categoryName: b.categories?.name || 'Other',
                categoryIcon: b.categories?.icon || 'tag',
                categoryColor: b.categories?.color || '#64748b',
                limit: Number(b.amount_limit),
                spent: monthlyCategorySpending[b.category_id] || 0
            }));

            // 2. Data for Weekly Trend (Keep it for context or future use if needed, but primarily budget focus now)
            const dailyData = transactions.reduce((acc, curr) => {
                const date = curr.date;
                if (!acc[date]) acc[date] = { income: 0, expense: 0 };
                if (curr.type === 'income') acc[date].income += Number(curr.amount);
                else acc[date].expense += Number(curr.amount);
                return acc;
            }, {});

            res.render('pages/analytics', {
                budgetData,
                categories: categories.filter(c => c.name !== 'Salary'),
                dailyData: JSON.stringify(dailyData),
                formatter
            });
        } catch (error) {
            console.error("Analytics Error:", error);
            res.status(500).send(error.message);
        }
    },

    async setBudget(req, res) {
        try {
            const { category_id, amount_limit } = req.body;
            const now = new Date();
            const month_year = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

            await TransactionService.upsertBudget({
                category_id,
                amount_limit,
                month_year
            });

            res.redirect('/analytics');
        } catch (error) {
            console.error("Set Budget Error:", error);
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