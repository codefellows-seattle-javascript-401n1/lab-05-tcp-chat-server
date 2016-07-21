'use strict';

const server = require('../server');
const chai = require('chai');
const net = require('net');
// const ClientPool = require('../lib/client-pool');
// const wackPool = new ClientPool();

describe('client-pool module', () => {
  describe('Test tcp server', function () {
    before((done) => {
      server.listen(3000);
      done();
    });

    describe('Connect to TCP server', function() {
      let client;
      before((done) => {
        client = net.createConnection({ port:3000 });
        done();
      });

      it('Should include Hello upon connection', function (done) {
        client.once('data', function(data) {
          console.log(data.toString());
          chai.expect(data.toString()).to.include('Hello');
        });

        done();
      });

      it('Should include Watman in the response', (done) => {
        client.write('WATMAN!');

        client.on('data', function(data) {
          console.log('data', data.toString());
          chai.expect(data.toString()).to.include('WATMAN!');
        });

        after((done) => {
          client.end();
          done();
        });

        done();
      });
    });
    after((done) => {
      server.close();
      done();
    });
  });
});
