'use strict';

const EventEmitter = require('events').EventEmitter;

function random() {
  return Math.floor(Math.random() * 5);
}
var nickNames = ['Troll', 'Mr. Smith', '42', 'Curry', 'Matt but better'];

function registerClient(socket, clientPool) {
  socket.wack = {};
  socket.wack.id = nickNames[random()];
  clientPool.pool[socket.wack.id] = socket;
}

function registerClientListeners(socket, clientPool) {

  socket.on('data', function(data) {
    clientPool.emit('broadcast', data);
    console.log(this.wack.id + ': ', data.toString());
  });


  socket.on('close', function() {
    console.log(`${socket.wack.id} has disconnected`);
    delete clientPool.pool[socket.wack.id];
  });
  socket.on('error', function(err) {
    console.error('CLIENT ERROR: ', err.message);
  });
}

const ClientPool = module.exports = function() {
  EventEmitter.call(this);
  this.pool = {};

  this.on('register', (socket) => {
    socket.write('welcome trolls!\n');
    registerClient(socket, this);
    registerClientListeners(socket, this);
  });

  this.on('broadcast', (data) => {
    Object.keys(this.pool).forEach((clientId) => {
      this.pool[clientId].write(data.toString());
    });
  });
};

ClientPool.prototype = Object.create(EventEmitter.prototype);
