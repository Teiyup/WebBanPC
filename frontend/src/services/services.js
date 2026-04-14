import apiClient from './api';

export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  getAllCustomers: (params) => apiClient.get('/auth/customers', { params }),
  banUser: (id) => apiClient.put(`/auth/ban/${id}`),
  unbanUser: (id) => apiClient.put(`/auth/unban/${id}`),
};

export const productService = {
  getAllProducts: (params) => apiClient.get('/products', { params }),
  getHotProducts: () => apiClient.get('/products/hot'),
  getNewProducts: () => apiClient.get('/products/new'),
  getProduct: (id) => apiClient.get(`/products/${id}`),
  createProduct: (data) => apiClient.post('/products', data),
  updateProduct: (id, data) => apiClient.put(`/products/${id}`, data),
  deleteProduct: (id) => apiClient.delete(`/products/${id}`),
};

export const orderService = {
  createOrder: (data) => apiClient.post('/orders', data),
  getMyOrders: () => apiClient.get('/orders/my-orders'),
  getOrder: (id) => apiClient.get(`/orders/${id}`),
  getAllOrders: (params) => apiClient.get('/orders', { params }),
  updateOrder: (id, data) => apiClient.put(`/orders/${id}`, data),
};

export const voucherService = {
  getAllVouchers: () => apiClient.get('/vouchers'),
  verifyVoucher: (data) => apiClient.post('/vouchers/verify', data),
  createVoucher: (data) => apiClient.post('/vouchers', data),
  updateVoucher: (id, data) => apiClient.put(`/vouchers/${id}`, data),
  deleteVoucher: (id) => apiClient.delete(`/vouchers/${id}`),
};

export const cartService = {
  getCart: () => apiClient.get('/cart'),
  addToCart: (data) => apiClient.post('/cart', data),
  updateQuantity: (productId, data) => apiClient.put(`/cart/${productId}`, data),
  removeFromCart: (productId) => apiClient.delete(`/cart/${productId}`),
  clearCart: () => apiClient.delete('/cart'),
};

export const employeeService = {
  getAllEmployees: (params) => apiClient.get('/employees', { params }),
  getEmployee: (id) => apiClient.get(`/employees/${id}`),
  createEmployee: (data) => apiClient.post('/employees', data),
  updateEmployee: (id, data) => apiClient.put(`/employees/${id}`, data),
  deleteEmployee: (id) => apiClient.delete(`/employees/${id}`),
};

export const dashboardService = {
  getDashboardStats: () => apiClient.get('/dashboard/stats'),
  getRevenueData: (params) => apiClient.get('/dashboard/revenue', { params }),
};
