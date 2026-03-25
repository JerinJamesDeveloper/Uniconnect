const { errors } = require('../utils/response');

// 404 for unmatched routes
const notFoundHandler = (req, res) => {
  errors.notFound(res, `Route ${req.method} ${req.originalUrl} not found`);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.stack || err.message);

  if (err.name === 'MulterError') {
    return errors.fileUpload(res, err.message);
  }
  if (err.name === 'SequelizeValidationError') {
    return errors.validation(res, err.message);
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    return errors.conflict(res, 'Resource already exists');
  }

  errors.internal(res, err.message || 'Internal server error');
};

module.exports = { notFoundHandler, errorHandler };
