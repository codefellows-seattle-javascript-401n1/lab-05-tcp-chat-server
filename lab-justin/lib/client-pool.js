'use strict';

const EventEmitter = require('events').EventEmitter;
var uuid = require('node-uuid');

function registerClient(socket, clientPool) {
  socket.wack = {};
  socket.wack.id = 'client_' + Date.now();
  clientPool.pool[socket.wack.id] = socket;

}

//register e listeners to teh new sockets?
function registerClientListeners(socket, clientPool){
//data event triggered whenever the socket sends data and the socket(client) closes the conexion
  socket.on('data', function(data){
    console.log(data.toString().toUpperCase());
    clientPool.emit('broadcast', data);

  });
//if socket closes conexion data Event triggered
  socket.on('close', function(){
    delete clientPool.pool[socket.wack.nickName];
    console.log(socket.wack.nickName, ' client has disconnected');

  });

//same as above but with error with error event
  socket.on('error', function(err){
    console.error('Client Error: ', err.message);

  });
}

// inherits from EE, -> property pool for registration
const ClientPool = module.exports = function(){
  EventEmitter.call(this);
  this.pool = {};

  this.on('register', (socket) =>{
    socket.write('Hello PEEPS! \n');
    registerClient(socket, this);
    registerClientListeners(socket, this);
//When sockets are registered with the ClientPool they should be given a randomly generated id that will be used as their key on the ClientPool's pool property
    socket.wack = {};
    // socket.wack.id = 'user_' + Date.now();
    socket.wack.nickName = 'guest-' + uuid.v4();
    socket.write(socket.wack.nickName + ': ');


  });

  this.on('broadcast', (data)=>{
    Object.keys(this.pool).forEach((clientId) =>{
      this.pool[clientId].write(data.toString().toUpperCase());

    });
  });


//When a socket emits the close event the socket should be removed from the ClientPool
  this.on('close', (socket) =>{
    socket.delete();

  });
};

ClientPool.prototype = Object.create(EventEmitter.prototype);
