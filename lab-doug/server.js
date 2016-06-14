'use strict';

const net = require('net');
const port = process.argv[2]  || 3000;
const ClientPool = require(__dirname + '/lib/client-pool');
const wackPool = new ClientPool();
const server = net.createServer();

/*
net.connection event returns socket with lots of data including close, err, data, socket id...)
*/
server.on('connection', function(socket){
  wackPool.emit('register', socket);
  wackPool.emit('broadcast', socket);
});

server.on('error', function(err){
  console.error('SERVER ERROR: ', err.message);
});

server.listen(port, function(){
  console.log('server is running on port: ', port);
});
