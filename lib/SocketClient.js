'use strict';

const net = require('net');
const bufferData = require('./bufferData');



module.exports = SocketClient;


function SocketClient(id, env) {
  this.id = id;
  this.token = env.token;
  this.reconnectDelay = 1000;
  this.keepAliveDelay = 40000;
  this.address = {
    host: env.host,
    port: env.port,
    get : () => { return `Host: ${env.host}, Port: ${env.port}` }
  };
  
  this.socket = new net.Socket();
  this.socket.setNoDelay(true);  

  this.connect = () => {
    try {
      this.socket.connect(this.address.port, this.address.host, () => {
        this.keepAlive.start();
        this.reconnect.stop();
        return true;
      })
    } catch (err) {
      return false;
    }
  };

  this.send = (data) => {
    try {
      !getValue(data.author, 'id') ? data.author.id = this.id : false;
      !getValue(data.author, 'name') ? data.author.name = `Bot-${this.id}` : false;
      !getValue(data, 'token') ? data.token = this.token : false;
      this.socket.write(bufferData.bufferize(data));
      return data;
    } catch (err) {
      console.log(`Socket Client ID: ${this.id}, Sending Error, ${this.address.get()}, Error Message: ${err.message}`);
      return false;
    }
  };

  this.disconnect = () => {
    try {
      this.socket.destroy();
      return true;
    } catch (err) {
      console.log(`Socket Client ID: ${this.id}, Disconnecting Error, ${this.address.get()}, Error Message: ${err.message}`);
      return false;
    }
  };

  

  this.socket.on('connect', () => {
    console.log(`Socket Client ID: ${this.id}, connected with ${this.address.get()}`);
  });

  this.socket.on('data', (data) => {
    console.log(`Socket Client ID: ${this.id}, data Event from ${this.address.get()}, Data: ${data}`);
  });

  this.socket.on('error', (err) => {
    console.log(`Socket Client ID: ${this.id}, connection Errored with ${this.address.get()}, Error Message: ${err.message}`);
  });

  this.socket.on('timeout', () => {
    console.log(`Socket Client ID: ${this.id}, connection Timeout with ${this.address.get()}`);
  });

  this.socket.on('close', () => {
    this.keepAlive.stop();
    console.log(`Socket Client ID: ${this.id}, connection Closed with ${this.address.get()}`);
    //this.reconnect.start();
  });

  this.keepAlive = {
    interval: null,
    start: () => { clearInterval(this.interval); this.interval = setInterval(() => { this.send({event: 'keep-alive', author:{}}) }, this.keepAliveDelay) },
    stop: () => { clearInterval(this.interval) }
  };

  this.reconnect = {
    timeout: null,
    start: () => { clearTimeout(this.timeout); this.timeout = setTimeout(() => { this.connect() }, this.reconnectDelay) },
    stop: () => { clearTimeout(this.timeout) }
  };

};


// HELPER
function getValue(object, field) {
  try { return object[field]; }
  catch (err) { return null; }
};


