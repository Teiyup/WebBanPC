const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        productName: String,
        productImage: String,
        price: Number,
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingAddress: {
      address: String,
      fullName: String,
      phoneNumber: String,
      country: String,
    },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'Bank Transfer', 'COD'],
      default: 'COD',
    },
    paymentResult: {
      id: String,
      status: String,
      updateTime: Date,
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    voucher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voucher',
    },
    discount: {
      type: Number,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
    status: {
      type: String,
      enum: ['Pending', 'Gói Hàng', 'Đang Giao', 'Đã giao'],
      default: 'Pending',
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
