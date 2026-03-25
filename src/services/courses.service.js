const Course = require('../models/Course');

async function list() {
  return Course.findAll({ order: [['courseId', 'DESC']] });
}

async function getById(id) {
  return Course.findByPk(id);
}

async function create(payload, actor) {
  const course = await Course.create({
    ...payload,
    lecturerId: payload.lecturerId || (actor.role === 'lecturer' ? actor.userId : payload.lecturerId),
  });
  return course;
}

async function update(id, patch) {
  const course = await Course.findByPk(id);
  if (!course) return null;
  await course.update(patch);
  return course;
}

async function remove(id) {
  const course = await Course.findByPk(id);
  if (!course) return false;
  await course.destroy();
  return true;
}

module.exports = { list, getById, create, update, remove };

