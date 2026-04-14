const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate input
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Mật khẩu không khớp' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    }

    // Create user
    user = new User({
      name,
      email,
      password,
    });

    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' });
    }

    // Check user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    // Check if user is banned
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị ban' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city, postalCode } = req.body;

    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tìm thấy' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (city) user.city = city;
    if (postalCode) user.postalCode = postalCode;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all customers
// @route   GET /api/auth/customers
// @access  Admin
exports.getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const customers = await User.find({ role: 'customer' })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({ role: 'customer' });

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách khách hàng thành công',
      data: customers,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Ban user
// @route   PUT /api/auth/ban/:id
// @access  Admin
exports.banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'Khách hàng không tìm thấy' });
    }

    res.status(200).json({
      success: true,
      message: 'Khách hàng đã bị ban',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unban user
// @route   PUT /api/auth/unban/:id
// @access  Admin
exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'Khách hàng không tìm thấy' });
    }

    res.status(200).json({
      success: true,
      message: 'Khách hàng đã được gỡ ban',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
