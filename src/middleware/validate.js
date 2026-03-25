const { validationResult } = require('express-validator');
const { errors } = require('../utils/response');

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  return errors.validation(res, 'Validation error', result.array());
};

module.exports = { validate };

