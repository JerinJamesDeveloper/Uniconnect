const express = require('express');
const { body, param } = require('express-validator');

const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  getMe,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/users.controller');

const router = express.Router();

router.get('/me', authenticate, getMe);

router.get('/', authenticate, authorize('admin'), listUsers);

router.get(
  '/:id',
  authenticate,
  authorize('admin'),
  [param('id').isInt().toInt()],
  validate,
  getUser,
);

router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  [
    param('id').isInt().toInt(),
    body('name').optional().isString().trim().notEmpty(),
    body('role').optional().isIn(['student', 'lecturer', 'admin']),
    body('status').optional().isIn(['active', 'inactive', 'suspended']),
    body('phoneNumber').optional().isString().trim(),
    body('address').optional().isString(),
  ],
  validate,
  updateUser,
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  [param('id').isInt().toInt()],
  validate,
  deleteUser,
);

module.exports = router;

