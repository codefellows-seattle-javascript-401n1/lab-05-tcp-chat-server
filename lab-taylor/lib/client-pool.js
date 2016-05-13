'use strict';

const EventEmitter = require('events').EventEmitter;

function generateNickname() {
  const nicknameBase = ['monkey', 'slug', 'hippo', 'yeti', 'unicorn'];
  const idx = Math.floor(Math.random() * ( nicknameBase.length - 0));
  const num = Math.floor(Math.random() * (99 - 0));
  return `${nicknameBase[idx]}-${num}`;
}

function registerClient(socket, clientPool){
  socket.wack = {};
  socket.wack.id = 'user_' + Date.now();
  socket.wack.nickname = generateNickname();
  clientPool.pool[socket.wack.id] = socket;
}

function broadcast(data, user, clientPool) {
  Object.keys(clientPool.pool).forEach((clientId) => {
    clientPool.pool[clientId].write(`${user}:: ${data.toString()}`);
  });
}

function removeClient(socket, clientPool) {
  Object.keys(clientPool.pool).forEach( (clientId) => {
    if (socket.wack.id === clientId) {
      console.log(`removing ${socket.wack.nickname} from the pool`);
      delete clientPool[clientId];
    }
  });
}

function registerClientListeners(socket, clientPool){
  socket.on('data', (data) => {
    console.log(`${socket.wack.nicname}:: ${data.toString()}`);
    clientPool.emit('broadcast', data, socket.wack.nickname, clientPool);
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

  this.on('broadcast', (data, user, pool) => {
    broadcast(data, user, pool);
  });
};

ClientPool.prototype = Object.create(EventEmitter.prototype);
