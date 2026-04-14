import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { orderService } from '../services/services';
import { Table } from 'react-bootstrap';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (user) {
      setProfile(user);
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getMyOrders();
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  if (!user) return <Container className="py-5">Vui lòng đăng nhập</Container>;

  return (
    <Container className="py-5">
      <Row>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Thông tin cá nhân</Card.Title>
              {editMode ? (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên</Form.Label>
                    <Form.Control value={profile.name} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control value={profile.phone} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Địa chỉ</Form.Label>
                    <Form.Control value={profile.address} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Thành phố</Form.Label>
                    <Form.Control value={profile.city} />
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button variant="primary" size="sm">Lưu</Button>
                    <Button variant="secondary" size="sm" onClick={() => setEditMode(false)}>Hủy</Button>
                  </div>
                </Form>
              ) : (
                <>
                  <p><strong>Tên:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone || 'Chưa cập nhật'}</p>
                  <p><strong>Địa chỉ:</strong> {user.address || 'Chưa cập nhật'}</p>
                  <p><strong>Thành phố:</strong> {user.city || 'Chưa cập nhật'}</p>
                  <Button variant="primary" size="sm" onClick={() => setEditMode(true)}>
                    Chỉnh sửa
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Đơn hàng của tôi</Card.Title>
              {orders.length === 0 ? (
                <Alert variant="info">Bạn chưa có đơn hàng nào</Alert>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Ngày tạo</th>
                      <th>Tổng cộng</th>
                      <th>Trạng thái</th>
                      <th>Thanh toán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id.substring(0, 8)}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                        <td>{order.totalPrice.toLocaleString('vi-VN')}₫</td>
                        <td>{order.status}</td>
                        <td>{order.isPaid ? '✓ Đã thanh toán' : '✗ Chưa thanh toán'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
