'use strict';

const EventEmitter = require('events').EventEmitter;
const uuid = require('node-uuid');

function registerClient(socket, clientPool){
  socket.chat = {};
  socket.chat.nick='client_' + Math.floor(Math.random()*(100-1)) +1;
  socket.chat.id = 'user_' + uuid.v4();
  clientPool.pool[socket.chat.id] = socket;
}

function registerClientListeners(socket, clientPool) {
  socket.on('data', (data) => {
    if ((data.toString()).indexOf('\\nick') > -1) {
      var firstNick = socket.chat.nick;
      clientPool.emit('newnick', data, socket);
      var changedName = firstNick + ' changed nickname to ' + socket.chat.nick;
      console.log([socket.chat.id]+data.toString());
      clientPool.emit('broadcast', changedName, socket);
      return;
    }
    clientPool.emit('broadcast', data, socket);
  });

  socket.on('close', () =>{
    console.log('client: ' + [socket.chat.id]+ 'has left the chat');
    delete clientPool.pool[socket.chat.id];
  });

  socket.on('error', function(err){
    console.error('Client ERROR', err.message);
  });
}

const ClientPool = module.exports = function(){
  EventEmitter.call(this);
  this.pool = {};
  this.on('register', (socket) => {
    socket.write('Welcome Code Fellows 401n1 to our chat room! \n');
    registerClient(socket, this);
    registerClientListeners(socket, this);
  });

  this.on('broadcast', (data, socket) => {
    Object.keys(this.pool).forEach((clientId)=> {
      this.pool[clientId].write(socket.chat.nick + ': '+ data.toString());
    });
  });
  this.on('newnick', (data, socket) =>{
    const Ndata = Ndata.toString();
    socket.chat.nick = (String.slice(6)).replace(/\r?\n|r/, '');
  });
};
ClientPool.prototype = Object.create(EventEmitter.prototype);
