'use strict';

const EventEmitter = require('events').EventEmitter;
const uuid = require('node-uuid');

function registerClient(socket, clientPool){
  socket.wack = {};
  socket.wack.id = 'User_' + uuid.v4();
  clientPool.pool[socket.wack.id] = socket;
}

function registerClientListeners(socket, clientPool){
  socket.on('data', function(data){
    clientPool.emit('broadcast', data, socket);
  });

  socket.on('close', function(){
    console.log(socket.wack.id + ' has disconnected');
    delete clientPool.pool[socket.wack.id];
  });

  socket.on('error', function(err){
    console.error('CLIENT ERROR: ', err.message);
  });
}

const ClientPool = module.exports = function() {
  EventEmitter.call(this); //(call) tells a function what context this should be
  this.pool = {};

  this.on('register', (socket) => { //need to use fat arrow to give this scope of the outer function!
    socket.write('welcome to Wack Chat!\n');
    registerClient(socket, this);
    registerClientListeners(socket, this);
    socket.write(socket.wack.id + ' has joined the chat\n');
    console.log(socket.wack.id + ' has connected');
  });

  this.on('broadcast', (data, socket) => {//broadcasts message data to client pool
    console.log(socket.wack.id + ': ' + data);
    Object.keys(this.pool).forEach( (clientId) => { //double fat arrow!
      this.pool[clientId].write(socket.wack.id + ': ' + data.toString());
    });
  });
};

ClientPool.prototype = Object.create(EventEmitter.prototype);
