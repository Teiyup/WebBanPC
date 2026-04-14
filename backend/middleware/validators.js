// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  if (!phone) return true; // Optional field
  return /^(\+84|0)[1-9]\d{1,13}$/.test(phone);
};

const validatePhoneForOrder = (phone) => {
  // For orders, phone is required and must be valid format
  return /^(\+84|0)[1-9]\d{1,13}$/.test(phone);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validatePostalCode = (code) => {
  if (!code) return true; // Optional
  return /^\d{5,6}$/.test(code);
};

// Authentication validators
exports.validateRegister = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Tên phải có ít nhất 2 ký tự';
  }

  if (!email || !validateEmail(email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!password || !validatePassword(password)) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Mật khẩu không trùng khớp';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email || !validateEmail(email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!password || !validatePassword(password)) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

exports.validateUpdateProfile = (req, res, next) => {
  const { email, phone, address, city, postalCode } = req.body;
  const errors = {};

  if (email && !validateEmail(email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (phone && !validatePhone(phone)) {
    errors.phone = 'Số điện thoại không hợp lệ';
  }

  if (postalCode && !validatePostalCode(postalCode)) {
    errors.postalCode = 'Mã bưu điện phải có 5-6 chữ số';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

// Product validators
exports.validateProduct = (req, res, next) => {
  const { name, description, price, stock, category, brand } = req.body;
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Tên sản phẩm phải có ít nhất 2 ký tự';
  }

  if (!description || description.trim().length < 5) {
    errors.description = 'Mô tả phải có ít nhất 5 ký tự';
  }

  if (!price || isNaN(Number(price)) || Number(price) <= 0) {
    errors.price = 'Giá phải là số dương';
  }

  if (stock === undefined || stock === '' || isNaN(Number(stock)) || Number(stock) < 0) {
    errors.stock = 'Số lượng phải là số không âm';
  }

  if (!category || category.trim().length === 0) {
    errors.category = 'Danh mục không được để trống';
  }

  if (!brand || brand.trim().length < 2) {
    errors.brand = 'Thương hiệu phải có ít nhất 2 ký tự';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

// Order validators
exports.validateOrder = (req, res, next) => {
  const { orderItems } = req.body;
  const errors = {};

  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    errors.orderItems = 'Giỏ hàng không được trống';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

// Voucher validators
exports.validateVoucher = (req, res, next) => {
  const { code, discountType, discountValue } = req.body;
  const errors = {};

  if (!code || code.trim().length < 3) {
    errors.code = 'Mã voucher phải có ít nhất 3 ký tự';
  }

  if (!discountType || !['percentage', 'fixed'].includes(discountType)) {
    errors.discountType = 'Loại giảm giá không hợp lệ';
  }

  if (!discountValue || isNaN(discountValue) || Number(discountValue) <= 0) {
    errors.discountValue = 'Giá trị giảm phải là số dương';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

// Cart validators
exports.validateAddToCart = (req, res, next) => {
  const { productId, quantity } = req.body;
  const errors = {};

  if (!productId || productId.trim().length === 0) {
    errors.productId = 'ID sản phẩm không được để trống';
  }

  if (!quantity || isNaN(quantity) || Number(quantity) < 1) {
    errors.quantity = 'Số lượng phải là số dương';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

exports.validateUpdateCartQuantity = (req, res, next) => {
  const { quantity } = req.body;
  const errors = {};

  if (!quantity || isNaN(quantity) || Number(quantity) < 1) {
    errors.quantity = 'Số lượng phải là số dương';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

// Employee validators
exports.validateEmployee = (req, res, next) => {
  const { name, email, phone, position, salary } = req.body;
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Tên nhân viên phải có ít nhất 2 ký tự';
  }

  if (!email || !validateEmail(email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!validatePhone(phone)) {
    errors.phone = 'Số điện thoại không hợp lệ';
  }

  if (!position || position.trim().length === 0) {
    errors.position = 'Vị trí không được để trống';
  }

  if (!salary || salary === '' || isNaN(Number(salary)) || Number(salary) < 0) {
    errors.salary = 'Mức lương phải là số không âm';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

// Query validators
exports.validatePagination = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  if (isNaN(page) || Number(page) < 1) {
    return res.status(400).json({ 
      success: false, 
      message: 'Trang phải là số dương' 
    });
  }

  if (isNaN(limit) || Number(limit) < 1 || Number(limit) > 100) {
    return res.status(400).json({ 
      success: false, 
      message: 'Limit phải là số từ 1 đến 100' 
    });
  }

  next();
};

// Sanitize input
exports.sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
};
