const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/expense.controller');

router.get('/', TransactionController.renderIndex);
router.get('/analytics', TransactionController.renderAnalytics);
router.post('/analytics/budget', TransactionController.setBudget);
router.get('/add', TransactionController.renderAddPage);
router.post('/add', TransactionController.addTransaction);

module.exports = router;