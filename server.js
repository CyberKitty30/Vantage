const http = require('http');
const fs = require('fs');
const path = require('path');

// Cloud Run provides the PORT environment variable.
const PORT = process.env.PORT || 8080;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Simple path resolution to avoid URL constructor issues
    let urlPath = req.url.split('?')[0];
    if (urlPath === '/') {
        urlPath = '/index.html';
    }

    const filePath = path.join(__dirname, urlPath);
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // If a file is missing, we still want to return a 200 for index.html 
                // in some SPA cases, but here we'll just 404.
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error: ' + err.code);
            }
        } else {
            // Cloud Run requires a fast response for health checks.
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;",
                'X-Content-Type-Options': 'nosniff'
            });
            res.end(content, 'utf-8');
        }
    });
});

// IMPORTANT: Must listen on 0.0.0.0 for Cloud Run
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
});

// Handle errors to prevent crash
server.on('error', (err) => {
    console.error('Server error:', err);
});
