'use strict';

const admin = require('firebase-admin');
const serviceAccount = require(process.env.FB_AUTH_JSON);
const projectId = process.env.GCLOUD_PROJECT

function init() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://fir-learning-project-3c117.firebaseio.com',
    projectId: projectId
  });
}

function send(message) {
  const firebaseMessage = {
    notification: {
      title: message.title,
      body: message.body,
    },
    android: {
      ttl: 3600 * 1000,
      notification: {
        icon: 'T',
        color: '#f45342',
      },
    },
    apns: {
      payload: {
        aps: {
          badge: 3,
        },
      },
    }
  };
  message.token ?
    firebaseMessage.token = message.token
    : firebaseMessage.topic = 'dryRun-Topic';
  // Send a message in the dry run mode.
  const dryRun = firebaseMessage.topic ? true : false;
  admin.messaging().send(firebaseMessage, dryRun)
    .then((response) => { console.log('Sending successful:', response); })
    .catch((error) => { console.log('Sending Error:', error); });
}

module.exports = {
  init: init,
  send: send
}