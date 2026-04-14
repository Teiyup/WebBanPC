const Voucher = require('../models/Voucher');

// @desc    Get all vouchers
// @route   GET /api/vouchers
// @access  Public
exports.getAllVouchers = async (req, res) => {
  try {
    // For admin panel - show all vouchers
    // For public - show only active and not expired
    const vouchers = await Voucher.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: vouchers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify voucher code
// @route   POST /api/vouchers/verify
// @access  Public
exports.verifyVoucher = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    const voucher = await Voucher.findOne({ code: code.toUpperCase() });

    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Mã giảm giá không hợp lệ' });
    }

    if (!voucher.isActive) {
      return res.status(400).json({ success: false, message: 'Mã giảm giá không còn hoạt động' });
    }

    if (new Date() > voucher.expiryDate) {
      return res.status(400).json({ success: false, message: 'Mã giảm giá đã hết hạn' });
    }

    if (totalAmount < voucher.minPurchaseAmount) {
      return res.status(400).json({ 
        success: false, 
        message: `Đơn tối thiểu ${voucher.minPurchaseAmount}` 
      });
    }

    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      return res.status(400).json({ success: false, message: 'Mã giảm giá đã hết lượt sử dụng' });
    }

    let discount = 0;
    if (voucher.discountType === 'percentage') {
      discount = totalAmount * (voucher.discountValue / 100);
      if (voucher.maxDiscount) {
        discount = Math.min(discount, voucher.maxDiscount);
      }
    } else {
      discount = voucher.discountValue;
    }

    res.status(200).json({
      success: true,
      message: 'Mã giảm giá hợp lệ',
      data: {
        voucherId: voucher._id,
        discount,
        finalAmount: totalAmount - discount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create voucher (Admin)
// @route   POST /api/vouchers
// @access  Private/Admin
exports.createVoucher = async (req, res) => {
  try {
    const { code, discountType, discountValue, minPurchaseAmount, expiryDate, usageLimit } = req.body;

    let voucher = new Voucher({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minPurchaseAmount,
      expiryDate,
      usageLimit,
    });

    await voucher.save();

    res.status(201).json({
      success: true,
      message: 'Tạo mã giảm giá thành công',
      data: voucher,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update voucher (Admin)
// @route   PUT /api/vouchers/:id
// @access  Private/Admin
exports.updateVoucher = async (req, res) => {
  try {
    let voucher = await Voucher.findById(req.params.id);

    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Mã giảm giá không tìm thấy' });
    }

    const { code, discountType, discountValue, minPurchaseAmount, expiryDate, isActive, usageLimit } = req.body;

    if (code) voucher.code = code.toUpperCase();
    if (discountType) voucher.discountType = discountType;
    if (discountValue !== undefined) voucher.discountValue = discountValue;
    if (minPurchaseAmount !== undefined) voucher.minPurchaseAmount = minPurchaseAmount;
    if (expiryDate) voucher.expiryDate = expiryDate;
    if (isActive !== undefined) voucher.isActive = isActive;
    if (usageLimit !== undefined) voucher.usageLimit = usageLimit;

    await voucher.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật mã giảm giá thành công',
      data: voucher,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete voucher (Admin)
// @route   DELETE /api/vouchers/:id
// @access  Private/Admin
exports.deleteVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);

    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Mã giảm giá không tìm thấy' });
    }

    await Voucher.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Xóa mã giảm giá thành công',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
