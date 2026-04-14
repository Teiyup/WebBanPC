// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Get proper image URL (handles both uploaded files and external URLs)
export const getImageUrl = (imagePath, placeholder = 'https://via.placeholder.com/200') => {
  if (!imagePath) {
    return placeholder;
  }
  // If it's already a full URL (starts with http), return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  // Otherwise, construct URL from backend uploads
  return `http://localhost:5000/${imagePath}`;
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// Format price without currency symbol
export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

// Get error message from API response
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Đã xảy ra lỗi, vui lòng thử lại';
};

// Local storage helper
export const storage = {
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  },
};

// Check if user is admin
export const isAdmin = (user) => {
  return user && user.role === 'admin';
};

// Check if user is customer
export const isCustomer = (user) => {
  return user && user.role === 'customer';
};

// Format date
export const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

// Calculate discount
export const calculateDiscount = (originalPrice, discountedPrice) => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

// Memoize function (simple implementation)
export const memoize = (func) => {
  const cache = {};
  return (...args) => {
    const key = JSON.stringify(args);
    if (key in cache) {
      return cache[key];
    }
    const result = func(...args);
    cache[key] = result;
    return result;
  };
};
