const { verifyToken } = require('../utils/jwt');
const { errors }      = require('../utils/response');

/**
 * authenticate – verifies JWT and attaches req.user
 */
const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return errors.unauthorized(res);
  }

  const token = header.split(' ')[1];
  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return errors.tokenExpired(res);
    return errors.unauthorized(res, 'Invalid token');
  }
};

/**
 * authorize(...roles) – role-based access guard (use after authenticate)
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return errors.unauthorized(res);
  if (!roles.includes(req.user.role)) {
    return errors.forbidden(res, `Access restricted to: ${roles.join(', ')}`);
  }
  next();
};

module.exports = { authenticate, authorize };
