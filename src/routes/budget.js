const express = require('express');
const router = express.Router();
const budgetController = require('../controller/budget/budget');

router.post('/budget/allocation',budgetController.BUDGET_PLANNER_ALLOCATOR);
router.post('/budget/expense',budgetController.EXPENSE_ALLOCATOR);

module.exports = router;