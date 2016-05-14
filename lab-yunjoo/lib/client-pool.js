'use strict';

const EventEmitter = require('events').EventEmitter;

function registerClient(socket, chatPool){
  socket.chat = {};
  socket.chat.id = 'client_'+Date.now();
  chatPool.pool[socket.chat.id] = socket;

}

function registerClientListeners(socket, chatPool){
  socket.on('data', function(data){
    console.log(data.toString());
    Object.keys(chatPool.pool).forEach(function(clientId){
      chatPool.pool[clientId].write(data.toString());
    });
  });

  socket.on('close', function(){
    console.log('a client has disconnected');
  });
  socket.on('error', function(err){
    console.error('CLIENT ERROR: ', err.message);
  });
}

const ClientPool = module.exports = function(){
  EventEmitter.call(this);
  this.pool = {};
  this.on('register', (socket)=>{
    registerClient(socket, this);
    socket.write(this.pool[socket.chat.id]+'\n');
    registerClientListeners(socket, this);
  });
};
ClientPool.prototype = Object.create(EventEmitter.prototype);
