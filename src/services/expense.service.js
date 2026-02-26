const supabase = require('../config/supabase');

const TransactionService = {
    async getAllTransactions() {
        const { data, error } = await supabase
            .from('transactions')
            .select('*, categories(name, icon, color)')
            .order('date', { ascending: false });
        if (error) throw error;
        return data;
    },

    async getTransactionById(id) {
        const { data, error } = await supabase
            .from('transactions')
            .select('*, categories(name, icon, color)')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async createTransaction(transactionData) {
        // transactionData: { amount, type, category_id, note, date }
        const { data, error } = await supabase
            .from('transactions')
            .insert([transactionData])
            .select();
        if (error) throw error;
        return data;
    },

    async updateTransaction(id, updateData) {
        const { data, error } = await supabase
            .from('transactions')
            .update(updateData)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data;
    },

    async deleteTransaction(id) {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    async getAllCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });
        if (error) throw error;
        return data;
    }
};

module.exports = TransactionService;