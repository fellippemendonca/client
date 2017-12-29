'use strict';

const AWS = require('aws-sdk');
const Promise = require('bluebird');

function Push() {
  this.sns;
  this.platforms = {};
}

module.exports = Push;


Push.prototype.set = function(paramsObj) {

  let self = this;

  try {
    self.sns = new AWS.SNS(paramsObj);
  } catch(err) {
    throw err;
  }
};


Push.prototype.getPlatforms = function(types) {

  let self = this;

  return new Promise((resolve, reject) => {

    return self.sns.listPlatformApplications({}, (err, data) => {

      if (err) {
        reject(err);

      } else {
        
        let platforms = getValue(data, 'PlatformApplications');

        return Promise.map(platforms, platform => {

          for (let idx in types) {

            let type = types[idx];
            let platformAddress = getValue(platform, 'PlatformApplicationArn');
            
            platformAddress.indexOf(type) > -1 ?
              self.platforms[idx] = platformAddress : false;
          }

        })
        .then(() => {
          resolve (self.platforms);
        })
        .catch(err => {
          reject(err);
        });
      }
    });

  });

};


Push.prototype.createEndpoint = function(platformApplication, deviceToken) {
  
  let self = this;

  let params = {
	  PlatformApplicationArn: platformApplication,
	  Token: deviceToken,
	  Attributes: { Enabled: 'true' }
	};

  return new Promise((resolve, reject) => {

    self.sns.createPlatformEndpoint(params, (err, data) => {
      
      err ? reject(err) : resolve(data);

    });

  });

};


Push.prototype.publish = function(endpointArn, message) {
  
  let self = this;

  let params = {
    Message: message,
    MessageStructure: 'json',
    TargetArn: endpointArn
  };

  return new Promise((resolve, reject) => {

    self.sns.publish(params, (err, data) => {

      err ? reject(err) : resolve(data);

    });

  });
  
};


Push.prototype.formatApple = function(event) {

  let apnsObj = {
    aps:{
      title: event.title,
      alert: event.message,
      badge: event.badge,
      sound: "default"
    },
    body: {
      id: event.id,
      event: event.method,
      title: event.title,
      method: event.message,
      message: event.message,
      imageProfile: event.imageProfile
    }
  };

  let apnsString = JSON.stringify(apnsObj);

  return JSON.stringify({
    default: event.method,
    APNS: apnsString,
    APNS_SANDBOX: apnsString
  });

};


Push.prototype.formatAndroid = function(event) {

  let gcmObj = {
    data: {
      message: {
        id: event.id,
        event: event.method,
        title: event.title,
        badge: event.badge,
        method: event.message,
        message: event.message,
        imageProfile: event.imageProfile
      }
    }
  };

  let gcmString = JSON.stringify(gcmObj);

  return JSON.stringify({
    default: event.method,
    GCM: gcmString
  });
  
};


Push.prototype.send = function(os, deviceToken, event) {
  
  let self = this;

  return self.createEndpoint(self.platforms[os], deviceToken)
    .then(res => {

      let message;

      switch(os) {

        case 'android': message = self.formatAndroid(event);
          break;
        
        case 'iOS': message = self.formatApple(event);
          break;

        default: message = self.formatAndroid(event);
          break;
      }

      return self.publish(res.EndpointArn, message);

    })
    .catch(err => {
      throw err;
    });
};

// HELPERS
function getValue(object, field) {
  try { return object[field]; }
  catch (err) { return null; }
};
