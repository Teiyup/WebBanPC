const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    description: String,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minPurchaseAmount: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number,
      default: null,
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    usagePerUser: {
      type: Number,
      default: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    expiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days later
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        usedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Voucher', voucherSchema);
