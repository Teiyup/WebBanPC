import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { FaPhone, FaMapMarkerAlt, FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import SearchBar from './SearchBar';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div className="header-top">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-3">
              <span><FaPhone /> +84 123 456 789</span>
              <span><FaMapMarkerAlt /> TP. Hồ Chí Minh, Việt Nam</span>
            </div>
            <div>
              {user ? (
                <div className="d-flex gap-3 align-items-center">
                  <span>Xin chào, {user.name}!</span>
                  <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
                    <FaSignOutAlt /> Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn btn-sm btn-outline-primary">Đăng nhập</Link>
                  <Link to="/register" className="btn btn-sm btn-primary">Đăng ký</Link>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Navbar bg="light" expand="lg" sticky="top" className="navbar-main">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-3">
            🖥️ PCShop
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <div className="navbar-search ms-auto me-3">
              <SearchBar />
            </div>
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/products">Tất cả sản phẩm</Nav.Link>
              <Nav.Link as={Link} to="/hot-products">Hàng HOT</Nav.Link>
              <Nav.Link as={Link} to="/new-products">Hàng mới</Nav.Link>
              {user?.role === 'admin' && (
                <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
              )}
              <Nav.Link as={Link} to="/cart">
                <FaShoppingCart /> Giỏ hàng <Badge bg="danger">{totalItems}</Badge>
              </Nav.Link>
              {user && (
                <Nav.Link as={Link} to="/profile">
                  <FaUser /> Tài khoản
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
