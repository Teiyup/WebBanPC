import React from 'react';
import { Alert, Container, Button } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <Alert variant="danger">
            <Alert.Heading className="d-flex align-items-center gap-2">
              <FaExclamationTriangle /> Lỗi không mong muốn
            </Alert.Heading>
            <p>Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại hoặc quay lại trang chủ.</p>
            <hr />
            <div>
              <Button variant="danger" onClick={this.handleReset}>
                Quay lại trang chủ
              </Button>
            </div>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}
