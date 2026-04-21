const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/json-calc') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        const { a, b, operation } = data;

        // Перевірка на наявність
        if (a === undefined || b === undefined || !operation) {
          res.writeHead(422, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: "Missing fields" }));
        }

        if (typeof a !== 'number' || typeof b !== 'number') {
          res.writeHead(422, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: "Invalid data" }));
        }

        let result;

        switch (operation) {
          case 'add':
            result = a + b;
            break;
          case 'subtract':
            result = a - b;
            break;
          case 'multiply':
            result = a * b;
            break;
          case 'divide':
            if (b === 0) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ error: "Division by zero" }));
            }
            result = a / b;
            break;
          default:
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: "Invalid operation" }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ result }));

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