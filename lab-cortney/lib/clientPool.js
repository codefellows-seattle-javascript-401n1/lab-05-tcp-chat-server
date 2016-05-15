'use strict';

var uuid = require('node-uuid'); // for generating random user numbers
const EventEmitter = require('events').EventEmitter;

function registerClient(socket, clientPool){
  socket.wack = {};
  socket.wack.id = 'client_' + uuid.v1();
  socket.wack.nick = 'guest_' + Math.floor(Math.random() * (100 - 1)) + 1;
  clientPool.pool[socket.wack.id] = socket;
}

function registerClientListeners(socket, clientPool){
  socket.on('data', function(data){
    console.log(socket.wack.id, ': ', data.toString());
    clientPool.emit('broadcast', socket.wack.nick + ': ' + data);
  });

  socket.on('close', function() {
    console.log('someone has disconnected');
    delete clientPool.pool[socket.wack];
  });

  socket.on('error', function(err){
    console.error('CLIENT ERROR:', err.message);
  });
}

const ClientPool = module.exports = function(){
  EventEmitter.call(this);
  this.pool = {};

  this.on('register', (socket) => {
    socket.write('welcome cort!\n');
    registerClient(socket, this);
    registerClientListeners(socket, this);
  });

  this.on('broadcast', (data) => {
    console.log(data.toString());
    Object.keys(this.pool).forEach((clientId) => {
      this.pool[clientId].write(data.toString());
    });
  });
};

ClientPool.prototype = Object.create(EventEmitter.prototype);
