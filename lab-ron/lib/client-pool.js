'use strict';

const EventEmitter = require('events').EventEmitter;
const uuid = require('node-uuid');

function registerClient(socket, clientPool){
  socket.wack = {};
  socket.wack.nick='client_' + Math.floor(Math.random()*(100-1)) +1;
  socket.wack.id = 'user_' + uuid.v4();
  clientPool.pool[socket.wack.id] = socket;
  console.log(socket.wack.id);
}

function registerClientListeners(socket, clientPool) {
  socket.on('data', (data) => {
    if ((data.toString()).indexOf('\\nick') > -1) {
      var firstNick = socket.wack.nick;
      clientPool.emit('newnick', data, socket);
      var changedName = firstNick + ' changed nickname to ' + socket.wack.nick;
      console.log([socket.wack.id]+data.toString());
      clientPool.emit('broadcast', changedName, socket);
      return;
    }
    clientPool.emit('broadcast', data, socket);
  });
    // console.log('socket', socket);
  // Object.keys(clientPool.pool).forEach(function(clientId){
  // clientPool.pool[clientId].write([socket.wack.id]+ ' ' +data.toString());
  // });

  socket.on('close', () =>{
    console.log('client: ' + [socket.wack.id]+ 'has left the chat');
    // Object.keys(clientPool.pool).forEach(function(clientId){
    delete clientPool.pool[socket.wack.id];
  });
    //   clientpool.emit('broadcast', socket.wack.nick + 'has disconnected.', socket);
    // });

  socket.on('error', function(err){
    console.error('Client ERROR', err.message);
  });

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
        this.pool[clientId].write(socket.wack.nick + ': '+ data.toString());
      });
    });
    this.on('newnick', (data, socket) =>{
      const Ndata = Ndata.toString();
      socket.wack.nick = data.slice(6).trim();
      // replace(/\n/, ''));
    });
  };

//data.trim();
//     registerClient(socket, this);
//     registerClientListeners(socket, this);
//     clientPool.pool[clientId].write([socket.wack.id]+ ' ' +data.toString());

  ClientPool.prototype = Object.create(EventEmitter.prototype);
}
