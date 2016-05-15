'use strict';

const EE = require('events').EventEmitter;

function registerClient(socket, ClientPool){
  socket.chat = {};
  socket.chat.id = 'client_' + Date.now();
  ClientPool.pool[socket.chat.id] = socket;
  var numbersMan = Date.now().toString();
  var numbersWords = []
  for (var i = 0; i < numbersMan.length; i += 1) {
    numbersWords.push(+numbersMan.charAt(i));
  };
  socket.chat.nickName = 'Guest_' + numbersWords.reduce(function(a,b){
    return a + b;
  });
};

function registerClientListener(socket, clientPool){
  socket.on('data', function(data){
    console.log(data.toString());
    clientPool.emit('broadcast', data, socket);
  });
  socket.on('close', function(){
    console.log('client disconnected');
  });
  socket.on('error', function(err){
    console.log('CLIENT ERROR', err.message);
  });
};

const ClientPool = module.exports = function ClientPool(){
  EE.call(this);
  this.pool = {};

  this.on('register', (socket) => {
    registerClient(socket, this);
    registerClientListener(socket, this);
    socket.write('Welcome to Last-Chat! ' + 'You are ' + socket.chat.nickName + '\n');
  });

  this.on('broadcast', (data, socket) => {
    Object.keys(this.pool).forEach((clientId) => {
      this.pool[clientId].write(socket.chat.nickName + ': ' + data.toString());
    });
  })
};

ClientPool.prototype = Object.create(EE.prototype);
