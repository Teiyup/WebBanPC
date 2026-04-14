import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-section mt-5">
      <Container>
        <Row className="py-5">
          <Col md={3} sm={6} className="mb-4">
            <h5 className="mb-3">Về chúng tôi</h5>
            <p>PCShop là cửa hàng bán linh kiện PC hàng đầu tại Việt Nam với giá cả cạnh tranh và chất lượng đảm bảo.</p>
          </Col>
          <Col md={3} sm={6} className="mb-4">
            <h5 className="mb-3">Danh mục</h5>
            <ul className="list-unstyled">
              <li><a href="/products?category=CPU">CPU</a></li>
              <li><a href="/products?category=GPU">GPU</a></li>
              <li><a href="/products?category=RAM">RAM</a></li>
              <li><a href="/products?category=SSD">SSD</a></li>
            </ul>
          </Col>
          <Col md={3} sm={6} className="mb-4">
            <h5 className="mb-3">Trợ giúp</h5>
            <ul className="list-unstyled">
              <li><a href="#">Chính sách thanh toán</a></li>
              <li><a href="#">Chính sách giao hàng</a></li>
              <li><a href="#">Chính sách đổi trả</a></li>
              <li><a href="#">Liên hệ chúng tôi</a></li>
            </ul>
          </Col>
          <Col md={3} sm={6} className="mb-4">
            <h5 className="mb-3">Theo dõi chúng tôi</h5>
            <div className="social-icons">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaLinkedin /></a>
            </div>
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col md={6}>
            <p>&copy; 2024 PCShop. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-end">
            <p>Phương thức thanh toán: <span>💳 💰 🏦</span></p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
