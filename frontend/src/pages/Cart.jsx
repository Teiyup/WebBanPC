import React, { useContext, useState } from 'react';
import { Container, Row, Col, Table, Button, Form, Alert, Modal } from 'react-bootstrap';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { orderService } from '../services/services';
import { voucherService } from '../services/services';
import { validateCheckoutForm } from '../utils/validation';
import { showSuccess, showError, showWarning } from '../utils/toast';
import { getErrorMessage } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice, loading } = useContext(CartContext);
  const [voucher, setVoucher] = useState('');
  const [discount, setDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutErrors, setCheckoutErrors] = useState({});
  const [checkoutForm, setCheckoutForm] = useState({
    shippingAddress: '',
    fullName: '',
    phoneNumber: '',
    paymentMethod: 'COD',
  });

  const shippingCost = totalPrice > 500000 ? 0 : 30000;
  const tax = (totalPrice - discount) * 0.1;
  const finalTotal = totalPrice + shippingCost + tax - discount;

  const handleApplyVoucher = async () => {
    setVoucherError('');
    if (!voucher.trim()) {
      setVoucherError('Vui lòng nhập mã giảm giá');
      showWarning('Vui lòng nhập mã giảm giá');
      return;
    }

    try {
      const response = await voucherService.verifyVoucher({
        code: voucher,
        totalAmount: totalPrice,
      });
      setDiscount(response.data.data.discount);
      showSuccess(`Áp dụng mã thành công! Giảm: ${response.data.data.discount.toLocaleString('vi-VN')}₫`);
      setVoucher('');
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      setVoucherError(errorMsg);
      showError(errorMsg);
    }
  };

  const handleCheckout = async () => {
    // Validate form
    const formErrors = validateCheckoutForm(checkoutForm);
    if (Object.keys(formErrors).length > 0) {
      setCheckoutErrors(formErrors);
      showError('Vui lòng điền đầy đủ và chính xác thông tin');
      return;
    }

    setCheckoutLoading(true);
    try {
      const orderItems = cart.map((item) => ({
        product: item.product._id,
        productName: item.product.name,
        productImage: item.product.image,
        quantity: item.quantity,
        price: item.product.price,
      }));

      await orderService.createOrder({
        orderItems,
        shippingAddress: {
          address: checkoutForm.shippingAddress,
          fullName: checkoutForm.fullName,
          phoneNumber: checkoutForm.phoneNumber,
          country: 'Vietnam',
        },
        paymentMethod: checkoutForm.paymentMethod,
      });

      showSuccess('Đặt hàng thành công!');
      clearCart();
      setShowCheckout(false);
      navigate('/profile');
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      showError(errorMsg);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải giỏ hàng..." />;
  }

  if (cart.length === 0) {
    return (
      <Container className="py-5">
        <Alert variant="info">Giỏ hàng trống. <a href="/products">Tiếp tục mua sắm</a></Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Giỏ hàng của bạn</h1>
      <Row>
        <Col md={8}>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng cộng</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.product._id}>
                  <td>{item.product.name}</td>
                  <td>{item.product.price.toLocaleString('vi-VN')}₫</td>
                  <td>
                    <div className="quantity-control">
                      <Button
                        variant="sm"
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      >
                        <FaMinus />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="sm"
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      >
                        <FaPlus />
                      </Button>
                    </div>
                  </td>
                  <td>{(item.product.price * item.quantity).toLocaleString('vi-VN')}₫</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item.product._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        <Col md={4}>
          <div className="cart-summary">
            <h4>Tóm tắt đơn hàng</h4>
            <div className="summary-item">
              <span>Tạm tính:</span>
              <strong>{totalPrice.toLocaleString('vi-VN')}₫</strong>
            </div>
            <div className="summary-item">
              <span>Phí vận chuyển:</span>
              <strong>{shippingCost.toLocaleString('vi-VN')}₫</strong>
            </div>
            <div className="summary-item">
              <span>Thuế:</span>
              <strong>{tax.toLocaleString('vi-VN')}₫</strong>
            </div>
            {discount > 0 && (
              <div className="summary-item">
                <span>Giảm giá:</span>
                <strong className="text-success">-{discount.toLocaleString('vi-VN')}₫</strong>
              </div>
            )}
            <hr />
            <div className="summary-item total">
              <span>Tổng cộng:</span>
              <strong>{finalTotal.toLocaleString('vi-VN')}₫</strong>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Mã giảm giá</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  placeholder="Nhập mã"
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
                />
                <Button onClick={handleApplyVoucher}>Áp dụng</Button>
              </div>
              {voucherError && <small className="text-danger">{voucherError}</small>}
            </Form.Group>

            <Button 
              className="w-100 mb-2" 
              size="lg"
              onClick={() => {
                if (!user) {
                  alert('Vui lòng đăng nhập trước khi thanh toán');
                  navigate('/login');
                } else {
                  setShowCheckout(true);
                }
              }}
            >
              Thanh toán
            </Button>
            <Button variant="secondary" className="w-100 mb-2">Tiếp tục mua sắm</Button>
            <Button variant="outline-danger" className="w-100" onClick={clearCart}>
              Xóa giỏ hàng
            </Button>
          </div>
        </Col>
      </Row>

      {/* Checkout Modal */}
      <Modal show={showCheckout} onHide={() => setShowCheckout(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ giao hàng</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập địa chỉ"
                value={checkoutForm.shippingAddress}
                onChange={(e) => {
                  setCheckoutForm({ ...checkoutForm, shippingAddress: e.target.value });
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập họ và tên"
                value={checkoutForm.fullName}
                onChange={(e) => {
                  setCheckoutForm({ ...checkoutForm, fullName: e.target.value });
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số điện thoại"
                value={checkoutForm.phoneNumber}
                onChange={(e) => {
                  setCheckoutForm({ ...checkoutForm, phoneNumber: e.target.value });
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phương thức thanh toán</Form.Label>
              <Form.Select
                value={checkoutForm.paymentMethod}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value })}
              >
                <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                <option value="Bank">Chuyển khoản ngân hàng</option>
              </Form.Select>
            </Form.Group>

            <Alert variant="info">
              <strong>Tổng cộng:</strong> {finalTotal.toLocaleString('vi-VN')}₫
            </Alert>

            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="flex-grow-1"
              >
                {checkoutLoading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowCheckout(false)}
              >
                Hủy
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
