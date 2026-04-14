const mongoose = require('mongoose');

const dashboardStatsSchema = new mongoose.Schema(
  {
    totalRevenue: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalProducts: {
      type: Number,
      default: 0,
    },
    totalUsers: {
      type: Number,
      default: 0,
    },
    totalProductsSold: {
      type: Number,
      default: 0,
    },
    ordersStatus: {
      pending: { type: Number, default: 0 },
      processing: { type: Number, default: 0 },
      shipped: { type: Number, default: 0 },
      delivered: { type: Number, default: 0 },
      cancelled: { type: Number, default: 0 },
    },
    topSellingProducts: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        productName: String,
        quantity: Number,
        revenue: Number,
      },
    ],
    dailyRevenue: [
      {
        date: Date,
        revenue: Number,
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DashboardStats', dashboardStatsSchema);
