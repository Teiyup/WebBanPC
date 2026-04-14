const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrder,
  getAllOrders,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');
const { validateOrder, validatePagination } = require('../middleware/validators');

router.post('/', protect, validateOrder, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.get('/', protect, adminOnly, validatePagination, getAllOrders);
router.put('/:id', protect, adminOnly, updateOrder);

module.exports = router;
