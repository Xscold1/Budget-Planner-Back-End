const express = require('express');
const router = express.Router();
const budgetController = require('../controller/budget/budget');
const auth = require('../middleware/auth');

router.post('/budget/allocation',budgetController.BUDGET_PLANNER_ALLOCATOR);
router.post('/budget/expense',budgetController.EXPENSE_ALLOCATOR);
router.post('/budget/add-user',budgetController.ADD_USER);
router.put('/budget/edit-budget-allocation',budgetController.EDIT_BUDGET_PLANNER);
router.put('/budget/edit-budget-category',budgetController.EDIT_CATEGORY_PLANNER);
router.put('/budget/delete-user-from-budget',budgetController.DELETE_USER_FROM_BUDGET);
router.put('/budget/delete-category',budgetController.DELETE_CATEGORY);
router.get('/budget/get-budget-allocation',budgetController.GET_BUDGET_PLANNER);
router.get('/budget/get-budget-category',budgetController.GET_CATEGORY_PLANNER);
router.get('/budget/get-transactions',budgetController.GET_TRANSACTION)
router.get('/budget/get-insight',budgetController.GET_INSIGHT);
router.get('/budget/get-all-budget-name',budgetController.GET_ALL_BUDGET_NAME);
router.get('/budget/get-all-user-included',budgetController.GET_ALL_USER_INCLUDED_IN_JOINT_ACCOUNT);

module.exports = router; 