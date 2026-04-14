import React from 'react';
import { Spinner } from 'react-bootstrap';
import './LoadingSpinner.css';

export default function LoadingSpinner({ message = 'Đang tải...' }) {
  return (
    <div className="loading-spinner-container">
      <div className="spinner-content">
        <Spinner animation="border" role="status" variant="primary" size="lg" />
        <p className="mt-3">{message}</p>
      </div>
    </div>
  );
}
