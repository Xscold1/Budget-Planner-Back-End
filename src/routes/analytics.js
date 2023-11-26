const express = require('express');
const router = express.Router();
const analyticsController = require('../controller/analytics/analytics');
const auth = require('../middleware/auth');

router.get('/analytics/analyze',analyticsController.ANALYZE);
router.get('/analytics/compare-expense',analyticsController.COMPARE_EXPENSES);

module.exports = router;