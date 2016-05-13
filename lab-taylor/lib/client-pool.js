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

function broadcast(data, socket, clientPool) {
  Object.keys(clientPool.pool).forEach((clientId) => {
    clientPool.pool[clientId].write(`${socket.wack.nickname}:: ${data.toString()}`);
  });
}

function parseCommands(data, socket, clientPool) {
  const commands = {
    '\\nick': updateNickname,
    '\\dogbomb\r\n': doggie
  };

  if (data.toString()[0] === '\\') {
    let cmd = data.toString().split(' ');
    if (commands[cmd[0]]){
      return commands[cmd[0]](cmd.slice(1).join(' '), socket, clientPool);
    } else {
      return broadcast('command not found\n', socket, clientPool);
    }
  }

  broadcast(data, socket, clientPool);
}

const updateNickname = function(newNickname, socket, clientPool){
  clientPool.pool[socket.wack.id].wack.nickname = newNickname.trim();
  broadcast(`${socket.wack.id} has a new nickname: ${newNickname.trim()}\n\n`, socket, clientPool);
  return clientPool;
};

const doggie = function(__, socket, clientPool) {
  const dog = '\n...... //^ ^\\\\' +'\n......(/(_•_)\\)' + '\n......_/\'\'*\'\'\\_' + '\n.....(,,,)^(,,,)\n\n';
  broadcast(dog, socket, clientPool);
};

function removeClient(socket, clientPool) {
  Object.keys(clientPool.pool).forEach( (clientId) => {
    if (socket.wack.id === clientId) {
      console.log(`removing ${socket.wack.nickname} from the pool`);
      delete clientPool.pool[clientId];
    }
  });
}

function registerClientListeners(socket, clientPool){
  socket.on('data', (data) => {
    console.log(`${socket.wack.nickname}:: ${data.toString()}`);
    clientPool.emit('broadcast', data, socket, clientPool);
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
    socket.write('welcome to wack!\n\ntry these commands\n\\dogbomb\n\\nick [newNickname]\n');
    registerClient(socket, this);
    registerClientListeners(socket, this);
  });

  this.on('broadcast', (data, user, pool) => {
  //  broadcast(data, user, pool);
    parseCommands(data, user, pool);
  });
};

ClientPool.prototype = Object.create(EventEmitter.prototype);
