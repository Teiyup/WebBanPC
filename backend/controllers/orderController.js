const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, voucher } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có sản phẩm trong đơn hàng' });
    }

    // Calculate prices
    let itemsPrice = 0;
    for (let item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Sản phẩm không tìm thấy' });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Sản phẩm ${product.name} không đủ hàng (Hiện có: ${product.stock})` });
      }
      itemsPrice += product.price * item.quantity;
    }

    const shippingPrice = itemsPrice > 500000 ? 0 : 30000;
    const taxPrice = itemsPrice * 0.1; // 10% tax
    let totalPrice = itemsPrice + shippingPrice + taxPrice;

    let discount = 0;
    if (voucher) {
      // Handle voucher logic
      discount = totalPrice * 0.1; // 10% discount
      totalPrice -= discount;
    }

    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      discount,
      voucher,
      status: 'Pending',
      isPaid: false,
    });

    await order.save();

    // Reduce stock
    for (let item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('orderItems.product')
      .populate('user');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Đơn hàng không tìm thấy' });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrder = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Đơn hàng không tìm thấy' });
    }

    const { status, isPaid, isDelivered, notes } = req.body;

    if (status) order.status = status;
    if (isPaid !== undefined) {
      order.isPaid = isPaid;
      if (isPaid) order.paidAt = new Date();
    }
    if (isDelivered !== undefined) {
      order.isDelivered = isDelivered;
      if (isDelivered) order.deliveredAt = new Date();
    }
    if (notes) order.notes = notes;

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật đơn hàng thành công',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status && status !== 'All') {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('user')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
