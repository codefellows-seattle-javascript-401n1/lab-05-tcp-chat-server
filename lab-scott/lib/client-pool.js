'use strict';

const uuid = require('node-uuid');
const EventEmitter = require('events').EventEmitter;

const ClientPool = module.exports = function() {
  EventEmitter.call(this);
  this.pool = {};

  this.on('register', (socket) => {
    createClient(socket, this);
    createClientListener(socket, this);
    socket.write('Hello ' + socket.wack.id + '\n');
  });

  this.on('broadcast', (data) => {
    Object.keys(this.pool).forEach((id) => {
      this.pool[id].write(data.toString());
    });
  });
};

ClientPool.prototype = Object.create(EventEmitter.prototype);

function createClient(socket, clientPool) {
  socket.wack = {};
  socket.wack.id = 'client_' + uuid.v1();
  socket.wack.nick = 'guest_' + ~~(Math.random() * (100 -1) + 1);
  clientPool.pool[socket.wack.id] = socket;
}

function createClientListener(socket, clientPool) {
  socket.on('data', (data) => { clientPool.emit('broadcast', socket.wack.nick + ': ' + data); });
  socket.on('error', (err) => { console.error('Client Error:', err.message); });
  socket.on('close', () => {
    console.log('Socket closed');
    clientPool.pool[socket.wack.id].unref();
    delete clientPool.pool[socket.wack.id];
  });
}
