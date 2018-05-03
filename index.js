'use strict';

const RestClient = require('./lib/restClient');
const RestClientHttps = require('./lib/restClientHttps');
const https = require('https');
const request = require('request');
const fs = require('fs');
const zlib = require('zlib');

/*
let restClientHttps = new RestClientHttps();
restClientHttps.set('broker.mdm-portal.de', 443, '/home/fellippe/Downloads/mdm-mtsk.dev.thinxnet.com.p12', '');
//restClient.headers.Authorization = env.token;
restClientHttps.get('/BASt-MDM-Interface/srv/container/v1.0?subscriptionID=3144000')
  .then(res => {
    console.log(res);
  })
  .catch(err => { console.log(err) });

*/


var options = {
  url: 'https://broker.mdm-portal.de/BASt-MDM-Interface/srv/container/v1.0?subscriptionID=3144000',
  headers: {
    'Content-Type': 'text/xml',
    'Accept-Encoding': 'gzip'
  },
  agentOptions: {
    pfx: fs.readFileSync('/home/fellippe/Downloads/mdm-mtsk.dev.thinxnet.com.p12'),
    passphrase: ''
  }
};

request.get(options, (error, response, body) => {})
  .pipe(zlib.createGunzip()) // unzip
  .pipe(process.stdout);






















// GROUP CHAT - 34573544
// 1TO1  CHAT - 34573548
// Bruno 805;
// Eu 809;

//simpleStagingMessage(5);
function simpleStagingMessage(time) {
  sockets.connect({userId: 805, env: environment.socket.staging, delay: (time * 1/5)});
  //sockets.connect({userId: 700, env: environment.socket.staging, delay: (time * 1/5)});
  //sockets.connect({userId: 809, env: environment.socket.staging, delay: (time * 1/5)});
  //sockets.send({userId: 805, data: events.chatIn({chatId: 34573544}), delay: (time * 2/5)});
  sockets.send({userId: 805, data: events.chatMessage({chatId: 34573548}) , delay: (time * 2/5)});
  //sockets.send({userId: 809, data: events.chatMessage({chatId: 34573560}) , delay: (time * 3/5)});
  //sockets.send({userId: 805, data: events.chatMessageCustom() , delay: (time * 3/5)});
  //sockets.send({userId: 805, data: events.chatMessageFuture({chatId: 34573544}) , delay: (time * 3/5)});
  //sockets.send({userId: 805, data: events.chatMessageExplosive({chatId: 34573544}) , delay: (time * 3/5)});
  //sockets.send({userId: 805, data: events.chatMessage({chatId: 34573544}) , delay: (time * 3/5)});
  //sockets.send({userId: 805, data: events.chatKick({chatId: 34573568, targetId: 809}), delay: (time * 4/5)});
  //sockets.send({userId: 805, data: events.chatListen({chats: []}), delay: (time * 3/5)});
  //sockets.send({userId: 805, data: events.chatOut({chatId: 34573544}), delay: (time * 4/5)});
  sockets.disconnect({userId: 805, delay: (time * 5/5)});
  //sockets.disconnect({userId: 809, delay: (time * 5/5)});
}



//setInterval(() => {
  //shakeTest();
//}, 1000);

// SHAKE TEST
function shakeTest() {
  sockets.connect({ userId: 805, env: environment.socket.staging, delay: 1 });
  sockets.connect({ userId: 806, env: environment.socket.staging, delay: 2 });
  
  
  sockets.send({ userId: 805, data: events.shake({ userId: 809 }), delay: 11 });
  sockets.send({ userId: 806, data: events.shake({ userId: 808 }), delay: 12 });
  /*
  sockets.disconnect({ userId: 805, delay: 21 });
  sockets.disconnect({ userId: 806, delay: 22 });
  */
}






/*  distance function test
let coord1 = { latitude: -23.5750606, longitude: -46.6568397 };
let coord2 = { latitude: -23.5750523, longitude: -46.6568293 };
console.log(`Total Distance: ${distMeter(coord1, coord2)}`);
*/









//----------------------------------------------------------------------------------------


//simpleRestRequest(environment.api.staging, '/v1/chat').then(res => { console.log(res) });

//simpleRestRequest(environment.api.staging, '/v1/chat/34573548/messages?page=1').then(res => { console.log(res) });



//restClientsInit(200, environment.api.staging, '/v1/chat');
//restClientsInit(200, environment.api.staging, '/v1/user/809/posts?page=1&limit=1');

//restClientsInit(1000, environment.api.staging, '/v1/chat/34573548/messages?page=1');
//restClient.get('/v1/chat/34573465/messages?page=1').then(resp => { console.log(resp) }).catch(err => { console.log(err) });
/*

*/
//restClient.get('/v1/chat/34573465/messages?page=1').then(resp => { console.log(resp) }).catch(err => { console.log(err) });




// HELPERS
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function periodicEvent(fx, hz) {
  fx(hz);
  setInterval(() => { fx(hz) }, hz*1100);
};

/*
34573471
34573471

db.devices.find({userId: 809}).sort({createdAt:-1}).pretty()

> use timehi
switched to db timehi
> db.messages.find({chatId: 34573465}).sort({createdAt:-1}).skip(0).limit(2).pretty()

db.messages.find({ chatId: 34573465, $and: [ {createdAt: {$lt: new Date()}} ] }).sort({createdAt:-1}).pretty()

db.messages.find({ chatId: 34573465, createdAt: {$lt: new Date()} }).sort({createdAt:-1}).pretty()

> db.activities.find({userId: 7}).sort({createdAt:-1}).skip(0).limit(2).pretty()



db.messages.find( { chatId: 34573544, $and: [ {createdAt: {$lt: ISODate("2017-12-22T22:01:47.000Z")}}, {createdAt: {$gt: ISODate("2017-12-22T22:01:45.000Z")}} ] }).sort({createdAt:-1}).pretty()



@createdAtTimestamp date
author_id long
author_name text
chatId long
createdAt text
deletedAt text
mongo_id text
reports text
text text
type text
updatedAt text

// -- Mongo Model -- 
{
  chatId: { type: Number, required: true },
  author: {
    id: { type: Number, required: true },
    name: { type: String, required: true }
  },
  type: { type: String, enum: ['text', 'picture', 'video', 'system'], default: 'text' },
  mediaUrl: { type: String },
  text: { type: String },
  createdAt: { type: Date, default: Date.now },
  system: {
    type: { type: String, enum: systemMessageTypes },
    value: { type: Object }
  }
}

*/