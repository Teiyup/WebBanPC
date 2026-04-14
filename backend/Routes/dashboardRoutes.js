const express = require('express');
const router = express.Router();
const { getDashboardStats, getRevenueData } = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/revenue', protect, adminOnly, getRevenueData);

module.exports = router;
