import React, { useState, useContext } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { validateRegisterForm } from '../utils/validation';
import { showSuccess, showError } from '../utils/toast';
import { getErrorMessage } from '../utils/helpers';
import '../styles/Auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
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
    const formErrors = validateRegisterForm(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword
    );
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      showSuccess('Đăng ký thành công');
      
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
        <h1 className="mb-4">Đăng ký</h1>
        {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tên</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Nhập tên"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            {errors.name && (
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            )}
          </Form.Group>

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

          <Form.Group className="mb-3">
            <Form.Label>Xác nhận mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              isInvalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Button type="submit" className="w-100 mb-3" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </Button>
        </Form>

        <p className="text-center">
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </p>
      </div>
    </Container>
  );
}
