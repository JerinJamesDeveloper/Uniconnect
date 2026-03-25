require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const { createApp } = require('./app');
const sequelize = require('./db/database');
require('./models');
const { printBanner, printRouteTable } = require('./middleware/terminalMonitor');
const { seedAdmin } = require('./services/seed.service');

async function start() {
  const port = parseInt(process.env.PORT || '3000', 10);
  const env = process.env.NODE_ENV || 'development';

  const app = createApp();
  const server = http.createServer(app);

  // Socket.IO is optional for now; initialized so it can be used by chat/notifications later.
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
  });
  app.set('io', io);

  try {
    await sequelize.authenticate();
    const shouldSync = (process.env.DB_SYNC || 'true').toLowerCase() === 'true';
    if (shouldSync) await sequelize.sync();
    await seedAdmin();

    server.listen(port, () => {
      printBanner(port, env);
      printRouteTable(app);
    });
  } catch (err) {
    console.error('[BOOT]', err);
    process.exitCode = 1;
  }
}

start();
