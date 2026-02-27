const supabase = require('../config/supabase');

const TransactionService = {
    async getAllTransactions(filters = {}) {
        let query = supabase
            .from('transactions')
            .select('*, categories(name, icon, color)')
            .order('date', { ascending: false });

        if (filters.search) {
            query = query.ilike('note', `%${filters.search}%`);
        }

        if (filters.category_id) {
            query = query.eq('category_id', filters.category_id);
        }

        const { data, error } = await query;
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
    },

    async getAllBudgets() {
        const { data, error } = await supabase
            .from('budgets')
            .select('*, categories(name, icon, color)');
        if (error) throw error;
        return data;
    },

    async upsertBudget(budgetData) {
        // budgetData: { category_id, amount_limit, month_year }

        // 1. Check if budget already exists for this category/month
        const { data: existing } = await supabase
            .from('budgets')
            .select('id')
            .eq('category_id', budgetData.category_id)
            .eq('month_year', budgetData.month_year)
            .single();

        if (existing) {
            // Update
            const { data, error } = await supabase
                .from('budgets')
                .update({ amount_limit: budgetData.amount_limit })
                .eq('id', existing.id)
                .select();
            if (error) throw error;
            return data;
        } else {
            // Insert
            const { data, error } = await supabase
                .from('budgets')
                .insert([budgetData])
                .select();
            if (error) throw error;
            return data;
        }
    }
};

module.exports = TransactionService;