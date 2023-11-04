const express = require('express');
const router = express.Router();
const budgetController = require('../controller/budget/budget');
const auth = require('../middleware/auth');

router.post('/budget/allocation',auth,budgetController.BUDGET_PLANNER_ALLOCATOR);
router.post('/budget/expense',auth,budgetController.EXPENSE_ALLOCATOR);
router.post('/budget/add-user',auth,budgetController.ADD_USER);
router.put('/budget/edit-budget-allocation',auth,budgetController.EDIT_BUDGET_PLANNER);
router.put('/budget/edit-budget-category',auth,budgetController.EDIT_CATEGORY_PLANNER);
router.get('/budget/get-budget-allocation',auth,budgetController.GET_BUDGET_PLANNER);
router.get('/budget/get-budget-category',auth,budgetController.GET_CATEGORY_PLANNER);
router.get('/budget/get-transactions',auth,budgetController.GET_TRANSACTION)
router.get('/budget/get-insight',auth,budgetController.GET_INSIGHT);
router.get('/budget/get-all-budget-name',auth,budgetController.GET_ALL_BUDGET_NAME);
router.get('/budget/get-all-user-included',auth,budgetController.GET_ALL_USER_INCLUDED_IN_JOINT_ACCOUNT);


module.exports = router;