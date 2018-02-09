'use strict';

const net = require('net');
const bufferData = require('./bufferData');
const timeout = 60000;

module.exports = SocketClient;

function SocketClient(id, address) {

  this.id = id;
  this.socket = new net.Socket();
  this.address = address;

  this.keepAliveInterval;
  this.reconnectTimeout;
  this.listen();
}


SocketClient.prototype.connect = function () {
  
  this.socket.setTimeout(timeout);
  this.socket.setNoDelay(true);

  console.log(`SocketClient: ${this.id} connecting with host: ${this.address.host}:${this.address.port}`);

  try {
    return this.socket.connect(this.address.port, this.address.host, () => {
      this.keepAliveStart();
      this.reconnectStop();
      return true;
    })
    
  } catch (err) {
    console.log(`SocketClient: ${this.id} Connection Error, host: ${this.address.host}:${this.address.port}, Error Message: ${err.message}`);
    return false;
  }
}


SocketClient.prototype.disconnect = function () {

  console.log(`SocketClient: ${this.id} disconnected of host: ${this.address.host}:${this.address.port}`);
  this.socket.destroy();
  try {
    this.keepAliveStop();
    this.reconnectStop();
    return true;
    
  } catch (err) {
    return false;
  }
}


SocketClient.prototype.send = function (data) {
  console.log(`SocketClient: ${this.id} writing to host: ${this.address.host}:${this.address.port}, Data: ${JSON.stringify(data)}`);
  data.token = this.address.token;
  try {
    if (this.socket.write(bufferData.bufferize(data))) {
      return true;

    } else {
      this.socket.emit('close');
      throw new Error('Socket is not writable');
    }
  } catch (err) {
    console.log(`SocketClient Sending Error, host: ${this.address.host}:${this.address.port}, Error Message: ${err.message}`);
    return false;
  }
}


SocketClient.prototype.listen = function() {
  this.socket.on('connect', () => {
    console.log(`SocketClient: ${this.id} connected with host: ${this.address.host}:${this.address.port}`);
  });

  this.socket.on('data', (data) => {
    console.log(`SocketClient: ${this.id} data Event from host: ${this.address.host}:${this.address.port}, Data: ${data}`);
  });

  this.socket.on('error', (err) => {
    console.log(`SocketClient: ${this.id} connection Errored with host: ${this.address.host}:${this.address.port}, Error Message: ${err.message}`);
    this.socket.emit('close');
  });

  this.socket.on('timeout', () => {
    console.log(`SocketClient: ${this.id} connection Timeout with host: ${this.address.host}:${this.address.port}`);
    this.socket.emit('close');
  });

  this.socket.on('close', () => {
    console.log(`SocketClient: ${this.id} connection Closed with host: ${this.address.host}:${this.address.port}`);
    this.keepAliveStop();
    this.reconnectStart();      
  });
}


SocketClient.prototype.keepAliveStart = function () {
  clearInterval(this.keepAliveInterval);
  this.keepAliveInterval = setInterval(() => {
    this.send({event: 'keep-alive'})
  }, 50000)
}


SocketClient.prototype.keepAliveStop = function () {
  clearInterval(this.keepAliveInterval);
}


SocketClient.prototype.reconnectStart = function () {
  clearTimeout(this.reconnectTimeout); 
  this.reconnectTimeout = setTimeout(() => {
    this.connect();
  }, 5000);
}


SocketClient.prototype.reconnectStop = function () {
  clearTimeout(this.reconnectTimeout)
}