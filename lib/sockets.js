'use strict';

const net = require('net');
const SocketClient = require('./socketClient');

module.exports = sockets;

function sockets(app) {

  this.sockets = {};

  this.connect = (input) => {
    this.sockets[input.userId] = new SocketClient(input.userId, input.env);
    setTimeout(() => { this.sockets[input.userId].connect() }, (input.delay*1000)||100);
    return input;
  },
  
  this.send = (input) => {
    setTimeout(() => { this.sockets[input.userId].send(input.data) }, (input.delay*1000)||100);
    return input;
  },
  
  this.disconnect = (input) => {
    setTimeout(() => {
      this.sockets[input.userId].disconnect();
      delete this.sockets[input.userId];
    }, (input.delay*1000)||100);
    return input;
  }
};
