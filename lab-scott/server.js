'use strict';

const net = require('net');
const port = process.argv[2] || 3000;
const ClientPool = require('./lib/client-pool');
const wackPool = new ClientPool();
const server = module.exports = net.createServer();

server.on('connection', (socket) => { wackPool.emit('register', socket); });
server.on('close', () => { console.log('A client has ended their session'); });
server.on('error', (err) => { console.error('Server Error', err.message); });
server.listen(port, () => { console.log('Server running on port:', port); });
