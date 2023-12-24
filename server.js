const express = require('express');
const next = require('next');
const browserSync = require('browser-sync');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  const port = 3000;

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });

  // BrowserSync configuration
  browserSync({
    proxy: `localhost:${port}`,
    files: ['pages/**/*.*', 'components/**/*.*', 'public/**/*.*'],
    ignore: ['node_modules'],
    open: false,
  });
});
