import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Pagination, Alert } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/services';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';

export default function Search() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSearchResults = async (p, query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await productService.getAllProducts({
        page: p,
        search: query,
      });
      setProducts(response.data.data);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      setPage(1);
      fetchSearchResults(1, searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim()) {
      fetchSearchResults(page, searchQuery);
    }
  }, [page]);

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h2>Kết quả tìm kiếm</h2>
        <p className="text-muted">
          Tìm thấy <strong>{products.length}</strong> sản phẩm từ khóa: <strong>"{searchQuery}"</strong>
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Đang tìm kiếm..." />
      ) : products.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h5>😊 Không tìm thấy sản phẩm nào</h5>
          <p>Vui lòng thử từ khóa khác hoặc quay lại trang sản phẩm</p>
        </Alert>
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
                {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={page === i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                {totalPages > 5 && <Pagination.Ellipsis disabled />}
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
