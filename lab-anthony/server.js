'use strict';

const net = require('net');
const server = net.createServer();
const PORT = process.argv[2] || 3000;
const ClientPool = require('./lib/client-pool');
const chatter = new ClientPool();

server.on('connection', function(socket) {
  chatter.emit('register', socket);
});

server.on('error', function(err) {
  console.error('SERVER ERROR: ', err.message);
});

server.listen(PORT, function(){
  console.log('server has started');
});
