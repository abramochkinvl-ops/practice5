const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/json-nested') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        const user = data.user;

        // Перевірки
        if (!user || !user.roles || !Array.isArray(user.roles)) {
          res.writeHead(422, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: "Invalid data" }));
        }

        const name = user.name;
        const roles = user.roles;

        const result = {
          name: name,
          roleCount: roles.length,
          isAdmin: roles.includes("admin")
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