const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/json-array') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        const { numbers } = data;

        // Перевірка
        if (!Array.isArray(numbers)) {
          res.writeHead(422, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: "Invalid data" }));
        }

        if (!numbers.every(n => typeof n === 'number')) {
          res.writeHead(422, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: "Invalid data" }));
        }

        const count = numbers.length;

        if (count === 0) {
          return res.end(JSON.stringify({
            count: 0,
            sum: 0,
            average: 0
          }));
        }

        const sum = numbers.reduce((a, b) => a + b, 0);
        const average = sum / count;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          count,
          sum,
          average
        }));

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