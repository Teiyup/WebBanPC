require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const addAdminAccount = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'toastier@pcshop.com' });
    if (existingAdmin) {
      console.log('❌ Tài khoản admin Toastier đã tồn tại!');
      process.exit(0);
    }

    // Create new admin account
    const admin = new User({
      name: 'Toastier',
      email: 'toastier@pcshop.com',
      password: '123456',
      role: 'admin',
      phone: '+84 987 654 321',
      address: 'Quản lý hệ thống',
      city: 'TP. Hồ Chí Minh'
    });

    await admin.save();

    console.log('✅ Tài khoản admin đã được tạo thành công!');
    console.log('📧 Email: toastier@pcshop.com');
    console.log('🔐 Mật khẩu: 123456');
    console.log('👤 Tên: Toastier');
    console.log('🔑 Role: admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
};

addAdminAccount();
