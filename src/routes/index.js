const express = require('express');

const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const coursesRoutes = require('./courses.routes');

const router = express.Router();
const apiPrefix = process.env.API_PREFIX || '/api';

router.use('/health', healthRoutes);
router.use(`${apiPrefix}/health`, healthRoutes);

router.use(`${apiPrefix}/auth`, authRoutes);
router.use(`${apiPrefix}/users`, usersRoutes);
router.use(`${apiPrefix}/courses`, coursesRoutes);

module.exports = router;
