import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Table, Form, Button, Alert, Modal } from 'react-bootstrap';
import { dashboardService, productService, orderService, voucherService, employeeService, authService } from '../services/services';
import EmptyState from '../components/EmptyState';
import { showSuccess, showError } from '../utils/toast';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'CPU',
    stock: '',
    brand: '',
  });
  const [productImage, setProductImage] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState('');
  const [productLoading, setProductLoading] = useState(false);

  // Voucher modal
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [voucherForm, setVoucherForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchaseAmount: '',
    maxDiscount: '',
    usageLimit: '',
    expiryDate: '',
  });
  const [voucherLoading, setVoucherLoading] = useState(false);

  // Employee modal
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: 'Bộ phận bán hàng',
    salary: '',
    address: '',
  });
  const [employeeLoading, setEmployeeLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes, productsRes, customersRes, employeesRes, vouchersRes] = await Promise.all([
          dashboardService.getDashboardStats(),
          orderService.getAllOrders({}),
          productService.getAllProducts({}),
          authService.getAllCustomers(),
          employeeService.getAllEmployees(),
          voucherService.getAllVouchers(),
        ]);
        setStats(statsRes.data.data);
        setOrders(ordersRes.data.data);
        setProducts(productsRes.data.data);
        setCustomers(customersRes.data.data);
        setEmployees(employeesRes.data.data);
        setVouchers(vouchersRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      brand: product.brand,
    });
    if (product.image) {
      setProductImagePreview(`http://localhost:5000/${product.image}`);
    }
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await productService.deleteProduct(productId);
      showSuccess('Sản phẩm đã được xóa thành công!');
      const res = await productService.getAllProducts({});
      setProducts(res.data.data);
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductLoading(true);
    try {
      if (editingProductId) {
        // Update product
        // If there's a new image, send FormData; otherwise send JSON
        if (productImage) {
          const formData = new FormData();
          formData.append('name', productForm.name);
          formData.append('description', productForm.description);
          formData.append('price', parseInt(productForm.price));
          formData.append('stock', parseInt(productForm.stock));
          formData.append('category', productForm.category);
          formData.append('brand', productForm.brand);
          formData.append('image', productImage);
          await productService.updateProduct(editingProductId, formData);
        } else {
          // Send JSON when no new image
          await productService.updateProduct(editingProductId, {
            name: productForm.name,
            description: productForm.description,
            price: parseInt(productForm.price),
            stock: parseInt(productForm.stock),
            category: productForm.category,
            brand: productForm.brand,
          });
        }
        showSuccess('Sản phẩm đã được cập nhật thành công!');
      } else {
        // Create new product - always use FormData
        const formData = new FormData();
        formData.append('name', productForm.name);
        formData.append('description', productForm.description);
        formData.append('price', parseInt(productForm.price));
        formData.append('stock', parseInt(productForm.stock));
        formData.append('category', productForm.category);
        formData.append('brand', productForm.brand);
        if (productImage) {
          formData.append('image', productImage);
        }
        await productService.createProduct(formData);
        showSuccess('Sản phẩm đã được thêm thành công!');
      }

      setShowProductModal(false);
      setEditingProductId(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: 'CPU',
        stock: '',
        brand: '',
      });
      setProductImage(null);
      setProductImagePreview('');
      // Reload products
      const res = await productService.getAllProducts({});
      setProducts(res.data.data);
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    } finally {
      setProductLoading(false);
    }
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setEditingProductId(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'CPU',
      stock: '',
      brand: '',
    });
    setProductImage(null);
    setProductImagePreview('');
  };

  const handleAddVoucher = async (e) => {
    e.preventDefault();
    setVoucherLoading(true);
    try {
      await voucherService.createVoucher({
        ...voucherForm,
        discountValue: parseInt(voucherForm.discountValue),
        minPurchaseAmount: parseInt(voucherForm.minPurchaseAmount) || 0,
        maxDiscount: parseInt(voucherForm.maxDiscount) || 0,
        usageLimit: parseInt(voucherForm.usageLimit),
      });
      showSuccess('Voucher đã được thêm thành công!');
      setShowVoucherModal(false);
      setVoucherForm({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minPurchaseAmount: '',
        maxDiscount: '',
        usageLimit: '',
        expiryDate: '',
      });
    } catch (error) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleDeleteVoucher = async (voucherId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa voucher này?')) return;
    try {
      await voucherService.deleteVoucher(voucherId);
      showSuccess('Voucher đã được xóa thành công!');
      // Reload vouchers
      const res = await voucherService.getAllVouchers();
      setVouchers(res.data.data);
    } catch (error) {
      showError('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleBanCustomer = async (customerId) => {
    if (!window.confirm('Bạn chắc chắn muốn ban khách hàng này?')) return;
    try {
      await authService.banUser(customerId);
      showSuccess('Khách hàng đã bị ban!');
      // Reload customers
      const res = await authService.getAllCustomers({});
      setCustomers(res.data.data);
    } catch (error) {
      showError('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUnbanCustomer = async (customerId) => {
    if (!window.confirm('Bạn chắc chắn muốn gỡ ban cho khách hàng này?')) return;
    try {
      await authService.unbanUser(customerId);
      showSuccess('Khách hàng đã được gỡ ban!');
      // Reload customers
      const res = await authService.getAllCustomers({});
      setCustomers(res.data.data);
    } catch (error) {
      showError('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setEmployeeLoading(true);
    try {
      await employeeService.createEmployee({
        ...employeeForm,
        salary: parseInt(employeeForm.salary),
      });
      showSuccess('Nhân viên đã được thêm thành công!');
      setShowEmployeeModal(false);
      setEmployeeForm({
        name: '',
        email: '',
        phone: '',
        position: 'Bộ phận bán hàng',
        salary: '',
        address: '',
      });
      // Reload employees
      const res = await employeeService.getAllEmployees();
      setEmployees(res.data.data);
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    } finally {
      setEmployeeLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrder(orderId, { status: newStatus });
      showSuccess('Trạng thái đơn hàng đã được cập nhật!');
      // Reload orders
      const res = await orderService.getAllOrders({});
      setOrders(res.data.data);
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  if (loading) return <Container className="py-5">Đang tải...</Container>;

  return (
    <Container className="py-5">
      <h1 className="mb-4">Dashboard Admin</h1>

      {stats && (
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <h6 className="text-muted">Tổng doanh thu</h6>
                <h3>{stats.totalRevenue.toLocaleString('vi-VN')}₫</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <h6 className="text-muted">Tổng đơn hàng</h6>
                <h3>{stats.totalOrders}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <h6 className="text-muted">Tổng sản phẩm</h6>
                <h3>{stats.totalProducts}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <h6 className="text-muted">Tổng người dùng</h6>
                <h3>{stats.totalUsers}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Tabs defaultActiveKey="orders" className="mb-3">
        <Tab eventKey="orders" title="Quản lý đơn hàng">
          {orders.length === 0 ? (
            <EmptyState 
              title="Không có đơn hàng" 
              message="Chưa có đơn hàng nào trong hệ thống"
            />
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Tổng cộng</th>
                  <th>Trạng thái</th>
                  <th>Thanh toán</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.substring(0, 8)}</td>
                    <td>{order.user?.name}</td>
                    <td>{order.totalPrice.toLocaleString('vi-VN')}₫</td>
                    <td>
                      <span className={`badge bg-${
                        order.status === 'Pending' ? 'warning' :
                        order.status === 'Gói Hàng' ? 'info' :
                        order.status === 'Đang Giao' ? 'primary' :
                        order.status === 'Đã giao' ? 'success' : 'secondary'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.isPaid ? '✓' : '✗'}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        style={{ minWidth: '120px' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Gói Hàng">Gói Hàng</option>
                        <option value="Đang Giao">Đang Giao</option>
                        <option value="Đã giao">Đã giao</option>
                      </Form.Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        <Tab eventKey="products" title="Quản lý sản phẩm">
          <div className="mb-3">
            <Button variant="primary" onClick={() => setShowProductModal(true)}>
              Thêm sản phẩm
            </Button>
          </div>
          {products.length === 0 ? (
            <EmptyState 
              title="Không có sản phẩm" 
              message="Chưa có sản phẩm nào trong hệ thống"
              actionLabel="Thêm sản phẩm mới"
              onAction={() => setShowProductModal(true)}
            />
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Kho</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.price.toLocaleString('vi-VN')}₫</td>
                    <td>{product.stock}</td>
                    <td>
                      <Button 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEditProduct(product)}
                      >
                        Sửa
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        <Tab eventKey="vouchers" title="Quản lý voucher">
          <div className="mb-3">
            <Button variant="primary" onClick={() => setShowVoucherModal(true)}>
              Thêm voucher
            </Button>
          </div>
          {vouchers.length === 0 ? (
            <Alert variant="info">Chưa có voucher nào</Alert>
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Loại</th>
                  <th>Giảm giá</th>
                  <th>Đơn hàng tối thiểu</th>
                  <th>Số lần sử dụng</th>
                  <th>Ngày hết hạn</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((voucher) => (
                  <tr key={voucher._id}>
                    <td><strong>{voucher.code}</strong></td>
                    <td>
                      {voucher.discountType === 'percentage' ? '%' : '₫'}
                    </td>
                    <td>
                      {voucher.discountValue}
                      {voucher.discountType === 'percentage' ? '%' : '₫'}
                    </td>
                    <td>{voucher.minPurchaseAmount?.toLocaleString('vi-VN')}₫</td>
                    <td>{voucher.usedCount} / {voucher.usageLimit || '∞'}</td>
                    <td>{new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <span className={`badge bg-${voucher.isActive ? 'success' : 'danger'}`}>
                        {voucher.isActive ? 'Hoạt động' : 'Vô hiệu'}
                      </span>
                    </td>
                    <td>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDeleteVoucher(voucher._id)}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        <Tab eventKey="customers" title="Quản lý khách hàng">
          {customers.length === 0 ? (
            <EmptyState 
              title="Không có khách hàng" 
              message="Chưa có khách hàng nào đăng ký"
            />
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.address}</td>
                    <td>
                      <span className={`badge bg-${customer.isActive ? 'success' : 'danger'}`}>
                        {customer.isActive ? 'Hoạt động' : 'Bị ban'}
                      </span>
                    </td>
                    <td>{new Date(customer.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      {customer.isActive ? (
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleBanCustomer(customer._id)}
                        >
                          Ban
                        </Button>
                      ) : (
                        <Button 
                          variant="success" 
                          size="sm"
                          onClick={() => handleUnbanCustomer(customer._id)}
                        >
                          Gỡ ban
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        <Tab eventKey="employees" title="Quản lý nhân viên">
          <div className="mb-3">
            <Button variant="primary" onClick={() => setShowEmployeeModal(true)}>
              Thêm nhân viên
            </Button>
          </div>
          {employees.length === 0 ? (
            <EmptyState 
              title="Không có nhân viên" 
              message="Chưa có nhân viên nào trong hệ thống"
              actionLabel="Thêm nhân viên mới"
              onAction={() => setShowEmployeeModal(true)}
            />
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Vị trí</th>
                  <th>Lương</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>{employee.position}</td>
                    <td>{employee.salary.toLocaleString('vi-VN')}₫</td>
                    <td>{employee.status}</td>
                    <td>
                      <Button size="sm" className="me-2">Sửa</Button>
                      <Button variant="danger" size="sm">Xóa</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>
      </Tabs>

      {/* Product Modal */}
      <Modal show={showProductModal} onHide={handleCloseProductModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingProductId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddProduct}>
            <Form.Group className="mb-3">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên sản phẩm"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập mô tả sản phẩm"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá (₫)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập giá"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kho</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập số lượng"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Danh mục</Form.Label>
                  <Form.Select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option>CPU</option>
                    <option>GPU</option>
                    <option>RAM</option>
                    <option>SSD</option>
                    <option>HDD</option>
                    <option>Mainboard</option>
                    <option>PSU</option>
                    <option>Cooling</option>
                    <option>Case</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Thương hiệu</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập thương hiệu"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh sản phẩm</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Form.Text className="text-muted">Định dạng: JPG, PNG, GIF (tối đa 5MB)</Form.Text>
              {productImagePreview && (
                <div className="mt-3">
                  <img
                    src={productImagePreview}
                    alt="Preview"
                    style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px' }}
                  />
                </div>
              )}
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={productLoading}>
                {productLoading ? 'Đang xử lý...' : editingProductId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
              </Button>
              <Button variant="secondary" onClick={handleCloseProductModal}>
                Hủy
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Voucher Modal */}
      <Modal show={showVoucherModal} onHide={() => setShowVoucherModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thêm voucher mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddVoucher}>
            <Form.Group className="mb-3">
              <Form.Label>Mã voucher</Form.Label>
              <Form.Control
                type="text"
                placeholder="VD: SAVE10, NEWYEAR2024"
                value={voucherForm.code}
                onChange={(e) => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Loại giảm giá</Form.Label>
                  <Form.Select
                    value={voucherForm.discountType}
                    onChange={(e) => setVoucherForm({ ...voucherForm, discountType: e.target.value })}
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Cố định (₫)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {voucherForm.discountType === 'percentage' ? 'Giảm giá (%)' : 'Giảm giá (₫)'}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập giảm giá"
                    value={voucherForm.discountValue}
                    onChange={(e) => setVoucherForm({ ...voucherForm, discountValue: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Đơn hàng tối thiểu (₫)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="VD: 500000"
                    value={voucherForm.minPurchaseAmount}
                    onChange={(e) => setVoucherForm({ ...voucherForm, minPurchaseAmount: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giảm giá tối đa (₫)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="VD: 100000"
                    value={voucherForm.maxDiscount}
                    onChange={(e) => setVoucherForm({ ...voucherForm, maxDiscount: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Số lần sử dụng tối đa</Form.Label>
              <Form.Control
                type="number"
                placeholder="VD: 100"
                value={voucherForm.usageLimit}
                onChange={(e) => setVoucherForm({ ...voucherForm, usageLimit: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ngày hết hạn (tùy chọn - mặc định 30 ngày)</Form.Label>
              <Form.Control
                type="date"
                value={voucherForm.expiryDate}
                onChange={(e) => setVoucherForm({ ...voucherForm, expiryDate: e.target.value })}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={voucherLoading}>
                {voucherLoading ? 'Đang thêm...' : 'Thêm voucher'}
              </Button>
              <Button variant="secondary" onClick={() => setShowVoucherModal(false)}>
                Hủy
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Employee Modal */}
      <Modal show={showEmployeeModal} onHide={() => setShowEmployeeModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thêm nhân viên mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddEmployee}>
            <Form.Group className="mb-3">
              <Form.Label>Tên nhân viên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên"
                value={employeeForm.name}
                onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                value={employeeForm.email}
                onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số điện thoại"
                value={employeeForm.phone}
                onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vị trí</Form.Label>
                  <Form.Select
                    value={employeeForm.position}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })}
                  >
                    <option>Bộ phận bán hàng</option>
                    <option>Kỹ sư</option>
                    <option>Marketing</option>
                    <option>Kế toán</option>
                    <option>Quản lý kho</option>
                    <option>Khác</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lương (₫)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập lương"
                    value={employeeForm.salary}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, salary: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập địa chỉ"
                value={employeeForm.address}
                onChange={(e) => setEmployeeForm({ ...employeeForm, address: e.target.value })}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={employeeLoading}>
                {employeeLoading ? 'Đang thêm...' : 'Thêm nhân viên'}
              </Button>
              <Button variant="secondary" onClick={() => setShowEmployeeModal(false)}>
                Hủy
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
