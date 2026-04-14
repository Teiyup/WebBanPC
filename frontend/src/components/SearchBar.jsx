import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/services';
import { debounce, getImageUrl } from '../utils/helpers';
import './SearchBar.css';

export default function SearchBar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const debouncedSearchRef = useRef(null);

  // Setup debounce
  useEffect(() => {
    if (!debouncedSearchRef.current) {
      debouncedSearchRef.current = debounce(async (query) => {
        if (query.trim().length === 0) {
          setResults([]);
          setShowDropdown(false);
          return;
        }

        setLoading(true);
        try {
          const response = await productService.getAllProducts({
            search: query,
            page: 1,
          });
          setResults(response.data.data.slice(0, 8)); // Limit to 8 results
          setShowDropdown(true);
          setSelectedIndex(-1);
        } catch (error) {
          console.error('Error searching products:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearchRef.current(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setResults([]);
      setShowDropdown(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
    setSearchTerm('');
    setResults([]);
    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleProductClick(results[selectedIndex]._id);
        } else if (searchTerm.trim()) {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
      default:
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-bar-container" ref={dropdownRef}>
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm sản phẩm (CPU, GPU, RAM...)..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
        />
        <button type="submit" className="search-btn">
          🔍
        </button>
      </form>

      {showDropdown && (
        <div className="search-dropdown">
          {loading && <div className="dropdown-item loading">Đang tìm kiếm...</div>}

          {!loading && results.length === 0 && searchTerm.trim() !== '' && (
            <div className="dropdown-item no-results">Không có sản phẩm nào</div>
          )}

          {!loading && results.length > 0 && (
            <>
              {results.map((product, index) => (
                <div
                  key={product._id}
                  className={`dropdown-item product-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleProductClick(product._id)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <img src={getImageUrl(product.image, 'https://via.placeholder.com/50')} alt={product.name} className="product-thumb" />
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-brand">{product.brand}</div>
                    <div className="product-price">
                      {product.price.toLocaleString('vi-VN')} ₫
                    </div>
                  </div>
                </div>
              ))}
              <div
                className="dropdown-item view-all"
                onClick={() => {
                  handleSearch(new Event('submit'));
                }}
              >
                Xem tất cả kết quả cho "{searchTerm}"
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
