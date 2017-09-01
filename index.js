const net = require('net');
const Promise = require('bluebird');
const loremIpsum = require('lorem-ipsum');
const output = loremIpsum();
const RestClient = require('./lib/RestClient');
const bufferizer = require('./lib/bufferizer');
const distMeter = require('./lib/distMeter');
const defaultTkn = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRpbWVIaSIsImlhdCI6MTQ5MjUzNjc2MX0.BERAjBsqiODSMmFfHGf8_bQ1ZOrC2SIj01KOVPFJHNU';

let coord1 = { latitude:-23.57543134427412, longitude:-46.6568561758816 }
let coord2 = { latitude:-23.57537546197285, longitude:-46.65683520962173 }

//console.log(`Total Distance: ${distMeter(coord1, coord2)}`);

const environment = {
  token: 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJicnVyZW5kIiwibmFtZSI6IkJydW5vIiwiZW1haWwiOiJicnVub3JlbmRlaXJvQGtpZGRvbGFicy5jb20iLCJiaW8iOiJIdHRwOi8vTWFja2VuemllLmJyIiwicHJpdmFjeSI6InByaXZhdGUiLCJ1c2VyQ291bnRzIjp7Im5vdGlmaWNhdGlvbnMiOjUxLCJmb2xsb3dpbmciOjEwLCJmb2xsb3dlcnMiOjQsInBvc3RzIjo1M30sInVzZXJOb3RpZmljYXRpb25zIjp7Im1lbnRpb25zX3Bvc3QiOiJvbiIsIm1lbnRpb25zX2NvbW1lbnQiOiJvbiIsIm1hcmtfcG9zdCI6Im9uIiwiY2hhdCI6Im9uIiwiZm9sbG93X3JlcXVlc3QiOiJvbiIsImZvbGxvdyI6Im9uIiwiY29tbWVudCI6Im9uIiwibGlrZXMiOiJhbGwifSwicGljdHVyZSI6W3sibmFtZSI6IjU4YTc3MWJjYjVmMzRiMDAwMTM5MzlhYyIsInBpY3R1cmUiOiJvcmlnaW5hbCIsImZvcm1hdCI6IkpQRUciLCJ1cmwiOiJodHRwczovL3RpbWVoaS5zMy1zYS1lYXN0LTEuYW1hem9uYXdzLmNvbS91c2VyLzk2YjZmODIzZjNkOWUxOGEwMWUyLmpwZyJ9LHsibmFtZSI6IjU4YTc3MWJjYjVmMzRiMDAwMTM5MzlhYyIsInBpY3R1cmUiOiJ0aHVtYm5haWwiLCJmb3JtYXQiOiJKUEVHIiwidXJsIjoiaHR0cHM6Ly90aW1laGkuczMtc2EtZWFzdC0xLmFtYXpvbmF3cy5jb20vdXNlci85OTgxYTUzZTBiNzVkODkyZDA5My5qcGcifV0sImNvdmVyUGljdHVyZSI6eyJuYW1lIjoiNThhNzcxYzRiNWYzNGIwMDAxMzkzOWFkIiwicGljdHVyZSI6InRodW1ibmFpbCIsImZvcm1hdCI6IkpQRUciLCJ1cmwiOiJodHRwczovL3RpbWVoaS5zMy1zYS1lYXN0LTEuYW1hem9uYXdzLmNvbS91c2VyLzU0ZTE4ODJlZDE3MTQxZWVmZjdkLmpwZyJ9fQ.36ac190q7OkNpqMo8M3-MNkIataOEVMeF3RnHwUjqP0',
  server: {
    host: 'localhost',
    port: 5331
  },
  server2: {
    host: 'chat-stage.timehi.com',
    port: 80
  },
  socket: {
    host: 'localhost',
    port: 5333
  },
  socket2: {
    host: 'chat-stage.timehi.com',
    port: 5333
  }

}


let restClient = new RestClient(environment);

//restClient.get('/v1/chat?type=GROUP').then(resp => { console.log(resp) }).catch(err => { console.log(err) });
//restClient.get('/v1/chat/34573465/messages?page=1').then(resp => { console.log(resp) }).catch(err => { console.log(err) });

