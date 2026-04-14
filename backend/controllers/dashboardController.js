const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const DashboardStats = require('../models/DashboardStats');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const orders = await Order.find();
    const products = await Product.find();
    const users = await User.find();

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = users.length;

    const ordersStatus = {
      pending: orders.filter((o) => o.status === 'Pending').length,
      processing: orders.filter((o) => o.status === 'Processing').length,
      shipped: orders.filter((o) => o.status === 'Shipped').length,
      delivered: orders.filter((o) => o.status === 'Delivered').length,
      cancelled: orders.filter((o) => o.status === 'Cancelled').length,
    };

    // Get top selling products
    const topSellingProducts = [];
    const productSales = {};

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (!productSales[item.product]) {
          productSales[item.product] = { quantity: 0, revenue: 0 };
        }
        productSales[item.product].quantity += item.quantity;
        productSales[item.product].revenue += item.price * item.quantity;
      });
    });

    for (let productId in productSales) {
      topSellingProducts.push({
        productId,
        quantity: productSales[productId].quantity,
        revenue: productSales[productId].revenue,
      });
    }

    const stats = {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      ordersStatus,
      topSellingProducts: topSellingProducts.sort((a, b) => b.revenue - a.revenue).slice(0, 5),
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get revenue chart data
// @route   GET /api/dashboard/revenue
// @access  Private/Admin
exports.getRevenueData = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await Order.find({ createdAt: { $gte: startDate } });

    const revenueByDate = {};

    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!revenueByDate[date]) {
        revenueByDate[date] = 0;
      }
      revenueByDate[date] += order.totalPrice;
    });

    const chartData = Object.keys(revenueByDate)
      .sort()
      .map((date) => ({
        date,
        revenue: revenueByDate[date],
      }));

    res.status(200).json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
