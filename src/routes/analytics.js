const express = require('express');
const router = express.Router();
const analyticsController = require('../controller/analytics/analytics');
const auth = require('../middleware/auth');

router.get('/analytics/analyze',analyticsController.ANALYZE);

module.exports = router;