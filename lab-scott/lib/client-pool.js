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

  this.on('broadcast', (data, socket) => {
    parseCommand(data, socket, this);
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
  socket.on('data', (data) => { clientPool.emit('broadcast', socket.wack.nick + ': ' + data, socket); });
  socket.on('close', () => {
    clientPool.pool[socket.wack.id].end();
    delete clientPool.pool[socket.wack.id];
  });
}

function parseCommand(data, socket, clientPool) {
  let dataString = data.toString().split(' ') || null;
  let nick = dataString[2] ? dataString[2].split('\n') : null;
  if (dataString[1].match(/^\/nick/ig) && dataString[2]) {
    changeNick(clientPool, socket, nick[0]);
  } else if (dataString[1].match(/^\/dm/ig) && dataString[2]) {
    let data = socket.wack.nick + ': ' + dataString.splice(3).join(' ');
    directMsg(data, clientPool, nick);
  } else if (dataString[1].match(/^\/users/ig)) {
    listUsers(clientPool);
  } else {
    Object.keys(clientPool.pool).forEach((id) => {
      clientPool.pool[id].write(data.toString());
    });
  }
}

function changeNick(clientPool, socket, newNick) {
  clientPool.pool[socket.wack.id].wack.nick = newNick;
  clientPool.pool[socket.wack.id].write('nick changed to ' + newNick + '\n');
}

function directMsg(data, clientPool, dmNick) {
  Object.keys(clientPool.pool).forEach((id) => {
    if (clientPool.pool[id].wack.nick === dmNick.toString()) {
      clientPool.pool[id].write(data.toString());
    }
  });
}

function listUsers(clientPool) {
  let users = [];
  Object.keys(clientPool.pool).forEach((id) => {
    users.push(clientPool.pool[id].wack.nick + ' ');
  });

  Object.keys(clientPool.pool).forEach((id) => {
    clientPool.pool[id].write('Users: ' + users.toString() + '\n');
  });
}
