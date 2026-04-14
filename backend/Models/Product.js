const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên sản phẩm'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả'],
    },
    price: {
      type: Number,
      required: [true, 'Vui lòng nhập giá'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    category: {
      type: String,
      enum: ['CPU', 'GPU', 'RAM', 'SSD', 'HDD', 'Mainboard', 'PSU', 'Cooling', 'Case', 'Khác'],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      default: '',
    },
    images: [
      {
        type: String,
      },
    ],
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    brand: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isHot: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for search
productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
