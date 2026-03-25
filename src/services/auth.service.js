const { generateToken } = require('../utils/jwt');
const User = require('../models/User');

async function registerStudent(payload) {
  const {
    email,
    password,
    name,
    studentId,
    department,
    year,
    semester,
    enrollmentDate,
    phoneNumber,
    dateOfBirth,
    address,
  } = payload;

  const user = await User.create({
    email,
    password,
    name,
    role: 'student',
    studentId,
    department,
    year,
    semester,
    enrollmentDate,
    phoneNumber,
    dateOfBirth,
    address,
  });

  const safe = user.toSafeJSON();
  const token = generateToken({
    userId: safe.userId,
    email: safe.email,
    role: safe.role,
    name: safe.name,
  });

  return { user: safe, token };
}

async function login(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) return null;
  if (user.status !== 'active') return null;

  const ok = await user.comparePassword(password);
  if (!ok) return null;

  const safe = user.toSafeJSON();
  const token = generateToken({
    userId: safe.userId,
    email: safe.email,
    role: safe.role,
    name: safe.name,
  });

  return { user: safe, token };
}

module.exports = { registerStudent, login };

