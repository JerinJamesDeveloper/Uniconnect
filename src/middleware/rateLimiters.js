const rateLimit = require('express-rate-limit');
const { errors } = require('../utils/response');

function createRateLimiters() {
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10);
  const max = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);
  const authMax = parseInt(process.env.AUTH_RATE_LIMIT_MAX || '5', 10);

  const handler = (req, res) => errors.rateLimit(res);

  return {
    globalLimiter: rateLimit({ windowMs, max, standardHeaders: true, legacyHeaders: false, handler }),
    authLimiter: rateLimit({ windowMs, max: authMax, standardHeaders: true, legacyHeaders: false, handler }),
  };
}

module.exports = { createRateLimiters };

