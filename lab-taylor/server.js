'use strict';

const net = require('net');
const port = process.argv[2] || 3000;
const ClientPool = require('./lib/client-pool');
const wackPool = new ClientPool();

const server = net.createServer();

server.on('connection', (socket) => {
  wackPool.emit('register', socket);
});

server.on('error', (err) => {
  console.error('SERVER ERROR:: ', err.message);
});

server.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
