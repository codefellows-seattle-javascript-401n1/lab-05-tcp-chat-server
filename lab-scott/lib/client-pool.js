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
    parseCommand(data, this);
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
  });
}

function parseCommand(data, clientPool) {
  let dataString = data.toString().split(' ');
  if (dataString[1].match(/^\/nick/ig) && dataString[2]) {
    let nick = dataString[2].split('\n');
    changeNick(data, clientPool, nick[0]);
  } else {
    Object.keys(clientPool.pool).forEach((id) => {
      clientPool.pool[id].write(data.toString());
    });
  }
}

function changeNick(data, clientPool, newNick) {
  Object.keys(clientPool.pool).forEach((id) => {
    clientPool.pool[id].wack.nick = newNick;
    clientPool.pool[id].write('nick changed to ' + newNick);
  });
}
