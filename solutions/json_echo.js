const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/json-echo') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      if (!body) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }

      try {
        const data = JSON.parse(body);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));

      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

const PORT = process.argv[2] || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});