/**
 * UniConnect Terminal Monitor
 * Beautiful real-time request/response logging for the terminal
 */

const chalk = require('chalk');

// ─── Colour palette ──────────────────────────────────────────────────────────
const c = {
  // Methods
  GET:    chalk.bgGreen.black.bold,
  POST:   chalk.bgBlue.white.bold,
  PUT:    chalk.bgYellow.black.bold,
  PATCH:  chalk.bgCyan.black.bold,
  DELETE: chalk.bgRed.white.bold,

  // Status bands
  s2xx: chalk.green.bold,
  s3xx: chalk.cyan.bold,
  s4xx: chalk.yellow.bold,
  s5xx: chalk.red.bold,

  // UI chrome
  border:    chalk.gray,
  dimText:   chalk.gray,
  label:     chalk.white.bold,
  url:       chalk.white,
  time:      chalk.magenta,
  user:      chalk.cyan,
  separator: chalk.gray('─'.repeat(80)),
  thin:      chalk.gray('·'.repeat(80)),

  // Misc
  success: chalk.green,
  error:   chalk.red,
  warn:    chalk.yellow,
  info:    chalk.blue,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function methodBadge(method) {
  const m = method.toUpperCase();
  const pad = (s, n) => s.padEnd(n);
  const badge = c[m] ? c[m](` ${pad(m, 6)}`) : chalk.white.bold(` ${pad(m, 6)}`);
  return badge;
}

function statusBadge(code) {
  const s = String(code);
  if (code < 300) return c.s2xx(`● ${s}`);
  if (code < 400) return c.s3xx(`● ${s}`);
  if (code < 500) return c.s4xx(`● ${s}`);
  return c.s5xx(`● ${s}`);
}

function durationColor(ms) {
  if (ms < 100)  return chalk.green(`${ms}ms`);
  if (ms < 500)  return chalk.yellow(`${ms}ms`);
  if (ms < 2000) return chalk.red(`${ms}ms`);
  return chalk.red.bold(`${ms}ms ⚠`);
}

function prettyJson(obj, maxDepth = 3, indent = 2) {
  if (!obj || typeof obj !== 'object') return String(obj);
  try {
    const str = JSON.stringify(obj, null, indent);
    if (!str) return '{}';
    // Syntax-highlight the JSON string
    return str
      .replace(/"([^"]+)":/g,        (_, k) => chalk.cyan(`"${k}"`) + ':')
      .replace(/: "([^"]*)"/g,        (_, v) => ': ' + chalk.green(`"${v}"`))
      .replace(/: (true|false)/g,     (_, v) => ': ' + chalk.yellow(v))
      .replace(/: (null)/g,           ()     => ': ' + chalk.gray('null'))
      .replace(/: (-?\d+\.?\d*)/g,    (_, v) => ': ' + chalk.magenta(v));
  } catch {
    return String(obj);
  }
}

function truncate(str, max = 2000) {
  if (!str) return '';
  const s = typeof str === 'string' ? str : JSON.stringify(str);
  if (s.length <= max) return s;
  return s.slice(0, max) + chalk.gray(`\n  ... [truncated ${s.length - max} chars]`);
}

function now() {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

function requestCount() {
  requestCount._count = (requestCount._count || 0) + 1;
  return requestCount._count;
}

// ─── Skip paths ──────────────────────────────────────────────────────────────
const SKIP_PATHS = ['/favicon.ico', '/health'];

// ─── Main middleware ──────────────────────────────────────────────────────────
function terminalMonitor(options = {}) {
  const { verbose = false } = options;

  return (req, res, next) => {
    if (SKIP_PATHS.includes(req.path)) return next();

    const start    = Date.now();
    const reqId    = requestCount();
    const incoming = now();

    // ── Capture request body ────────────────────────────────────────────────
    const reqBody = req.body && Object.keys(req.body).length > 0 ? req.body : null;

    // ── Intercept response ──────────────────────────────────────────────────
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);
    let   responseBody = null;

    res.json = function (body) {
      responseBody = body;
      return originalJson(body);
    };
    res.send = function (body) {
      if (!responseBody && typeof body === 'string') {
        try { responseBody = JSON.parse(body); } catch { responseBody = body; }
      }
      return originalSend(body);
    };

    // ── On finish ───────────────────────────────────────────────────────────
    res.on('finish', () => {
      const ms      = Date.now() - start;
      const status  = res.statusCode;
      const user    = req.user ? `${req.user.name || req.user.email} [${req.user.role}]` : null;

      // ── Box drawing ────────────────────────────────────────────────────────
      console.log('\n' + c.separator);

      // Header line
      console.log(
        methodBadge(req.method) +
        '  ' + c.url(req.originalUrl) +
        '  ' + statusBadge(status) +
        '  ' + durationColor(ms) +
        '  ' + c.dimText(`#${reqId}  ${incoming}`)
      );

      // Auth user
      if (user) {
        console.log(c.dimText('  👤 ') + c.user(user));
      }

      // Query params
      if (req.query && Object.keys(req.query).length > 0) {
        console.log(c.dimText('  🔍 Query  : ') + c.dimText(JSON.stringify(req.query)));
      }

      // URL params
      if (req.params && Object.keys(req.params).length > 0) {
        console.log(c.dimText('  📌 Params : ') + c.dimText(JSON.stringify(req.params)));
      }

      // Request body
      if (reqBody) {
        // Mask passwords
        const safeBody = { ...reqBody };
        ['password', 'currentPassword', 'newPassword', 'token'].forEach(k => {
          if (safeBody[k]) safeBody[k] = '●●●●●●●●';
        });

        console.log(c.dimText('\n  ── REQUEST BODY ') + c.dimText('─'.repeat(60)));
        const bodyStr = truncate(prettyJson(safeBody));
        bodyStr.split('\n').forEach(line => console.log('  ' + line));
      }

      // Response body
      if (responseBody !== null && responseBody !== undefined) {
        console.log(c.dimText('\n  ── RESPONSE ') + c.dimText('─'.repeat(64)));
        const resStr = truncate(prettyJson(responseBody));
        resStr.split('\n').forEach(line => console.log('  ' + line));
      }

      // Errors stand out
      if (status >= 400) {
        const errMsg = responseBody?.error?.message || responseBody?.message || '';
        if (errMsg) {
          console.log('\n  ' + chalk.red.bold('✖ ') + chalk.red(errMsg));
        }
      }

      console.log(c.thin);
    });

    next();
  };
}

