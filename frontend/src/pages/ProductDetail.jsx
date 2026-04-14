import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Badge, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { productService } from '../services/services';
import { CartContext } from '../context/CartContext';
import { getImageUrl } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProduct(id);
        setProduct(response.data.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <LoadingSpinner message="Đang tải thông tin sản phẩm..." />;
  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Sản phẩm không tìm thấy</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={6}>
          <img
            src={getImageUrl(product.image, 'https://via.placeholder.com/400')}
            alt={product.name}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Col>
        <Col md={6}>
          <h1 className="mb-3">{product.name}</h1>
          <div className="mb-3">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} color={i < Math.round(product.rating) ? '#ffc107' : '#e9ecef'} />
            ))}
            <span className="ms-2">({product.numReviews} đánh giá)</span>
          </div>

          <div className="mb-3">
            <p><strong>Thương hiệu:</strong> {product.brand}</p>
            <p><strong>Danh mục:</strong> {product.category}</p>
            <p><strong>Tồn kho:</strong> {product.stock} sản phẩm</p>
          </div>

          <div className="mb-3">
            <h3 className="text-danger">{product.price.toLocaleString('vi-VN')}₫</h3>
            {product.discount > 0 && (
              <Badge bg="danger">{product.discount}% OFF</Badge>
            )}
          </div>

          <div className="mb-3">
            <p>{product.description}</p>
          </div>

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mb-3">
              <h5>Thông số kỹ thuật:</h5>
              <ul>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key}><strong>{key}:</strong> {value}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-3">
           
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <input type="number" value={quantity} readOnly style={{ width: '60px', textAlign: 'center' }} />
              <Button
                variant="outline-secondary"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                +
              </Button>
            </div>
          </div>

          <Button
            size="lg"
            className="w-100"
            onClick={() => addToCart(product, quantity)}
            disabled={product.stock === 0}
          >
            <FaShoppingCart /> {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
