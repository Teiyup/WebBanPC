import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Pagination, Alert } from 'react-bootstrap';
import { productService } from '../services/services';
import { debounce } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');
  const [searchDisplay, setSearchDisplay] = useState('');
  const debouncedSearchRef = useRef(null);

  const fetchProducts = async (p, cat, sort, q) => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts({
        page: p,
        category: cat,
        sortBy: sort,
        search: q,
      });
      setProducts(response.data.data);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    if (!debouncedSearchRef.current) {
      debouncedSearchRef.current = debounce((q) => {
        setSearch(q);
        setPage(1);
      }, 500);
    }
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchDisplay(value);
    debouncedSearchRef.current(value);
  };

  useEffect(() => {
    fetchProducts(1, category, sortBy, search);
    setPage(1);
  }, [category, sortBy, search]);

  useEffect(() => {
    fetchProducts(page, category, sortBy, search);
  }, [page]);

  return (
    <Container className="py-5">
      <h1 className="mb-4">Tất cả sản phẩm</h1>
      <Row>
        {/* Sidebar */}
        <Col md={3} className="mb-4">
          <div className="filter-section">
            <h5>Bộ lọc</h5>
            <Form.Group className="mb-3">
              <Form.Label>Danh mục</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Tất cả</option>
                <option value="CPU">CPU</option>
                <option value="GPU">GPU</option>
                <option value="RAM">RAM</option>
                <option value="SSD">SSD</option>
                <option value="HDD">HDD</option>
                <option value="Mainboard">Mainboard</option>
                <option value="PSU">PSU</option>
                <option value="Cooling">Cooling</option>
                <option value="Case">Case</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sắp xếp</Form.Label>
              <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Mới nhất</option>
                <option value="price-low">Giá: Thấp → Cao</option>
                <option value="price-high">Giá: Cao → Thấp</option>
                <option value="rating">Đánh giá cao</option>
              </Form.Select>
            </Form.Group>
          </div>
        </Col>

        {/* Products Grid */}
        <Col md={9}>
          {loading ? (
            <LoadingSpinner message="Đang tải sản phẩm..." />
          ) : products.length === 0 ? (
            <Alert variant="info">Không tìm thấy sản phẩm</Alert>
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
        </Col>
      </Row>
    </Container>
  );
}
