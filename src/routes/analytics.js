const express = require('express');
const router = express.Router();
const analyticsController = require('../controller/analytics/analytics');

router.get('/analytics/analyze',analyticsController.ANALYZE);

module.exports = router;