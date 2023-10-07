const express = require('express');
const router = express.Router();
const budgetController = require('../controller/budget/budget');

router.post('/budget/allocation',budgetController.BUDGET_PLANNER_ALLOCATOR);
router.post('/budget/expense',budgetController.EXPENSE_ALLOCATOR);
router.get('/budget/get-budget-allocation',budgetController.GET_BUDGET_PLANNER);
router.get('/budget/get-transactions',budgetController.GET_TRANSACTION)
router.put('/budget/edit-budget-allocation',budgetController.EDIT_BUDGET_PLANNER);
router.get('/budget/get-transaction',budgetController.GET_TRANSACTION);

module.exports = router;