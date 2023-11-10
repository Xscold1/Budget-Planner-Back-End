const express = require('express');
const router = express.Router();
const debtController = require('../controller/debt/debt');
const auth = require('../middleware/auth');

router.post('/debt/receive-pay',debtController.RECEIVE_AND_PAY);
router.post('/debt/borrow-lend',debtController.BORROW_AND_LEND);
router.get('/debt/get-payments-history',debtController.GET_PAYMENTS);
router.get('/debt/get-lend-list',debtController.GET_LEND_LISTS);

module.exports = router;