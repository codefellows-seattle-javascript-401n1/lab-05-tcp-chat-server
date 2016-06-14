'use strict';

const EventEmitter = require('events').EventEmitter;
const uuid = require('node-uuid');

function registerClient(socket, clientPool){
  var ranNum = Math.floor(Math.random() * 1000 + 1);
  socket.wack = {};
  socket.wack.id = 'user_' + uuid.v4();
  socket.wack.nickname = 'guest-' + ranNum;
  clientPool.pool[socket.wack.id] = socket;
}

function registerClientListeners(socket, clientPool){
  socket.on('data', function(data){
    console.log(socket.wack.nickname, data.toString());
  });

  socket.on('broadcast', function(data){
    return data.toString();
    //send response to each member of the pool
  });

  socket.on('close', function(socket, clientPool){
    delete clientPool[socket.wack.id];
    //remove client from pool, you have access to socket.wack.id
    //so just delete that specific property from clientPool
  });

  socket.on('error', function(err){
    console.error('CLIENT ERROR: ', err.message);
  });
}

const ClientPool = module.exports = function(){
  EventEmitter.call(this);/*inherting the eventEmmitter PROPERTIES*/
  this.pool = {};
  this.on('register', (socket)=> {
    socket.write('welcome sluggy!\n');//write back to source of socket
    registerClient(socket, this);//this is wackPool
    registerClientListeners(socket, this);//this is wackPool
  });
  this.on('broadcast', function(socket, message){
    Object.keys(this.pool).forEach(function(clientId){
      clientPool.pool[clientId].write(message.toString());
    });
  });
};

ClientPool.prototype = Object.create(EventEmitter.prototype);//inherting all the eventEmmitter METHODS like 'on'
