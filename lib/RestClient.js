const request = require('request');
const Promise = require('bluebird');
const Chronous = require('./Chronous');

module.exports = RestClient;

function RestClient(env) {

  this.host = env.server.host;
  this.port = env.server.port;
  this.headers = {
    'content-type': 'application/json',
    Authorization: `Bearer ${env.token}`
  }

  this.get = (path) => {
    let options = {
      method: 'GET',
      url: `http://${this.host}:${this.port}${path}`,
      headers: this.headers
    }
    return requester(options);
  }

  this.put = (path, body) => {
    let options = {
      method: 'PUT',
      url: `http://${this.host}:${this.port}${path}`,
      headers: this.headers,
      body: JSON.stringify(body)
    }
    return requester(options);
  }

  this.post = (path, body) => {
    let options = {
      method: 'POST',
      url: `http://${this.host}:${this.port}${path}`,
      headers: this.headers,
      body: JSON.stringify(body)
    }
    return requester(options);
  }
}







// HELPERS

function requester(options) {
  let chronous = new Chronous();
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {

      if (!error && response.statusCode == 200) {
        resolve({
          elapsed: chronous.stop(),
          body: bodyParser(body)
        })

      } else {
        resolve({
          elapsed: chronous.stop(),
          body: { message: error }
        });
      }

    });
  })
}

function bodyParser(body) {
  let obj = {};
  try { return obj = JSON.parse(body) }
  catch(err) { return obj };
}
