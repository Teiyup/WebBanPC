import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { productService } from '../services/services';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Home.css';

export default function Home() {
  const [hotProducts, setHotProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [hotRes, newRes] = await Promise.all([
          productService.getHotProducts(),
          productService.getNewProducts(),
        ]);
        setHotProducts(hotRes.data.data);
        setNewProducts(newRes.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {loading && <LoadingSpinner message="Đang tải sản phẩm..." />}
      
      {!loading && (
        <>
          {/* Hero Banner */}
          <div className="hero-banner">
            <Container>
              <Row className="align-items-center">
            <Col md={12} className="hero-content">
              <h1>Chào mừng đến PCShop</h1>
              <p>Nơi cung cấp các linh kiện PC chất lượng cao với giá cả cạnh tranh</p>
              <Link to="/products" className="btn btn-lg btn-primary">
                Mua sắm ngay <FaArrowRight />
              </Link>
            </Col>
          </Row>
            </Container>
      </div>

      {/* Hot Products */}
      <section className="products-section">
        <Container>
          <div className="section-header">
            <h2>🔥 Sản phẩm HOT</h2>
            <Link to="/hot-products" className="view-all">Xem tất cả</Link>
          </div>
          <Row className="g-3">
            {hotProducts.slice(0, 6).map((product) => (
              <Col key={product._id} md={4} sm={6} xs={12}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* New Products */}
      <section className="products-section">
        <Container>
          <div className="section-header">
            <h2>✨ Sản phẩm mới</h2>
            <Link to="/new-products" className="view-all">Xem tất cả</Link>
          </div>
          <Row className="g-3">
            {newProducts.slice(0, 6).map((product) => (
              <Col key={product._id} md={4} sm={6} xs={12}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
        </>
      )}
    </div>
  );
}
