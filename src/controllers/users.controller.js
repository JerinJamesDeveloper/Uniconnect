const { sendSuccess, errors } = require('../utils/response');
const { asyncHandler } = require('../utils/asyncHandler');
const usersService = require('../services/users.service');

const getMe = asyncHandler(async (req, res) => {
  const user = await usersService.getById(req.user.userId);
  if (!user) return errors.notFound(res, 'User not found');
  return sendSuccess(res, user, 'OK');
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await usersService.list();
  return sendSuccess(res, users, 'OK');
});

const getUser = asyncHandler(async (req, res) => {
  const user = await usersService.getById(req.params.id);
  if (!user) return errors.notFound(res, 'User not found');
  return sendSuccess(res, user, 'OK');
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await usersService.update(req.params.id, req.body);
  if (!user) return errors.notFound(res, 'User not found');
  return sendSuccess(res, user, 'Updated');
});

const deleteUser = asyncHandler(async (req, res) => {
  const ok = await usersService.remove(req.params.id);
  if (!ok) return errors.notFound(res, 'User not found');
  return sendSuccess(res, { deleted: true }, 'Deleted');
});

module.exports = { getMe, listUsers, getUser, updateUser, deleteUser };

