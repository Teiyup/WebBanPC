const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getHotProducts,
  getNewProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateProduct, validatePagination } = require('../middleware/validators');

router.get('/', validatePagination, getAllProducts);
router.get('/hot', getHotProducts);
router.get('/new', getNewProducts);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, upload.single('image'), validateProduct, createProduct);
router.put('/:id', protect, adminOnly, upload.single('image'), validateProduct, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
