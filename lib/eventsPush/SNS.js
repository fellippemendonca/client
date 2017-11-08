'use strict';

const AWS = require('aws-sdk');
const Promise = require('bluebird');

function SNS(accessKey, secretKey) {
  this.sns = new AWS.SNS({
		version: 'latest',
		debug: false,
		region: 'sa-east-1',
		accessKeyId: accessKey,
		secretAccessKey: secretKey
  });
  this.platforms = {};
}

module.exports = SNS;

function pushToDevice(type, data, token) {
  return getPlatform(type)
    .then(res => {

    })
}


SNS.prototype.getPlatforms = function(types) {

  let self = this;

  let platforms = {};

  return new Promise((resolve, reject) => {

    self.sns.listPlatformApplications({}, (err, data) => {
      if (err) {
        reject(err);

      } else {

        data.PlatformApplications.map(platform => {

          types.map(type => {
            platform.PlatformApplicationArn.indexOf(type) > -1 ?
              platforms[type] = platform.PlatformApplicationArn : false;
          })
          
        })
        self.platforms = platforms;
        resolve(platforms);
      }
    })
  })
};


SNS.prototype.createEndpoint = function(platformApplication, deviceToken) {
  
  let self = this;

  let params = {
	  PlatformApplicationArn: platformApplication,
	  Token: deviceToken,
	  Attributes: {
		Enabled: 'true'
	  }
	};

  return new Promise((resolve, reject) => {
    self.sns.createPlatformEndpoint(params, (err, data) => {
      err ? reject(err) : resolve(data);
    })
  });
};


SNS.prototype.send = function(endpointArn, message) {
  
  let self = this;

  let params = {
    Message: message,
    MessageStructure: 'json',
    TargetArn: endpointArn
  };

  return new Promise((resolve, reject) => {
    self.sns.publish(params, (err, data) => {
      err ? reject(err) : resolve(data);
    })
  });
};


SNS.prototype.formatApple = function(message) {

  let apnsObj = {
    aps:{
      title: message.title,
      alert: message.method,
      badge: 1,
      sound: "default"
    },
    body: {
      title: message.title,
      method: message.method,
      id: message.id,
      message: message.message,
      imageProfile: message.imageProfile
    }
  };

  let apnsString = JSON.stringify(apnsObj);

  return JSON.stringify({
    default: message.method,
    APNS: apnsString,
    APNS_SANDBOX: apnsString
  })

};


SNS.prototype.formatAndroid = function(message) {

  let gcmObj = {
    data: {
      message: {
        title: message.title,
        method: message.method,
        id: message.id,
        message: message.message,
        imageProfile: message.imageProfile
      }
    }
  };

  let gcmString = JSON.stringify(gcmObj);

  return JSON.stringify({
    default: message.method,
    GCM: gcmString
  })
  
};

// HELPER

function getPlatformArnType (platformArn) {
  for(let idx in types) {
    //indexOf(platformArn, types[idx]) > -1 ?

  }
}
