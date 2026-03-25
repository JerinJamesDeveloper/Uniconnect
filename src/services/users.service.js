const User = require('../models/User');

async function getById(id) {
  const user = await User.findByPk(id);
  return user ? user.toSafeJSON() : null;
}

async function list() {
  const users = await User.findAll({ order: [['userId', 'DESC']] });
  return users.map((u) => u.toSafeJSON());
}

async function update(id, patch) {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.update(patch);
  return user.toSafeJSON();
}

async function remove(id) {
  const user = await User.findByPk(id);
  if (!user) return false;
  await user.destroy();
  return true;
}

module.exports = { getById, list, update, remove };

