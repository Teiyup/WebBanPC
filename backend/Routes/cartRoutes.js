const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateQuantity, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const { validateAddToCart, validateUpdateCartQuantity } = require('../middleware/validators');

router.get('/', protect, getCart);
router.post('/', protect, validateAddToCart, addToCart);
router.put('/:productId', protect, validateUpdateCartQuantity, updateQuantity);
router.delete('/:productId', protect, removeFromCart);
router.delete('/', protect, clearCart);

module.exports = router;
