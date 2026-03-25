const User = require('../models/User');

async function seedAdmin() {
  const enabled = (process.env.SEED_ADMIN || 'false').toLowerCase() === 'true';
  if (!enabled) return;

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin';

  if (!email || !password) return;

  const existing = await User.findOne({ where: { email } });
  if (existing) return;

  await User.create({ email, password, name, role: 'admin', status: 'active' });
}

module.exports = { seedAdmin };

