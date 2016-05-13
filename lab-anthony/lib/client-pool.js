'use strict';

const EventEmitter = require('events');
const uuid = require('node-uuid');

function registerClient(socket, clientpool) {
  socket.chat = {};
  socket.chat.nick = 'guest_'+ Math.floor(Math.random() * (1000 - 1)) + 1;
  socket.chat.id = 'user_' + uuid.v4();
  clientpool.pool[socket.chat.id] = socket;
}

function registerClientListeners(socket, clientpool) {
  socket.on('data', (data) => {
    if ((data.toString()).indexOf('\\nick') > -1){
      var firstNick = socket.chat.nick;
      clientpool.emit('newnick', data, socket);
      var changedName = firstNick +' changed nickname to '+ socket.chat.nick;
      clientpool.emit('broadcast', changedName, socket);
      return;
    }
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

  this.on('register', (socket) => {
    socket.write('Welcome new client!\n');
    registerClient(socket, this);
    registerClientListeners(socket, this);
  });

  this.on('broadcast', (data, socket) => {
    Object.keys(this.pool).forEach((clientId)=>{
      this.pool[clientId].write(socket.chat.nick +': '+ data.toString());
    });
  });

  this.on('newnick', (data, socket) => {
    var string = data.toString();
    socket.chat.nick = (string.slice(6)).replace(/\r?\n|\r/,'');
  });
};

ClientPool.prototype = Object.create(EventEmitter.prototype);
