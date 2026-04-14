const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        productName: String,
        productImage: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: Number,
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Calculate total price before saving
cartSchema.pre('save', function (next) {
  this.totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
