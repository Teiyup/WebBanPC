const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, sortBy, page = 1, limit = 12 } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'rating':
        sort = { rating: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get hot products
// @route   GET /api/products/hot
// @access  Public
exports.getHotProducts = async (req, res) => {
  try {
    const products = await Product.find({ isHot: true }).limit(10);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get new products
// @route   GET /api/products/new
// @access  Public
exports.getNewProducts = async (req, res) => {
  try {
    const products = await Product.find({ isNew: true })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tìm thấy' });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, brand, discount } = req.body;

    let product = new Product({
      name,
      description,
      price,
      category,
      stock,
      brand,
      discount,
      image: req.file ? req.file.filename : '',
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tìm thấy' });
    }

    // Update fields
    const { name, description, price, category, stock, brand, discount, isHot, isNew } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.stock = stock;
    if (brand) product.brand = brand;
    if (discount !== undefined) product.discount = discount;
    if (isHot !== undefined) product.isHot = isHot;
    if (isNew !== undefined) product.isNew = isNew;
    if (req.file) product.image = req.file.filename;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tìm thấy' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Xóa sản phẩm thành công',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
