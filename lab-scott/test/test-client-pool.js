'use strict';

const server = require('../server');
const chai = require('chai');
const net = require('net');

describe('Server module', () => {
  describe('Start tcp server', function () {
    before((done) => {
      server.listen(3000);
      done();
    });

    describe('Create single client connection', function() {
      let client;
      before((done) => {
        client = net.createConnection({ port:3000 });
        done();
      });

      it('Should include Hello upon connection', function (done) {
        client.once('data', function(data) {
          chai.expect(data.toString()).to.include('Hello');
        });

        done();
      });

      it('Should include Watman in the response', (done) => {
        client.write('WATMAN!');

        client.on('data', function(data) {
          chai.expect(data.toString()).to.include('WATMAN!');
        });

        done();
      });

      it('should chage the nickname on /nick command', (done) => {
        client.write('/nick Scott');

        client.on('data', (data) => {
          chai.expect(data.toString()).to.equal('nick changed to Scott');
        });

        done();
      });

      after((done) => {
        client.end();
        done();
      });

    });

    describe('Create multiple client connections', function() {
      let clientOne, clientTwo;
      before((done) => {
        clientOne = net.createConnection( {port: 3000} );
        clientTwo = net.createConnection( {port: 3000} );
        done();
      });

      it('should create two client connections, and say Hello', function(done) {
        chai.assert.isObject(clientOne, 'ClientOne is an active Socket');
        chai.assert.isObject(clientTwo, 'ClientTwo is an active Socket');

        clientOne.once('data', (data) => {
          chai.expect(data.toString()).to.include('Hello');
        });

        clientTwo.once('data', (data) => {
          chai.expect(data.toString()).to.include('Hello');
        });
        done();
      });

      it('should return clientOne.write to clientTwo', function(done) {
        clientOne.write('Hey clientTwo!');

        clientTwo.once('data', (data) => {
          chai.expect(data.toString()).to.include('Hey clientTwo!');
        });

        done();
      });

      after((done) => {
        clientOne.end();
        clientTwo.end();
        done();
      });
    });

    after((done) => {
      server.close();
      done();
    });
  });
});
