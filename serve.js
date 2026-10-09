// Minimal static server for the posture detector (camera needs a secure origin → localhost).
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 8811;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript',
                '.mjs': 'text/javascript', '.css': 'text/css',
                '.task': 'application/octet-stream' };

const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]);
  // 根路径：开发目录用 index.html，单文件分发包里用 posture-guard.html
  const home = fs.existsSync(path.join(ROOT, 'index.html')) ? 'index.html' : 'posture-guard.html';
  const file = path.join(ROOT, rel === '/' ? home : rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end('forbidden'); return; }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404).end('not found'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
});

// 端口被占就自动往后找，避免 EADDRINUSE 直接崩掉。
// 注意：成功回调只注册一次 —— 写成 listen(port, cb) 会在每次重试时累积回调，
// 最后一起触发并打印出错误的端口号。
server.on('listening', () => {
  const { port } = server.address();
  console.log(`posture-guard on http://localhost:${port}/posture-guard.html`);
});

function listen(port, tries = 20) {
  server.once('error', err => {
    if (err.code === 'EADDRINUSE' && tries > 0) {
      console.log(`端口 ${port} 被占用，试 ${port + 1} …`);
      listen(port + 1, tries - 1);
    } else { throw err; }
  });
  server.listen(port);
}
listen(PORT);
