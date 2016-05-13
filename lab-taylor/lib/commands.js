'use strict';

exports.doggie = function(__, socket, clientPool, cb) {
  const dog = '\n...... //^ ^\\\\' +'\n......(/(_•_)\\)' + '\n......_/\'\'*\'\'\\_' + '\n.....(,,,)^(,,,)\n\n';
  cb(dog, socket, clientPool);
};

exports.updateNickname = function(newNickname, socket, clientPool, cb){
  clientPool.pool[socket.wack.id].wack.nickname = newNickname.trim();
  cb(`${socket.wack.id} has a new nickname: ${newNickname.trim()}\n\n`, socket, clientPool);
};
