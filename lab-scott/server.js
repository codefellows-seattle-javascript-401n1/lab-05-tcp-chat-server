'use strict';

const net = require('net');
const port = process.argv[2] || 3000;
const ClientPool = require('./lib/client-pool');
const wackPool = new ClientPool();
const killServer = require('./lib/killServer');
const server = module.exports = net.createServer();

killServer(server);

server.on('connection', (socket) => { wackPool.emit('register', socket); });
server.on('close', () => { server.kill(); });
server.on('error', (err) => { console.error('Server Error', err.message); });
server.listen(port, () => { console.log('Server running on port:', port); });
