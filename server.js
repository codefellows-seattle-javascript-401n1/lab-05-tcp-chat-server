'use strict';

const net = require('net');
const server = net.createServer();

const port = process.argv[2] || 3000;
const ClientPool = require('./lib/client-pool');
const wackPool = new ClientPool();

server.on('connection', function(socket){
  wackPool.emit('register', socket);
});
//
// server.on('error', function(err){
//   console.error('Client error', err.message);
// });
server.on('error', function(err){
  console.error('Server error', err.message);
});

server.listen(port,function(){
  console.log('The Server hath Commenced on ' + port);
});
