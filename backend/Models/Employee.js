const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên nhân viên'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Vui lòng nhập email hợp lệ'],
    },
    phone: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      enum: ['Bộ phận bán hàng', 'Kỹ sư', 'Marketing', 'Kế toán', 'Quản lý kho', 'Khác'],
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Hoạt động', 'Tạm dừng', 'Nghỉ việc'],
      default: 'Hoạt động',
    },
    address: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
