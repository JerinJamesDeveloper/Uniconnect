const express = require('express');
const { body } = require('express-validator');

const { validate } = require('../middleware/validate');
const { createRateLimiters } = require('../middleware/rateLimiters');
const { register, login } = require('../controllers/auth.controller');

const router = express.Router();
const { authLimiter } = createRateLimiters();

router.post(
  '/register',
  authLimiter,
  [
    body('name').isString().trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 6 }),
  ],
  validate,
  register,
);

router.post(
  '/login',
  authLimiter,
  [body('email').isEmail().normalizeEmail(), body('password').isString().notEmpty()],
  validate,
  login,
);

module.exports = router;

