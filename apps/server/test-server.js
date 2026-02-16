const http = require('http');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Minimal Server is UP!');
});

server.listen(port, '0.0.0.0', () => {
    console.log(`Minimal server running at http://0.0.0.0:${port}/`);
    console.log(`Environment PORT: ${process.env.PORT}`);
});

if (port != 3000) {
    const server2 = http.createServer((req, res) => {
        res.end('Minimal Server (Port 3000) is UP!');
    });
    server2.listen(3000, '0.0.0.0', () => {
        console.log('Also listening on hardcoded port 3000');
    });
}

// Keep alive
setInterval(() => {
    console.log('Minimal server heartbeat...');
}, 10000);
