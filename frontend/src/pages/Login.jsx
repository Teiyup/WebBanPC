import React, { useState, useContext } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { validateLoginForm } from '../utils/validation';
import { showSuccess, showError } from '../utils/toast';
import { getErrorMessage } from '../utils/helpers';
import '../styles/Auth.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateLoginForm(formData.email, formData.password);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);
      showSuccess('Đăng nhập thành công');
      
      // Redirect to admin if user is admin
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      showError(errorMsg);
      setErrors({ submit: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="auth-container">
      <div className="auth-form">
        <h1 className="mb-4">Đăng nhập</h1>
        {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            {errors.email && (
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
            />
            {errors.password && (
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Button type="submit" className="w-100 mb-3" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </Form>

        <p className="text-center">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </Container>
  );
}
