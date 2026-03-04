/* Minimal static server (no deps). */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { createReadStream } = require('fs');

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8',
};

function safeJoin(base, target) {
  const targetPath = path.resolve(base, '.' + target);
  if (!targetPath.startsWith(base)) return null;
  return targetPath;
}

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, { ...headers });
  res.end(body);
}

function getCacheControl(ext) {
  // Without fingerprinted filenames, keep CSS/JS revalidating often.
  if (ext === '.html') return 'no-cache';
  if (ext === '.css' || ext === '.js') return 'public, max-age=3600';
  if (ext === '.json' || ext === '.txt') return 'public, max-age=3600';
  // Media + images typically change less.
  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' || ext === '.svg' || ext === '.ico') {
    return 'public, max-age=604800';
  }
  if (ext === '.mp3' || ext === '.mp4' || ext === '.webm') return 'public, max-age=604800';
  return 'public, max-age=3600';
}

function makeEtag(stats) {
  // Weak ETag based on size + mtime; fast and good enough for static files.
  const mtime = Math.floor(stats.mtimeMs || 0);
  return `W/"${stats.size}-${mtime}"`;
}

function sendFile(req, res, filePath, stats) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  const etag = makeEtag(stats);
  const ifNoneMatch = req.headers['if-none-match'];
  if (ifNoneMatch && ifNoneMatch === etag) {
    return send(res, 304, '', {
      'ETag': etag,
      'Cache-Control': getCacheControl(ext),
    });
  }

  const baseHeaders = {
    'Content-Type': contentType,
    'Cache-Control': getCacheControl(ext),
    'ETag': etag,
    'Last-Modified': stats.mtime.toUTCString(),
    'Accept-Ranges': 'bytes',
  };

  if (req.method === 'HEAD') {
    return send(res, 200, '', {
      ...baseHeaders,
      'Content-Length': String(stats.size),
    });
  }

  const range = req.headers.range;
  const supportsRange = ext === '.mp4' || ext === '.mp3' || ext === '.webm';
  if (supportsRange && typeof range === 'string' && range.startsWith('bytes=')) {
    const [startStr, endStr] = range.replace('bytes=', '').split('-');
    const start = startStr ? Number(startStr) : 0;
    const end = endStr ? Number(endStr) : stats.size - 1;

    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end < start || start >= stats.size) {
      return send(res, 416, 'Range Not Satisfiable', {
        ...baseHeaders,
        'Content-Range': `bytes */${stats.size}`,
      });
    }

    const chunkSize = end - start + 1;
    res.writeHead(206, {
      ...baseHeaders,
      'Content-Range': `bytes ${start}-${end}/${stats.size}`,
      'Content-Length': String(chunkSize),
    });
    return createReadStream(filePath, { start, end }).pipe(res);
  }

  res.writeHead(200, {
    ...baseHeaders,
    'Content-Length': String(stats.size),
  });
  return createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname.endsWith('/')) pathname += 'index.html';
    if (pathname === '') pathname = '/index.html';

    const filePath = safeJoin(ROOT, pathname);
    if (!filePath) return send(res, 400, 'Bad Request');

    fs.stat(filePath, (statErr, stats) => {
      if (statErr || !stats.isFile()) {
        // Fallback to index.html for common SPA-ish navigation
        const fallback = path.join(ROOT, 'index.html');
        return fs.stat(fallback, (fbStatErr, fbStats) => {
          if (fbStatErr || !fbStats.isFile()) return send(res, 404, 'Not Found', { 'Content-Type': MIME['.txt'] });
          return sendFile(req, res, fallback, fbStats);
        });
      }

      return sendFile(req, res, filePath, stats);
    });
  } catch {
    return send(res, 400, 'Bad Request');
  }
});

server.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}`);
  console.log(`Serving: ${ROOT}`);
});
