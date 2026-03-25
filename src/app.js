const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { terminalMonitor } = require('./middleware/terminalMonitor');
const { createRateLimiters } = require('./middleware/rateLimiters');

function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.use(terminalMonitor({ verbose: false }));

  const { globalLimiter } = createRateLimiters();
  app.use(globalLimiter);

  app.use(routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };

