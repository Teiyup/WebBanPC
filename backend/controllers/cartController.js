const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          items: [],
          totalPrice: 0,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add/Update items in cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp productId và số lượng hợp lệ',
      });
    }

    // Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tìm thấy' });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Không đủ hàng. Còn lại: ${product.stock}`,
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        productName: product.name,
        productImage: product.image,
        quantity,
        price: product.price,
      });
    }

    await cart.save();

    // Populate product details
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Đã thêm vào giỏ hàng',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng phải lớn hơn 0',
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Giỏ hàng không tìm thấy' });
    }

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không có trong giỏ' });
    }

    // Check product stock
    const product = await Product.findById(productId);
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Không đủ hàng. Còn lại: ${product.stock}`,
      });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật số lượng thành công',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Giỏ hàng không tìm thấy' });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Xóa khỏi giỏ hàng thành công',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Giỏ hàng không tìm thấy' });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Giỏ hàng đã được xóa',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
