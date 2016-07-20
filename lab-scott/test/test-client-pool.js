'use strict';

const server = require('../server');
const chai = require('chai');
const net = require('net');
const ClientPool = require('../lib/client-pool');
const wackPool = new ClientPool();

describe('client-pool module', () => {
  describe('createClient', () => {
    const testSocket = {};
    testSocket.on = () => { console.log('test fake on'); };
    testSocket.write = () => { console.log('Flibbity Jibbit was here!'); };

    it('should register new client to socket', (done) => {
      wackPool.emit('register', testSocket);
      chai.expect(wackPool).to.have.any.keys('pool');
      chai.expect(Object.keys(wackPool.pool)).to.have.length(1);
      done();
    });
  });

  describe('Test tcp server', function () {
    before(function() {
      server.listen(3000, function() { console.log('Listening on 3000'); });
    });

    it('Should reply with Hello client', function (done) {
      var client = net.connect({ port:3000 }, function() {
        client.write('WATMAN!');
      });

      client.on('data', function(data) {
        console.log('data', data.toString());
        client.end();
      });

      done();
    });

    after(function() {
      server.close();
    });
  });
});
