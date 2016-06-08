'use strict';

const EventEmitter = require('events').EventEmitter;
const uuid = require('node-uuid');


//create client data
function registerClient(socket, chatPool){
  socket.chat = {};
  socket.chat.nick= 'guest_'+Math.floor(Math.random()*(100-1))+1;
  socket.chat.id = 'user_'+uuid.v4();
  chatPool.pool[socket.chat.id] = socket;

}
//broadcast data,chat,leaving message to all other client
function registerClientListeners(socket, chatPool){
  socket.on('data', function(data){
    if((data.toString()).indexOf('\\nick')>-1){
      var firstNick = socket.chat.nick;
      chatPool.emit('newnick', data, socket);
      var changeName = firstNick + ' changed nickname to '+socket.chat.nick;
      chatPool.emit('broadcast', changeName, socket);
      return ;
    }
    chatPool.emit('broadcast',data, socket);


  });

  socket.on('close', function(chatpool){
    console.log(socket.chat.id+' has disconnected');
    delete chatpool.pool[socket.chat.id];
  });
  //send error message
  socket.on('error', function(err){
    console.error('CLIENT ERROR: ', err.message);
  });
}


const ClientPool = module.exports = function(){
  EventEmitter.call(this);
  this.pool = {};
  this.on('register', (socket)=>{
    socket.write('Welcome to the chat room!\n');
    registerClient(socket, this);
    registerClientListeners(socket, this);
  });
  this.on('broadcast', (data, socket) => {
    Object.keys(this.pool).forEach((clientId)=>{
      this.pool[clientId].write(socket.chat.nick +': ' + data.toString());
    });
  });
  this.on('newnick', (data,socket)=>{
    var string = data.toString();
    socket.chat.nick = (string.slice(6)).replace(/\r?\n|\r/,'');
  });
};

ClientPool.prototype = Object.create(EventEmitter.prototype);
