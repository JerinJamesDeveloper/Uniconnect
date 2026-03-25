const { sendCreated, sendSuccess, errors } = require('../utils/response');
const { asyncHandler } = require('../utils/asyncHandler');
const coursesService = require('../services/courses.service');

const listCourses = asyncHandler(async (req, res) => {
  const courses = await coursesService.list();
  return sendSuccess(res, courses, 'OK');
});

const getCourse = asyncHandler(async (req, res) => {
  const course = await coursesService.getById(req.params.id);
  if (!course) return errors.notFound(res, 'Course not found');
  return sendSuccess(res, course, 'OK');
});

const createCourse = asyncHandler(async (req, res) => {
  const course = await coursesService.create(req.body, req.user);
  return sendCreated(res, course, 'Created');
});

const updateCourse = asyncHandler(async (req, res) => {
  const course = await coursesService.update(req.params.id, req.body);
  if (!course) return errors.notFound(res, 'Course not found');
  return sendSuccess(res, course, 'Updated');
});

const deleteCourse = asyncHandler(async (req, res) => {
  const ok = await coursesService.remove(req.params.id);
  if (!ok) return errors.notFound(res, 'Course not found');
  return sendSuccess(res, { deleted: true }, 'Deleted');
});

module.exports = { createCourse, listCourses, getCourse, updateCourse, deleteCourse };

