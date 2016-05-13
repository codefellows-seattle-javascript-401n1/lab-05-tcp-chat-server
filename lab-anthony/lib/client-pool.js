'use strict';

const EventEmitter = require('events');
const uuid = require('node-uuid');

function registerClient(socket, clientpool) {
  socket.chat = {};
  socket.chat.nick = 'guest_'+clientpool.guests;
  socket.chat.id = 'client_' + uuid.v4();
  clientpool.pool[socket.chat.id] = socket;
}

function registerClientListeners(socket, clientpool) {
  socket.on('data', (data) => {
    clientpool.emit('broadcast', data, socket);
  });

  socket.on('close', () => {
    console.log(socket.chat.id + 'has disconnected.');
    delete clientpool.pool[socket.chat.id];
  });

  socket.on('error', function(err) {
    console.error('CLIENT ERROR: ', err.message);
  });
}

const ClientPool = module.exports = function() {
  EventEmitter.call(this);
  this.pool = {};
  this.guests = 0;

  this.on('register', (socket) => {
    socket.write('Welcome new client!\n');
    this.guests++;
    registerClient(socket, this);
    registerClientListeners(socket, this);
  });

  this.on('broadcast', (data, socket) => {
    // console.log(clientpool.pool);
    Object.keys(this.pool).forEach((clientId)=>{
      this.pool[clientId].write(socket.chat.nick +': '+ data.toString());
    });
  });
};

ClientPool.prototype = Object.create(EventEmitter.prototype);
