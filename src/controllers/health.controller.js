const { sendSuccess } = require('../utils/response');

const getHealth = (req, res) => {
  sendSuccess(res, { status: 'ok', time: new Date().toISOString() });
};

module.exports = { getHealth };

