const supabase = require('../config/supabase');

const ExpenseService = {
    async getAllExpenses() {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async createExpense(expenseData) {
        const { data, error } = await supabase
            .from('expenses')
            .insert([expenseData]);
        if (error) throw error;
        return data;
    }
};

module.exports = ExpenseService;