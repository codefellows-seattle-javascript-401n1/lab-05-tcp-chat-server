'use strict';

const uuid = require('node-uuid');
const EventEmitter = require('events').EventEmitter;

const ClientPool = module.exports = function() {
  EventEmitter.call(this);
  this.pool = {};

  this.on('register', (socket) => {
    createClient(socket, this);
    createClientListener(socket, this);
    socket.write('Hello ' + socket.wack.nick + '\n');
  });

  this.on('broadcast', (data) => {
    Object.keys(this.pool).forEach((id) => {
      this.pool[id].write(data.toString());
    });
  });

  this.on('close', () => {
    removeClients(this);
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
  socket.on('error', (err) => { console.error('Client Error:', err.message); });
  socket.on('data', (data) => { clientPool.emit('broadcast', socket.wack.nick + ': ' + data); });
  socket.on('close', () => {
    clientPool.pool[socket.wack.id].end();
    delete clientPool.pool[socket.wack.id];
    // console.log('Socket closed');
  });
}

function removeClients(clientPool) {
  // console.log('WACK', clientPool);
  // if (Object.keys(clientPool.pool).length) {
  //   Object.keys(clientPool.pool).forEach((socket) => {
  //     delete clientPool.pool[socket.wack.id];
  //     clientPool.pool[socket.wack.id].end();
  //   });
  // }
}

// On 'data': check incoming data for a wack '/'.
  // If present: separate wack and command, then check if command is valid (throw err if not)

  // If not present: pass onto clientPool 'broadcast'