//carpetBombServer(environment.socket);
//carpetBombServer(environment.socket2);


clientsInit(1, environment.socket2);


function clientsInit(max, socket) {
  if(max > 100) {
    setInterval(() => { carpetBombServer(socket) }, max);
  } else {
    for (let i = 0; i < max; i++) {
      carpetBombServer(socket);
    }
  }
}

function carpetBombServer(socket) {
  let client = new net.Socket();
  let userId = 2 //getRandomInt(2, 10) ; // 5

  client.connect(socket.port, socket.host, () => {
    //let spltMsg = messageSample(userId, 'shake');
    //client.write(messageSample(userId, 'chat-in').full);
    setTimeout(() => { client.write(messageSample(userId, 'chat-msg').full) }, 100);
    //client.write(shake(userId).full);
    //client.write(keepAlive().full);
    
    //client.write(chatKick(userId).full); 
    //client.write(chatAdd(userId).full);
    //client.write(messageSample(userId, 'chat-msg').full);
    //setInterval(() => { client.write(messageSample2(userId, 'keep-alive').full) }, 3000);
    //setTimeout(() => { client.write(spltMsg.init) }, 1);
    //setTimeout(() => { client.write(spltMsg.end) }, 100);
  });

  setTimeout(() => {
      //client.write(messageSample(userId, 'chat-out').full);
      client.destroy();
  }, 5000);

  client.on('connect', function(data) {
    console.log(`userId: ${userId}, 'event': 'connect'`);
  });

  client.on('data', function(data) {
    console.log(`userId: ${userId}, received: ${data}`);
  });

  client.on('close', function() {
    console.log('Connection closed');
    client.destroy();
  });

  client.on('error', function(err) {
    console.log(err);
    client.destroy();
  });

  client.on('timeout', function(data) {
    console.log(`userId: ${userId}, 'event': 'timeout', obj: ${data}`);
    client.destroy();
  });
}





function messageSample(num, eventType) {
  let genId = num;
  var message = {
    event: eventType,
    token: defaultTkn,
    author: {
      id: genId,
      name: `User-${genId}`
    },
    id: 34573465,
    text: 'Foi culpa do Powerpoint', //`${loremIpsum({count: 1})} from User-${genId}`,
    type: 'text',
    mediaUrl: 'http://mediaUrl.jpg'
  }

  return bufferizer(message);
};

function chatAdd(num) {
  let genId = num;
  var message = {
    event: 'chat-add',
    id: 34573465,
    token: defaultTkn,
    author: {
      id: genId,
      name: `User-${genId}`
    },
    text: `user Leo added to chat`,
    type: 'text',
    target: {id: 7, name: 'Leo'}
  }
  return bufferizer(message);
};

function chatKick(num) {
  let genId = num;
  var message = {
    event: 'chat-kick',
    id: 34573465,
    token: defaultTkn,
    author: {
      id: genId,
      name: `User-${genId}`
    },
    text: `user Leo removed from chat`,
    type: 'text',
    target: {id: 7, name: 'Leo'}
  }
  return bufferizer(message);
};

function shake(num) {
  let genId = num;
  var message = {
    event: 'shake',
    token: defaultTkn,
    author: {
      id: genId,
      name: `User-${genId}`,
      latitude: parseFloat(`-23.5753${getRandomInt(00, 99)}`), 
      longitude: parseFloat(`-46.6569${getRandomInt(00, 99)}`)
    }
  }
  return bufferizer(message);
};

function keepAlive() {
  var message = {
    event: 'keep-alive'
  }
  return bufferizer(message);
};







// HELPERS
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}



/*

db.getCollection('messages').find({ 
    'chatId': 34573465, 
    'author.id': {'$ne': 2} , 
    'system': null, 
    '$or': [
        {'createdAt': {'$gt': ISODate("2017-08-10T19:40:10.055Z")}}, 
        {'createdAt': {'$lt': 'createdAt' }}
    ]
    })


*/