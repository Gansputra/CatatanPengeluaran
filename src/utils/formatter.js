module.exports = {
    formatCurrency: (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(value);
    },
    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID');
    }
};