// ─── Startup banner ──────────────────────────────────────────────────────────
function printBanner(port, env) {
  const w = 56;
  const line  = '═'.repeat(w);
  const blank = ' '.repeat(w);

  const center = (s) => {
    const pad = Math.max(0, Math.floor((w - s.length) / 2));
    return ' '.repeat(pad) + s;
  };

  console.log('\n' + chalk.cyan('╔' + line + '╗'));
  console.log(chalk.cyan('║') + blank + chalk.cyan('║'));
  console.log(chalk.cyan('║') + chalk.white.bold(center('🎓  UniConnect API Server')) + chalk.cyan('║'));
  console.log(chalk.cyan('║') + blank + chalk.cyan('║'));
  console.log(chalk.cyan('╠' + line + '╣'));
  console.log(chalk.cyan('║') + blank + chalk.cyan('║'));
  console.log(chalk.cyan('║') + chalk.green(center(`✔  Running on port ${port}`)) + chalk.cyan('║'));
  console.log(chalk.cyan('║') + chalk.yellow(center(`⚡  Environment: ${env.toUpperCase()}`)) + chalk.cyan('║'));
  console.log(chalk.cyan('║') + chalk.blue(center(`🌐  http://localhost:${port}/api`)) + chalk.cyan('║'));
  console.log(chalk.cyan('║') + blank + chalk.cyan('║'));
  console.log(chalk.cyan('╠' + line + '╣'));
  console.log(chalk.cyan('║') + blank + chalk.cyan('║'));

  const legend = [
    chalk.bgGreen.black(' GET    ') + '  ' + chalk.bgBlue.white(' POST   ') + '  ' +
    chalk.bgYellow.black(' PUT    ') + '  ' + chalk.bgRed.white(' DELETE '),
    chalk.green('● 2xx OK') + '  ' + chalk.yellow('● 4xx Client') + '  ' + chalk.red('● 5xx Server'),
  ];
  legend.forEach(l => {
    console.log(chalk.cyan('║') + '  ' + l + chalk.cyan('║'));
  });

  console.log(chalk.cyan('║') + blank + chalk.cyan('║'));
  console.log(chalk.cyan('╚' + line + '╝\n'));
}

// ─── Route table ─────────────────────────────────────────────────────────────
function printRouteTable(app) {
  try {
    const rows  = [];
    const stack = app._router?.stack || [];

    const walk = (layers, prefix = '') => {
      layers.forEach(layer => {
        if (layer.route) {
          Object.keys(layer.route.methods).forEach(method => {
            rows.push([method.toUpperCase(), prefix + layer.route.path]);
          });
        } else if (layer.name === 'router' && layer.handle?.stack) {
          const sub = layer.regexp?.source
            .replace('\\/?(?=\\/|$)', '')
            .replace(/\\\//g, '/')
            .replace('^', '')
            .replace('$', '')
            .replace(/\(\?:\(\[^\\\/\]\+\?\)\)/g, ':param')
            || '';
          walk(layer.handle.stack, prefix + sub);
        }
      });
    };

    walk(stack);

    if (rows.length === 0) return;

    const grouped = {};
    rows.forEach(([m, p]) => {
      const mod = p.split('/')[2] || 'root';
      if (!grouped[mod]) grouped[mod] = [];
      grouped[mod].push([m, p]);
    });

    console.log(chalk.cyan.bold('\n  📋  Registered Routes\n'));
    Object.entries(grouped).forEach(([mod, routes]) => {
      console.log(chalk.yellow.bold(`  /${mod}`));
      routes.forEach(([method, path]) => {
        const badge = methodBadge(method);
        console.log(`    ${badge}  ${chalk.white(path)}`);
      });
      console.log();
    });
  } catch {
    // silently skip route table on error
  }
}

module.exports = { terminalMonitor, printBanner, printRouteTable };
