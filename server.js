const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.json': 'application/json'
};

const server = http.createServer((req, res) => {
    // Correctly handle query strings and hashes to prevent 404s
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let filePath = '.' + url.pathname;
    
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if(err.code == 'ENOENT'){
                res.writeHead(404);
                res.end("404 Not Found");
            } else {
                res.writeHead(500);
                res.end("500 Internal Server Error: " + err.code);
            }
        } else {
            // Relaxed CSP for local development and Google Challenge demo to prevent font/icon blocking
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n============ SYSTEM ONLINE ============`);
    console.log(`VANTAGE 2026 Core running at: http://0.0.0.0:${PORT}`);
    console.log(`=======================================\n`);
});
