// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Phone validation (Vietnamese phone numbers)
export const validatePhone = (phone) => {
  const phoneRegex = /^(\+84|0)[1-9]\d{1,13}$/;
  return phoneRegex.test(phone);
};

// Not empty validation
export const validateRequired = (value) => {
  return value && String(value).trim().length > 0;
};

// Min length validation
export const validateMinLength = (value, minLength) => {
  return value && String(value).length >= minLength;
};

// Max length validation
export const validateMaxLength = (value, maxLength) => {
  return value && String(value).length <= maxLength;
};

// Number validation
export const validateNumber = (value) => {
  return !isNaN(value) && Number(value) >= 0;
};

// Postal code validation (Vietnam format: 5-6 digits)
export const validatePostalCode = (code) => {
  return /^\d{5,6}$/.test(code);
};

// Validate login form
export const validateLoginForm = (email, password) => {
  const errors = {};
  
  if (!validateRequired(email)) {
    errors.email = 'Email không được để trống';
  } else if (!validateEmail(email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!validateRequired(password)) {
    errors.password = 'Mật khẩu không được để trống';
  } else if (!validatePassword(password)) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  return errors;
};

// Validate register form
export const validateRegisterForm = (name, email, password, confirmPassword) => {
  const errors = {};

  if (!validateRequired(name)) {
    errors.name = 'Tên không được để trống';
  } else if (!validateMinLength(name, 2)) {
    errors.name = 'Tên phải có ít nhất 2 ký tự';
  }

  if (!validateRequired(email)) {
    errors.email = 'Email không được để trống';
  } else if (!validateEmail(email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!validateRequired(password)) {
    errors.password = 'Mật khẩu không được để trống';
  } else if (!validatePassword(password)) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  if (!validateRequired(confirmPassword)) {
    errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Mật khẩu không trùng khớp';
  }

  return errors;
};

// Validate checkout form
export const validateCheckoutForm = (form) => {
  const errors = {};

  if (!form.paymentMethod) {
    errors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
  }

  return errors;
};

// Validate product form
export const validateProductForm = (form) => {
  const errors = {};

  if (!validateRequired(form.name)) {
    errors.name = 'Tên sản phẩm không được để trống';
  }

  if (!validateRequired(form.price)) {
    errors.price = 'Giá không được để trống';
  } else if (!validateNumber(form.price) || Number(form.price) <= 0) {
    errors.price = 'Giá phải là số dương';
  }

  if (!validateRequired(form.stock)) {
    errors.stock = 'Số lượng không được để trống';
  } else if (!validateNumber(form.stock) || Number(form.stock) < 0) {
    errors.stock = 'Số lượng phải là số không âm';
  }

  return errors;
};
