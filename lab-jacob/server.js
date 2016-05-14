'use strict';

const net = require('net'); // helps create TCP servers and clients
const port = process.argv[2] || 3000;
const ClientPool = require('./lib/client-pool');
const clientPool = new ClientPool();

const server = net.createServer();


server.on('connection', function(socket){ //event waiting for connection
  clientPool.emit('register', socket);
});

server.on('error', function(err){
  console.error('SERVER ERROR: ', err.message);
});

server.listen(port, function(){
  console.log('server is running on port', port);
});
