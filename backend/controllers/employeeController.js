const Employee = require('../models/Employee');

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const employees = await Employee.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Employee.countDocuments();

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách nhân viên thành công',
      data: employees,
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

// Get single employee
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Nhân viên không tìm thấy' });
    }
    res.status(200).json({
      success: true,
      message: 'Lấy thông tin nhân viên thành công',
      data: employee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, phone, position, salary, address } = req.body;

    if (!name || !email || !phone || !position || !salary) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
    }

    // Check if email exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ success: false, message: 'Email nhân viên đã tồn tại' });
    }

    const employee = new Employee({
      name,
      email,
      phone,
      position,
      salary,
      address,
    });

    await employee.save();

    res.status(201).json({
      success: true,
      message: 'Thêm nhân viên thành công',
      data: employee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { name, email, phone, position, salary, status, address } = req.body;

    let employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Nhân viên không tìm thấy' });
    }

    // Check if email already exists with another employee
    if (email !== employee.email) {
      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee) {
        return res.status(400).json({ success: false, message: 'Email nhân viên đã tồn tại' });
      }
    }

    employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, position, salary, status, address },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Cập nhật nhân viên thành công',
      data: employee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Nhân viên không tìm thấy' });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa nhân viên thành công',
      data: employee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
