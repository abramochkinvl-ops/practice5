const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/json-object') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        const { name, age } = data;

        // Валідація
        if (!name || age === undefined || typeof age !== 'number') {
          res.writeHead(422, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: "Invalid data" }));
        }

        const result = {
          greeting: `Hello ${name}`,
          isAdult: age >= 18
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));

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