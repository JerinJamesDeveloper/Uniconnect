/**
 * Standardised response helpers — all responses follow the UniConnect envelope
 * { success, message?, data?, error? }
 */

const sendSuccess = (res, data = null, message = null, statusCode = 200) => {
  const body = { success: true };
  if (message) body.message = message;
  if (data !== null) body.data = data;
  return res.status(statusCode).json(body);
};

const sendCreated = (res, data = null, message = 'Created successfully') =>
  sendSuccess(res, data, message, 201);

const sendError = (res, code, message, statusCode = 400, details = null) => {
  const body = { success: false, error: { code, message } };
  if (details) body.error.details = details;
  return res.status(statusCode).json(body);
};

const errors = {
  unauthorized:   (res, msg = 'Authentication required')       => sendError(res, 'AUTH_001', msg, 401),
  tokenExpired:   (res)                                         => sendError(res, 'AUTH_002', 'Token expired', 401),
  forbidden:      (res, msg = 'Insufficient permissions')       => sendError(res, 'AUTH_003', msg, 403),
  notFound:       (res, msg = 'Resource not found')             => sendError(res, 'NOTFOUND_001', msg, 404),
  conflict:       (res, msg = 'Resource already exists')        => sendError(res, 'CONFLICT_001', msg, 409),
  validation:     (res, msg = 'Validation error', d = null)     => sendError(res, 'VALID_001', msg, 422, d),
  database:       (res, msg = 'Database error')                 => sendError(res, 'DB_001', msg, 500),
  fileUpload:     (res, msg = 'File upload error')              => sendError(res, 'FILE_001', msg, 400),
  rateLimit:      (res)                                         => sendError(res, 'RATE_001', 'Rate limit exceeded', 429),
  internal:       (res, msg = 'Internal server error')          => sendError(res, 'SERVER_001', msg, 500),
};

module.exports = { sendSuccess, sendCreated, sendError, errors };
