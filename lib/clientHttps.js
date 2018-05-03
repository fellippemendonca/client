'use strict';

const fs = require('fs'); 
const https = require('https');
const Promise = require('bluebird');
const zlib = require('zlib');



module.exports = ClientHttps;

function ClientHttps() {
  this.host;
  this.port;
  this.timeout = 10000;
  this.cert;
  this.keys;
  this.headers = {
    'Accept-Encoding': 'gzip',
    //'Content-Type': 'text/xml',
    //'Content-Length': 0
  };
  

  this.set = (host, port, cert, keys) => {
    this.host = host;
    this.port = port;
    this.cert = cert;
    this.keys = keys;
  }

  this.get = (path) => {

    //this.headers['Content-Length'] = 0;
    
    let options = {
      method: 'GET',
      hostname: this.host,
      port: this.port,
      path: path,
      headers: this.headers,
      pfx: fs.readFileSync(this.cert),
      passphrase: this.keys,
      timeout: this.timeout
    };

    options.agent = new https.Agent(options);

    return requester(options)
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
      pfx: fs.readFileSync(this.cert),
      passphrase: this.keys,
      timeout: this.timeout
    };

    options.agent = new https.Agent(options);

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
      pfx: fs.readFileSync(this.cert),
      passphrase: this.keys,
      timeout: this.timeout
    };

    options.agent = new https.Agent(options);
    
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
      pfx: fs.readFileSync(this.cert),
      passphrase: this.keys,
      timeout: this.timeout
    };

    options.agent = new https.Agent(options);
    
    return requester(options, bodyString);
  };
  
};







// ---------- HELPERS -------------

function requester(options, body) {
  let response = {};
  let chunks = '';

  return new Promise((resolve, reject) => {

    let request = https.request(options);

    //request.pipe(zlib.createGunzip())
      //.pipe(process.stdout);
    
    request.on('response', (response) => {
      console.log('response')
      console.log(response.connection);
    });

    request.on('data', (chunk) => {
      chunks += chunk;
    });
    
    request.on('end', () => {
      //response.body = unzip(chunks);
      //resolve(response);
      //console.log(res.read)
      resolve(chunks);
    });
    
    request.on('error', (err) => { reject(err); });

    if (body) { request.write(body); }
    request.end();
    
  });
};


function unzip(buffer) {
  return zlib.gunzip(buffer, (err, buffer) => {
    if (!err) {
      console.log(buffer.toString());
    } else {
      console.log(err.toString());
    }
  });
}


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