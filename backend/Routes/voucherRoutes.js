const express = require('express');
const router = express.Router();
const {
  getAllVouchers,
  verifyVoucher,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} = require('../controllers/voucherController');
const { protect, adminOnly } = require('../middleware/auth');
const { validateVoucher } = require('../middleware/validators');

router.get('/', getAllVouchers);
router.post('/verify', verifyVoucher);
router.post('/', protect, adminOnly, validateVoucher, createVoucher);
router.put('/:id', protect, adminOnly, validateVoucher, updateVoucher);
router.delete('/:id', protect, adminOnly, deleteVoucher);

module.exports = router;
