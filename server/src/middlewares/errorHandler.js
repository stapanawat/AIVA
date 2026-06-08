const errorHandler = (err, req, res, next) => {
  // Log the detailed error internally
  console.error('[System Error Log]:', err);

  const statusCode = err.status || 500;
  
  const response = {
    error: err.message || 'Internal Server Error',
  };

  // Do not expose stack traces in production environment
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.details = err.details || null;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
