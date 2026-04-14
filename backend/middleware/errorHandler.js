// Error handler middleware
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

exports.ApiError = ApiError;

// Error handling middleware (must be used last)
exports.errorHandler = (err, req, res, next) => {
  // Default error
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Lỗi máy chủ nội bộ',
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    error.statusCode = 400;
    error.message = messages.join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error.statusCode = 400;
    error.message = `${field} đã được sử dụng`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.message = 'Token không hợp lệ';
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.message = 'Token đã hết hạn';
  }

  // Cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    error.statusCode = 400;
    error.message = 'ID không hợp lệ';
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Async error wrapper
exports.asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
