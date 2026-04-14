import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { getImageUrl } from '../utils/helpers';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const discountPrice = product.originalPrice ? product.originalPrice : product.price;

  return (
    <Card className="product-card h-100">
      <Link to={`/products/${product._id}`} className="product-image-link">
        <div className="product-image-wrapper">
          <Card.Img variant="top" src={getImageUrl(product.image)} />
          {product.discount > 0 && (
            <div className="discount-badge">{product.discount}%</div>
          )}
          {product.isHot && (
            <div className="hot-badge">HOT</div>
          )}
          {product.isNew && (
            <div className="new-badge">NEW</div>
          )}
        </div>
      </Link>
      <Card.Body>
        <Link to={`/products/${product._id}`} className="product-name-link">
          <Card.Title className="product-name">{product.name}</Card.Title>
        </Link>
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} color={i < Math.round(product.rating) ? '#ffc107' : '#e9ecef'} />
          ))}
          <span className="ms-2">({product.numReviews})</span>
        </div>
        <div className="product-brand">{product.brand}</div>
        <div className="product-price">
          <span className="price">{product.price.toLocaleString('vi-VN')}₫</span>
          {discountPrice > product.price && (
            <span className="old-price">{discountPrice.toLocaleString('vi-VN')}₫</span>
          )}
        </div>
        <div className="product-stock">
          Kho: <strong>{product.stock}</strong>
        </div>
        <button
          className={`btn btn-add-cart w-100 ${isAdded ? 'btn-success' : 'btn-primary'}`}
          onClick={handleAddToCart}
        >
          <FaShoppingCart /> {isAdded ? 'Đã thêm!' : 'Thêm giỏ hàng'}
        </button>
      </Card.Body>
    </Card>
  );
}
