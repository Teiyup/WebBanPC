import React from 'react';
import { Alert, Container } from 'react-bootstrap';
import { FaDatabase } from 'react-icons/fa';

export default function EmptyState({ 
  title = 'Không có dữ liệu', 
  message = 'Hiện tại không có mục nào để hiển thị', 
  actionLabel,
  onAction 
}) {
  return (
    <Alert variant="info" className="text-center py-5">
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        <FaDatabase />
      </div>
      <h5>{title}</h5>
      <p className="mb-0">{message}</p>
      {actionLabel && onAction && (
        <button 
          className="btn btn-info btn-sm mt-3"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </Alert>
  );
}
