'use strict';

const EventEmitter = require('events').EventEmitter;

function registerClient(socket, clientPool){
  socket.wack = {};
  socket.wack.id = 'user_' + Date.now();
  clientPool.pool[socket.wack.id] = socket;
}

function broadcast(data, clientPool) {
  Object.keys(clientPool.pool).forEach((clientId) => {
    clientPool.pool[clientId].write(data.toString());
  });
}

function removeClient(socket, clientPool) {

  Object.keys(clientPool.pool).forEach( (clientId) => {
    if (socket.wack.id === clientId) {
      console.log(`removing ${socket.wack.id} from the pool`);
      delete clientPool[clientId];
    }
  });
}

function registerClientListeners(socket, clientPool){
  socket.on('data', (data) => {
    console.log(data.toString());
    broadcast(data, clientPool);
  });

  socket.on('close', () => {
    console.log('a client has disconnected');
    removeClient(socket, clientPool);

  });

  socket.on('error', (err) => {
    console.error('CLIENT ERROR:: ', err.message);
  });
}

const ClientPool = module.exports = function () {
  EventEmitter.call(this);
  this.pool = {};

  this.on('register', (socket) => {
    socket.write('selcome to wack!\n');
    registerClient(socket, this);
    registerClientListeners(socket, this);
  });
};

ClientPool.prototype = Object.create(EventEmitter.prototype);
