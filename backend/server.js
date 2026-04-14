require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/vouchers', require('./routes/voucherRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Không tìm thấy API endpoint' });
});

// Error handling middleware (MUST be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
