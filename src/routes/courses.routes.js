const express = require('express');
const { body, param } = require('express-validator');

const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createCourse,
  listCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses.controller');

const router = express.Router();

router.get('/', authenticate, listCourses);

router.get(
  '/:id',
  authenticate,
  [param('id').isInt().toInt()],
  validate,
  getCourse,
);

router.post(
  '/',
  authenticate,
  authorize('admin', 'lecturer'),
  [
    body('courseCode').isString().trim().notEmpty(),
    body('courseName').isString().trim().notEmpty(),
    body('credits').optional().isInt({ min: 0 }).toInt(),
    body('department').optional().isString().trim(),
    body('semester').optional().isInt({ min: 1 }).toInt(),
    body('year').optional().isInt({ min: 1 }).toInt(),
    body('lecturerId').optional().isInt().toInt(),
    body('description').optional().isString(),
  ],
  validate,
  createCourse,
);

router.patch(
  '/:id',
  authenticate,
  authorize('admin', 'lecturer'),
  [
    param('id').isInt().toInt(),
    body('courseCode').optional().isString().trim().notEmpty(),
    body('courseName').optional().isString().trim().notEmpty(),
    body('credits').optional().isInt({ min: 0 }).toInt(),
    body('department').optional().isString().trim(),
    body('semester').optional().isInt({ min: 1 }).toInt(),
    body('year').optional().isInt({ min: 1 }).toInt(),
    body('lecturerId').optional().isInt().toInt(),
    body('description').optional().isString(),
  ],
  validate,
  updateCourse,
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  [param('id').isInt().toInt()],
  validate,
  deleteCourse,
);

module.exports = router;

