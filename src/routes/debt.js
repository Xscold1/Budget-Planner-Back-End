const express = require('express');
const router = express.Router();
const debtController = require('../controller/debt/debt');
const auth = require('../middleware/auth');

router.post('/debt/receive-pay',auth,debtController.RECEIVE_AND_PAY);
router.post('/debt/borrow-lend',auth,debtController.BORROW_AND_LEND);
router.get('/debt/get-payments-history',auth,debtController.GET_PAYMENTS);
router.get('/debt/get-lend-list',auth,debtController.GET_LEND_LISTS);

module.exports = router;