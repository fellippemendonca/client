'use strict';

const http = require('http');
const Promise = require('bluebird');

module.exports = RestClient;

function RestClient(host, port, timeout) {
  this.host;
  this.port;
  this.timeout = 10000;
  this.headers = {
    'Content-Type': 'application/json',
    'Content-Length': 0
  };
  

  this.set = (host, port) => {
    this.host = host;
    this.port = port;
  }

  this.get = (path) => {

    this.headers['Content-Length'] = 0;
    
    let options = {
      method: 'GET',
      hostname: this.host,
      port: this.port,
      path: path,
      headers: this.headers,
      timeout: this.timeout
    };
    return requester(options);
  };

  this.put = (path, body) => {
    let bodyString = JSON.stringify(body);
    this.headers['Content-Length'] = Buffer.byteLength(bodyString);

    let options = {
      hostname: this.host,
      port: this.port,
      path: path,
      method: 'PUT',
      headers: this.headers,
      timeout: this.timeout
    };
    return requester(options, bodyString);
  };

  this.post = (path, body) => {
    let bodyString = JSON.stringify(body);
    this.headers['Content-Length'] = Buffer.byteLength(bodyString);

    let options = {
      hostname: this.host,
      port: this.port,
      path: path,
      method: 'POST',
      headers: this.headers,
      timeout: this.timeout
    };
    return requester(options, bodyString);
  };

  this.delete = (path, body) => {
    let bodyString = JSON.stringify(body);
    this.headers['Content-Length'] = Buffer.byteLength(bodyString);

    let options = {
      hostname: this.host, 
      port: this.port,
      path: path,
      method: 'DELETE',
      headers: this.headers,
      timeout: this.timeout
    };
    return requester(options, bodyString);
  };
  
};


// ---------- HELPERS -------------

function requester(options, body) {
  let response = {};
  let chunks = '';

  return new Promise((resolve, reject) => {

    let request = http.request(options, (res) => {
      
      res.setEncoding('utf8');
      response.status = getValue(res, 'statusCode');

      response.status !== 200 ? 
        reject(new Error(`Response statusCode: ${response.status}`))
        : false;

      res.on('data', (chunk) => { chunks += chunk; });
      
      res.on('end', () => {
        response.body = bodyParser(chunks);
        resolve(response);
      });
    });
    request.on('error', (err) => { reject(err); });

    if (body) { request.write(body); }
    
    request.end();
  });
};

function bodyParser(body) {
  let obj = {};
  try { obj = JSON.parse(body) }
  catch(err) { return {} }
  return obj;
};

function getValue(object, field) {
  try { return object[field]; }
  catch (err) { return null; }
};