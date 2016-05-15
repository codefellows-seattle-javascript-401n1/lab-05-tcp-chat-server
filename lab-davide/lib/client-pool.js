'use strict';

const EventEmitter = require('events').EventEmitter;

 // register socket(clients) to the pool
function registerClient(socket, clientPool){
  socket.wack = {};
  socket.wack.id = 'user_' + Date.now();
  clientPool.pool[socket.wack.id] = socket;
}

 // register event listeners to the new sockets(clients)
function registerClientListeners(socket, clientPool){
   // data event is triggered when ever the socket sends data

   // data event is triggered when the socket(client) closes the connection
  socket.on('close', function(data){
   //per direction, delete from the clientpool property//
    delete clientPool[socket.wack.id];
    var message = socket.wack.id + ': ' + data.toString();
    console.log(message + 'a client has disconnected');
  });

   // error event is triggered when the socket(client) has an error
  socket.on('error', function(err){
    console.error('CLIENT ERROR:', err.message);
  });
  //adding broadcast function here//
}
function broadcast(socket, clientPool) {
  socket.on('data', function(data){
    var message = socket.wack.id + ': ' + data.toString();
    console.log(message);
    Object.keys(clientPool.pool).forEach(function(clientId){
      clientPool.pool[clientId].write(data.toString());
    });
  });
}

 // Create an object constructor that inherets from EventEmitter
 // give it a property called pool for registering connections to
const ClientPool = module.exports = function(){
   // inheret the EventEmitter property's
  EventEmitter.call(this);
  this.pool = {};

   // when the register event is emited add the sockek(client)
   // to the pool, and register eventEmitters with the socket
  this.on('register', (socket) => {
    socket.write('welcome sluggy!\n');
    registerClient(socket, this);
    registerClientListeners(socket, this);
  });
  this.on('broadcast', (socket) => {
    broadcast(socket, this);
  });
};

 // inheret the EventEmitter's methods
ClientPool.prototype = Object.create(EventEmitter.prototype);
