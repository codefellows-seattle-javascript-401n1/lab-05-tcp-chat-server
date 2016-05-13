'use strict';

const net = require('net');
const port = process.argv[2] || 3000;
const ClientPool = require('./lib/client-pool');
const wackPool = new ClientPool();
const server = net.createServer();

server.on('connection', function(socket){
  wackPool.emit('register', socket);
});

server.on('error', function(err){
  console.error('CLIENT ERROR', err.message);
});
//err -> log it on stderr
//-> listen to the connection
server.listen(port, function(){
  console.log('Server is Running!', port);

});
