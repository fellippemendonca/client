'use strict';

const firebase = require('firebase');
const projectId = process.env.GCLOUD_PROJECT

function init() {
  

}

// Initialize Firebase
// TODO: Replace with your project's customized code snippet


function get() {
  firebase.messaging();
  /*
  messaging.getToken().then(function(currentToken) {
    if (currentToken) {
      sendTokenToServer(currentToken);
      updateUIForPushEnabled(currentToken);
    } else {
      // Show permission request.
      console.log('No Instance ID token available. Request permission to generate one.');
      // Show permission UI.
      updateUIForPushPermissionRequired();
      setTokenSentToServer(false);
    }
  }).catch(function(err) {
    console.log('An error occurred while retrieving token. ', err);
    showToken('Error retrieving Instance ID token. ', err);
    setTokenSentToServer(false);
  });
  */
}

module.exports = {
  init: init,
  get: get
}