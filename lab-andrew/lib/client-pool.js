'use strict';

const EventEmitter = require('events').EventEmitter;
const uuid = require('node-uuid');



function registerClient(socket, clientPool) {
  socket.wack = {};
  socket.wack.id = 'User: ' + uuid.v4();
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
    console.log('register hit');
    socket.write('welcome trolls!\n');
    registerClient(socket, this);
    registerClientListeners(socket, this);
    socket.write(socket.wack.id + ' has logged on\n');
    console.log(socket.wack.id + ' has connected');
  });

  this.on('broadcast', (data) => {
    Object.keys(this.pool).forEach((clientId) => {
      this.pool[clientId].write(data.toString());
    });
  });
};

ClientPool.prototype = Object.create(EventEmitter.prototype);
