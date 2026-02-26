const supabase = require('../config/supabase');

const ExpenseService = {
    async getAllExpenses() {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .order('date', { ascending: false });
        if (error) throw error;
        return data;
    },

    async getExpenseById(id) {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async createExpense(expenseData) {
        // expenseData: { amount, category, note, date }
        const { data, error } = await supabase
            .from('expenses')
            .insert([expenseData])
            .select();
        if (error) throw error;
        return data;
    },

    async updateExpense(id, updateData) {
        const { data, error } = await supabase
            .from('expenses')
            .update(updateData)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data;
    },

    async deleteExpense(id) {
        const { error } = await supabase
            .from('expenses')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }
};

module.exports = ExpenseService;