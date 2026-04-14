// API endpoints
export const API_BASE_URL = 'http://localhost:5000/api';

// Product categories
export const CATEGORIES = ['CPU', 'GPU', 'RAM', 'SSD', 'HDD', 'Mainboard', 'Khác'];

// Product sorting options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'price-low', label: 'Giá thấp → cao' },
  { value: 'price-high', label: 'Giá cao → thấp' },
  { value: 'rating', label: 'Đánh giá cao' },
];

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'COD', label: 'Thanh toán khi nhận hàng' },
  { value: 'Bank Transfer', label: 'Chuyển khoản ngân hàng' },
  { value: 'Credit Card', label: 'Thẻ tín dụng' },
];

// Order status
export const ORDER_STATUS = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao hàng',
  DELIVERED: 'Đã giao hàng',
  CANCELLED: 'Đã hủy',
};

// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
};

// Employee positions
export const EMPLOYEE_POSITIONS = [
  'Bộ phận bán hàng',
  'Bộ phận kỹ thuật',
  'Bộ phận kho',
  'Bộ phận giao hàng',
  'Bộ phận hỗ trợ khách hàng',
];

// Discount types
export const DISCOUNT_TYPES = [
  { value: 'percentage', label: 'Phần trăm (%)' },
  { value: 'fixed', label: 'Số tiền cố định' },
];

// Loading messages
export const LOADING_MESSAGES = {
  DEFAULT: 'Đang tải...',
  SAVING: 'Đang lưu...',
  DELETING: 'Đang xóa...',
  LOADING_PRODUCTS: 'Đang tải sản phẩm...',
  LOADING_ORDERS: 'Đang tải đơn hàng...',
};

// Toast messages
export const TOAST_MESSAGES = {
  SUCCESS: 'Thành công!',
  ERROR: 'Lỗi!',
  WARNING: 'Cảnh báo!',
  INFO: 'Thông tin',
  ADD_TO_CART_SUCCESS: 'Đã thêm vào giỏ hàng',
  REMOVE_FROM_CART_SUCCESS: 'Đã xóa khỏi giỏ hàng',
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  LOGOUT_SUCCESS: 'Đã đăng xuất',
  REGISTER_SUCCESS: 'Đăng ký thành công',
  CHECKOUT_SUCCESS: 'Đặt hàng thành công',
  UPDATE_SUCCESS: 'Cập nhật thành công',
  DELETE_SUCCESS: 'Xóa thành công',
  INVALID_EMAIL: 'Email không hợp lệ',
  PASSWORD_MISMATCH: 'Mật khẩu không trùng khớp',
};

// Pagination
export const ITEMS_PER_PAGE = 12;
export const ITEMS_PER_PAGE_TABLE = 10;

// Shipping
export const FREE_SHIPPING_THRESHOLD = 500000; // VND
export const SHIPPING_COST = 30000; // VND
export const TAX_RATE = 0.1; // 10%

// Image dimensions
export const IMAGE_SIZES = {
  THUMBNAIL: { width: 150, height: 150 },
  CARD: { width: 300, height: 300 },
  DETAIL: { width: 500, height: 500 },
};

// Validation rules
export const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 5000,
  SEARCH_MIN_LENGTH: 1,
  SEARCH_MAX_LENGTH: 100,
};

// API timeouts (in milliseconds)
export const API_TIMEOUT = 10000;
export const API_RETRY_ATTEMPTS = 3;

// Cache durations (in minutes)
export const CACHE_DURATION = {
  PRODUCTS: 30,
  ORDERS: 5,
  USER: 60,
};
