'use strict';

const EventEmitter = require('events').EventEmitter;
var uuid = require('node-uuid');

function registerClient(socket, clientPool) {
  socket.wack = {};
  socket.wack.id = 'client_' + Date.now();
  clientPool.pool[socket.wack.id] = socket;
}

function registerClientListeners(socket, clientPool){
  socket.on('data', function(data){
    console.log(data.toString().toUpperCase());
    clientPool.emit('broadcast', data);
  });

  socket.on('close', function(){
    delete clientPool.pool[socket.wack.nickName];
    console.log(socket.wack.nickName, ' client has disconnected');
  });
  
  socket.on('error', function(err){
    console.error('Client Error: ', err.message);
  });
}

const ClientPool = module.exports = function(){
  EventEmitter.call(this);
  this.pool = {};

  this.on('register', (socket) =>{
    socket.write('Hello PEEPS! \n');
    registerClient(socket, this);
    registerClientListeners(socket, this);

    socket.wack = {};
    socket.wack.nickName = 'guest-' + uuid.v4();
    socket.write(socket.wack.nickName + ': ');
  });

  this.on('broadcast', (data)=>{
    Object.keys(this.pool).forEach((clientId) =>{
      this.pool[clientId].write(data.toString().toUpperCase());
    });
  });

  this.on('close', (socket) =>{
    socket.delete();
  });
};

ClientPool.prototype = Object.create(EventEmitter.prototype);
