'use strict';

const EventEmitter = require('events').EventEmitter;

function registerClient(socket, clientPool){
  socket.wack = {};
  socket.wack.id = 'user_' + Date.now();
  socket.wack.nickname = 'something';
  clientPool.pool[socket.wack.id] = socket;
}

function registerClientListeners(socket, clientPool){
  socket.on('data', function(data){
    console.log(data.toString());
  });

  socket.on('broadcast', function(data){
    return data.toString;
  });

  socket.on('close', function(socket, clientPool){
    delete clientPool[socket.wack.id];
    //remove client from pool, you have access to socket.wack.id
    //so just delete that property from clientpool
  });

  socket.on('error', function(err){
    console.error('CLIENT ERROR: ', err.message);
  });
}

const ClientPool = module.exports = function(){
  EventEmitter.call(this);
  this.pool = {};
  this.on('register', (socket)=> {
    socket.write('welcome sluggy!\n');//write back to source of socket
    registerClient(socket, this);//this is wackPool
    registerClientListeners(socket, this);//this is wackPool
  });
  this.on('broadcast', function(socket, message){
  Object.keys(clientPool.pool).forEach(function(clientId){
  clientPool.pool[clientId].write(data.toString());
};

ClientPool.prototype = Object.create(EventEmitter.prototype);
