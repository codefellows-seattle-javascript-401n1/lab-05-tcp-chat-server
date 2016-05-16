'use strict';

const userNames = ['blob', 'mustard', 'nose', 'frog'];
const EE = require('events').EventEmitter;

function registerClient(socket, ClientPool){
  socket.wack = {};
  socket.wack.id = userNames[Math.floor(Math.random() * 4)] + '_' + Date.now();
  ClientPool.pool[socket.wack.id] = socket;
  console.log(socket.wack.id + ' has connected');
}
function registerClientListeners(socket, clientPool){
  socket.on('data', function(data){
    console.log(socket.wack.id + ': ' + data.toString());
    clientPool.emit('broadcast', data);
  });

  socket.on('close', () => {
    console.log(socket.wack.id +' has disconnected');
    delete clientPool.pool[socket.wack.id];

  });
}

const ClientPool = module.exports = function(){
  EE.call(this);
  this.pool = {};

  this.on('register', (socket) => {
    socket.write('welcome you son of a b\n');
    registerClient(socket, this);
    registerClientListeners(socket, this);
  });

  this.on('broadcast', (data) => {
    Object.keys(this.pool).forEach((clientId)=> {
      this.pool[clientId].write(data.toString());
    });
  });
};

ClientPool.prototype = Object.create(EE.prototype);
