'use strict';

const expect = require('chai').expect;
const ClientPool = require('../lib/client-pool');
const wackPool = new ClientPool();

describe('clientPool module', () => {
  describe('registerClient()', () => {
    const fakeSocket = {};
    fakeSocket.on = function() {console.log('fake on method');};
    fakeSocket.write = function () {console.log('hello world');};

    it('should add a client to the socket object', () => {
      wackPool.emit('register', fakeSocket);
      expect(wackPool).to.have.property('pool');
      expect(Object.keys(wackPool.pool)).to.have.length(1);
    });
  });
});
