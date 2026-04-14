import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Pagination, Alert } from 'react-bootstrap';
import { productService } from '../services/services';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';

export default function HotProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHotProducts = async (p) => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts({
        page: p,
        sortBy: 'rating',
      });
      setProducts(response.data.data);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching hot products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotProducts(page);
  }, [page]);

  return (
    <Container className="py-5">
      <h1 className="mb-4">🔥 Sản phẩm HOT - Bán chạy nhất</h1>
      <p className="text-muted mb-4">Các sản phẩm được đánh giá cao nhất và nhiều người mua</p>

      {loading ? (
        <LoadingSpinner message="Đang tải sản phẩm HOT..." />
      ) : products.length === 0 ? (
        <Alert variant="info">Chưa có sản phẩm HOT</Alert>
      ) : (
        <>
          <Row className="g-3 mb-4">
            {products.map((product) => (
              <Col key={product._id} md={6} lg={4}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center">
              <Pagination>
                <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
                <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === 1} />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={page === i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setPage(page + 1)} disabled={page === totalPages} />
                <Pagination.Last onClick={() => setPage(totalPages)} disabled={page === totalPages} />
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
