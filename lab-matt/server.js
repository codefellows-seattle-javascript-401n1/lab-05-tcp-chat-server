'use strict';

const net = require('net');
const port = process.argv[2] || 4000;
const ClientPool = require('./lib/clientPool');
const wackPool = new ClientPool();
const server = net.createServer();

server.on('connection', function(socket){
  wackPool.emit('register', socket);
});
server.on('error', function(err){
  console.log('SERVER ERROR: ' + err.message);
});
server.listen(port, function(){
  console.log('server is running on port: ' + port);
});
