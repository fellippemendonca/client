const net = require('net');
const Promise = require('bluebird');
const loremIpsum = require('lorem-ipsum');
const output = loremIpsum();
const RestClient = require('./lib/RestClient');

const earth = {
  horizontalRadius: 6371,
  verticalRadius: 6356.8
}
const pi = 3.14159265358979;

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


clientsInit(2);

function clientsInit(max) {
  if(max > 100) {
    setInterval(() => { carpetBombServer(environment.socket) }, max);
  } else {
    for (let i = 0; i < max; i++) {
      carpetBombServer(environment.socket);
    }
  }
}

function carpetBombServer(socket) {
  let client = new net.Socket();
  let userId = getRandomInt(2, 9) ; // 5

  client.connect(socket.port, socket.host, () => {
    //let spltMsg = messageSample(userId, 'shake');
    client.write(messageSample(userId, 'chat-in').full);
    setTimeout(() => { client.write(messageSample(userId, 'chat-msg').full) }, 1000);
    //client.write(messageSample(userId, 'shake').full);
    //setTimeout(() => { client.write(spltMsg.init) }, 1);
    //setTimeout(() => { client.write(spltMsg.end) }, 10);
  });

  setTimeout(() => {
      client.write(messageSample(userId, 'chat-out').full);
      client.destroy();
  }, 3000);

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
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRpbWVIaSIsImlhdCI6MTQ5MjUzNjc2MX0.BERAjBsqiODSMmFfHGf8_bQ1ZOrC2SIj01KOVPFJHNU',
    author: {
      id: genId,
      username: `User-${genId}`,
      picture: {thumbnail:'/user/3a31432c58b04007050e.jpg'},
      latitude: `-23.5753${getRandomInt(00, 99)}`, 
      longitude: `-46.6569${getRandomInt(00, 99)}`
    },
    id: 34573465,
    text: 'Gosto de caldo de cana',//`${loremIpsum({count: 1})} from User-${genId}`,
    type: 'text',
    mediaUrl: 'www.brunoVidaLoka.com/bikeRadical.jpg'
  }

  let stx = new Buffer ([0x02]);
  let etx = new Buffer ([0x03]);

  let stringBuffer = new Buffer.from(`${JSON.stringify(message)}`);

  let halfStartBuffer = Buffer.concat([stx, new Buffer.from(stringBuffer.slice(0, 100))]);
  let halfEndBuffer = Buffer.concat([new Buffer.from(stringBuffer.slice(100, stringBuffer.length)), etx]);
  let entireBuffer = Buffer.concat([stx, stringBuffer, etx]);
  return {init: halfStartBuffer, end: halfEndBuffer, full: entireBuffer};
};


// HELPERS
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}




let coord1 = {
  latitude:-23.57543134427412,
  longitude:-46.6568561758816
}


let coord2 = {
  latitude:-23.57537546197285,
  longitude:-46.65683520962173
}

//console.log(distance(coord1, coord2));

function distance(coord1, coord2) {
    let vDist = verticalDistance(coord1.latitude, coord2.latitude);
    let hDist = horizontalDistance(coord1.longitude, coord2.longitude);

    // Diagonal of Rectangle ==> A² + B² = C²
    let fDist = Math.sqrt((vDist*vDist) + (hDist*hDist));
    return Number((fDist*1000).toFixed(1)) ; // Km to Mts
  }



function verticalDistance(lat1, lat2) {
  let diff = Math.abs(lat1-lat2);
  // Earth Perimeter = 2*Pi*R
  let ePeriMtr = 2*pi*earth.verticalRadius;
  // Diff Perimeter
  return (diff*ePeriMtr)/360;
}

function horizontalDistance(lon1, lon2) {
  let diff = Math.abs(lon1-lon2);
  // Earth Perimeter = 2*Pi*R
  let ePeriMtr = 2*pi*earth.horizontalRadius;
  // Diff Perimeter
  return (diff*ePeriMtr)/360;
}