// 404 handler — route not found
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error('💥 Error:', err.message);
  console.error(err.stack);

  const statusCode = err.statusCode || err.status || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = { notFound, errorHandler };
