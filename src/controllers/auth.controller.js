const { sendCreated, sendSuccess, errors } = require('../utils/response');
const { asyncHandler } = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.registerStudent(req.body);
  return sendCreated(res, { user, token }, 'Registered');
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  if (!result) return errors.unauthorized(res, 'Invalid credentials');
  return sendSuccess(res, result, 'Logged in');
});

module.exports = { register, login };

