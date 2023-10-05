const express = require('express');
const router = express.Router();
const userController = require('../controller/user/user');

router.post('/user/register',userController.REGISTER);
router.post('/user/login',userController.LOGIN);
router.post('/user/allocation',userController.BUDGET_PLANNER_ALLOCATOR);

module.exports = router;