const net = require('net');
const Promise = require('bluebird');
const loremIpsum = require('lorem-ipsum');
const output = loremIpsum();
const RestClient = require('./lib/RestClient');
const bufferizer = require('./lib/bufferizer');
const distMeter = require('./lib/distMeter');
const environment = require('./lib/environment');
const socketsObject = require('./lib/sockets');
const SNS = require('./lib/eventsPush/SNS');
let events = require('./lib/eventsSocket/events');
let Redis = require('./lib/Redis');
//let androidPush = require('./lib/eventsPush/android');
//let iosPush = require('./lib/eventsPush/ios');


//let redisClient = new Redis();

let sockets = new socketsObject();


let time = new Date('2017-12-04T13:52:59.045-02:00');
//let time = new Date();
let timeDelayed = new Date(time.getTime() + 29000);
console.log(time)
console.log(timeDelayed);



function getIntValue(object, field) {
  try { return parseInt(object[field]); }
  catch (err) { return null; }
};

//console.log(redisClient);

let sns = new SNS(environment.push.snsAccessKey, environment.push.snsSecretAccessKey);

//redisClient.get('missingkey');
//sns.createEndpoint(sns.platforms.iOS, deviceToken);

//sns.listPlatforms(['google', 'dev_release_ios'])
  //.then(platforms => {
    //console.log(platforms)
    //return sns.createEndpoint(platforms.iOS, deviceToken);
  //})

//sns.listPlatforms(['google', 'iOS'])
  //.then(platforms => {
    //console.log(platforms)
    //return sns.createEndpoint(platforms.iOS, deviceToken);
  //})
  //.then(res => { console.log(res);
    //sns.send(res.EndpointArn, sns.formatApple(message))
      //.then(res => {
      //  console.log(res);
      //})
  //});


/*
let timeEvents = {};
let timeEvent = new Date().getTime();
console.log(timeEvent);
//console.log(timeEvent.getTime());
//console.log(new Date(timeEvent.getTime()));

setInterval(() => {
  let timeNow = new Date().getTime();
  let timeEvent = { '123' : 321};

  timeEvents[timeNow] = timeEvent;
  console.log(timeEvents);
}, 1000);
*/

//periodicEvent(simpleMessage, 1);

// GROUP CHAT - 34573544
// 1TO1  CHAT - 34573548
// Bruno 805;
// Eu 809;

simpleMessage(5);
function simpleMessage(time) {
  sockets.connect({userId: 805, env: environment.socket.staging, delay: (time * 1/5)});
  //sockets.connect({userId: 700, env: environment.socket.staging, delay: (time * 1/5)});
  //sockets.connect({userId: 809, env: environment.socket.staging, delay: (time * 1/5)});
  //sockets.send({userId: 805, data: events.chatIn({chatId: 34573544}), delay: (time * 2/5)});
  //sockets.send({userId: 700, data: events.chatListen({chats: [34573544]}), delay: (time * 1/5)});
  //sockets.send({userId: 805, data: events.chatListen({chats: [34573544]}), delay: (time * 1/5)});
  //sockets.send({userId: 809, data: events.chatListen({chats: [34573544]}), delay: (time * 1/5)});
  sockets.send({userId: 805, data: events.chatMessage({chatId: 34573544}) , delay: (time * 2/5)});
  //sockets.send({userId: 809, data: events.chatMessage({chatId: 34573560}) , delay: (time * 3/5)});
  //sockets.send({userId: 805, data: events.chatMessageCustom() , delay: (time * 3/5)});
  //sockets.send({userId: 805, data: events.chatMessageFuture({chatId: 34573544}) , delay: (time * 3/5)});
  //sockets.send({userId: 805, data: events.chatMessageExplosive({chatId: 34573544}) , delay: (time * 3/5)});
  //sockets.send({userId: 805, data: events.chatMessage({chatId: 34573544}) , delay: (time * 3/5)});
  //sockets.send({userId: 805, data: events.chatKick({chatId: 34573568, targetId: 809}), delay: (time * 4/5)});
  //sockets.send({userId: 805, data: events.chatOut({chatId: 34573544}), delay: (time * 4/5)});
  sockets.disconnect({userId: 805, delay: (time * 5/5)});
  //sockets.disconnect({userId: 700, delay: (time * 5/5)});
}




// SHAKE TEST
//shakeTest();
function shakeTest() {
  sockets.connect({ userId: 809, env: environment.socket.staging, delay: 1 });
  sockets.connect({ userId: 805, env: environment.socket.staging, delay: 1 });
  
  sockets.send({ userId: 809, data: events.shake(), delay: 2 });
  sockets.send({ userId: 805, data: events.shake(), delay: 3 });
  
  sockets.disconnect({ userId: 809, delay: 60 });
  sockets.disconnect({ userId: 805, delay: 60 });
}



/*
sockets.connect({ userId: 734, env: environment.socket.local, delay: 1 });
sockets.connect({ userId: 771, env: environment.socket.local, delay: 1 });

sockets.send({userId: 734, data: events.chatListen({chats: [34573521, 34573518, 34573512, 34573509]}), delay: 1.5});
sockets.send({userId: 771, data: events.chatListen({chats: [34573521, 34573518, 34573512, 34573509]}), delay: 1.5});

sockets.send({ userId: 734, data: events.chatAck({chatId: 34573521}), delay: 2 });
sockets.send({ userId: 771, data: events.chatAck({chatId: 34573521}), delay: 3 });

sockets.disconnect({ userId: 734, delay: 60 });
sockets.disconnect({ userId: 771, delay: 60 });
*/



//34573465
//sockets.connect({userId: 2, env: environment.socket.local, delay: 1});
//sockets.connect({userId: 4, env: environment.socket.local, delay: 1});

//sockets.send({userId: 2, data: events.chatListen({chats: [34573465]}), delay: 1.5});
//sockets.send({userId: 4, data: events.chatListen({chats: [34573465]}), delay: 1.5});

//sockets.send({userId: 2, data: events.chatMessage({chatId: 34573465}) , delay: 3});
//sockets.send({userId: 4, data: events.chatMessage({chatId: 34573465}) , delay: 4});

//sockets.disconnect({userId: 2, delay: 10});
//sockets.disconnect({userId: 4, delay: 10});
/*
// CHAT TEST
sockets.connect({userId: 2, env: environment.socket.local, delay: 1});
sockets.connect({userId: 4, env: environment.socket.local, delay: 1});
sockets.connect({userId: 5, env: environment.socket.local, delay: 1});
sockets.connect({userId: 7, env: environment.socket.local, delay: 1});
sockets.connect({userId: 11, env: environment.socket.local, delay: 1});


//sockets.send({userId: 7, data: chatListen({chats: [34573521, 34573518, 34573512, 34573509]}), delay: 1.5});

sockets.send({userId: 7, data: events.chatIn({chatId: 34573521}), delay: 2});
sockets.send({userId: 2, data: events.chatIn({chatId: 34573521}), delay: 2});
sockets.send({userId: 4, data: events.chatIn({chatId: 34573521}), delay: 2});
sockets.send({userId: 5, data: events.chatIn({chatId: 34573521}), delay: 2});
sockets.send({userId: 11, data: events.chatIn({chatId: 34573521}), delay: 2});


sockets.send({userId: 7, data: events.chatCreate({chatId:11111111, members: [2, 4, 5, 11]}), delay: 3});


sockets.send({userId: 7, data: events.chatMessage({chatId: 11111111}) , delay: 4});
sockets.send({userId: 2, data: events.chatMessage({chatId: 11111111}) , delay: 5});
sockets.send({userId: 4, data: events.chatMessage({chatId: 11111111}) , delay: 6});
sockets.send({userId: 5, data: events.chatMessage({chatId: 11111111}) , delay: 7});
sockets.send({userId: 11, data: events.chatMessage({chatId: 11111111}) , delay: 8});

sockets.send({userId: 7, data: events.chatOut({chatId: 11111111}), delay: 9});

sockets.disconnect({userId: 2, delay: 10});
sockets.disconnect({userId: 4, delay: 10});
sockets.disconnect({userId: 5, delay: 10});
sockets.disconnect({userId: 7, delay: 10});
sockets.disconnect({userId: 11, delay: 10});
*/


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

//restClient.get('/v1/chat/34573465/messages?page=1').then(resp => { console.log(resp) }).catch(err => { console.log(err) });


function simpleRestRequest(env, path) {
  let restClient = new RestClient(env.host, env.port);
  restClient.headers.Authorization = env.token;
  return restClient.get(path)
  .then(res => { return res } )
  .catch(err => { return err });
};

function restClientsInit(max, env, url) {
  let restClient = new RestClient(env.host, env.port);
  restClient.headers.Authorization = env.token;
  
  if(max > 90) {
    setInterval(() => {
      let start = new Date();
      restClient.get(url)
      .then(resp => {
        console.log(`\n-----------\nElapsed: ${new Date() - start} ms`);
        console.log(JSON.stringify(resp));
      })
      .catch(err => { console.log(err) });
    }, max);
  } else {
    let start = new Date();
    for (let i = 0; i < max; i++) {
      restClient.get(url)
      .then(resp => {
        console.log(`\n-----------\nElapsed: ${new Date() - start} ms`);
        console.log(JSON.stringify(resp));
      })
      .catch(err => { console.log(err) });
    }
  }
};


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

> use timehi
switched to db timehi
> db.messages.find({chatId: 34573465}).sort({createdAt:-1}).skip(0).limit(2).pretty()

db.messages.find({ chatId: 34573465, $and: [ {createdAt: {$lt: new Date()}} ] }).sort({createdAt:-1}).pretty()

db.messages.find({ chatId: 34573465, createdAt: {$lt: new Date()} }).sort({createdAt:-1}).pretty()

> db.activities.find({userId: 7}).sort({createdAt:-1}).skip(0).limit(2).pretty()

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



@createdAtTimestamp date
chatId long
author_id long
author_name text
type text
mediaUrl text
text text
system_type text
system_value text
createdAt text
deletedAt text
updatedAt text




{
  "author": {
  	"id": 2,
    "name": "Bruno"
  },
  "type": "text",
  "mediaUrl": "www.brunoVidaLoka.com/bikeRadical.jpg",
  "text": "test",
  eventDate: '2017-09-18T17:00:14.447Z',
  expireTime: null,
  "system": {
  	"type": "chat.edit.system.newUser",
    "value": "Bruneras"
  }
}


{ author: { id: 4, name: 'User-4' },
  type: 'text',
  text: 'Amet est officia do laborum fugiat dolor ipsum laborum excepteur duis. from User-4',
  mediaUrl: 'http://mediaUrl.jpg',
  eventDate: '2017-09-18T17:00:14.447Z',
  expireTime: null,
  chatId: '34573465' }


20 - 7000
1 - x

http://chat-stage.timehi.com/v1/chat/34573471.000000/messages?page=1


this.state.items.map(item => <tr> <th class="text-left">{item.name}</th><th class="text-left">{item.currentPrice}</th> </tr>)
              : <tr><th class="text-left">Loading...</th></tr>




              <!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Table Style</title>
        <meta name="viewport" content="initial-scale=1.0; maximum-scale=1.0; width=device-width;">
      </head>
  <body>
    <div id="root"></div>
  </body>
</html>


<tr>
<td class="text-left">February</td>
<td class="text-left">$ 10,000.00</td>
</tr>
<tr>
<td class="text-left">March</td>
<td class="text-left">$ 85,000.00</td>
</tr>
<tr>
<td class="text-left">April</td>
<td class="text-left">$ 56,000.00</td>
</tr>
<tr>
<td class="text-left">May</td>
<td class="text-left">$ 98,000.00</td>
</tr>

transform: translate3d(6px, -6px, 0);






server {

        listen 80;

        index index.html index.htm index.nginx-debian.html;
        server_name timehi-api;

        location /api/stocks {
                proxy_pass http://localhost:3001/api/stocks;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
}
location /api {
                proxy_pass http://localhost:3001;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
---------------------------------------------







client.exists({
  index: 'myindeSx',
  type: 'mytype',
  id: 1
}, function (error, exists) {
  if (exists === true) {
    // ...
  } else {
    // ...
  }
});


Service.Chat.Connection.Local



{"level":"info","message":"TimeHi-CHAT - [Service.Chat.Connection.Local] - Function: 'eventRouter', Connection: 172.20.4.166:28366, Data: 

{"chats":[34573521,34573518,34573487,34573523,34573522,34573516,34573515,34573509,34573507],"author":{"name":"Lucas Morgado","id":5,"picture":{"url":"https://timehi.s3-sa-east-1.amazonaws.com/user/aa80d8c919e592d5a592.jpg"}},"event":"chat-listen","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRpbWVIaSIsImlhdCI6MTQ5MjUzNjc2MX0.BERAjBsqiODSMmFfHGf8_bQ1ZOrC2SIj01KOVPFJHNU"}


,"timestamp":"2017-10-16T19:33:46.161Z"}



{
  "sender": "5873ca0d80804e00015ab3f8",
  "senderId": 7,
  "recipient": "587e4f06b35c000001561253",
  "recipientId": 5,
  "type": {
      "type": "post.new.like"
  },
  "source": {
      "post": "590c7e2aa835ef0001495c2e"
      //"comment": { type: Schema.Types.ObjectId, ref: 'Comment' }
  },
  "seen": false
}


page

5915cdf6a835ef0001495c3a

ObjectId("5873ca0d80804e00015ab3f8")


{
  "name": "Chat Bruneras",
  "description": "Chat Bruneras",
  "type": "GROUP",
  "image": "https://image.freepik.com/free-vector/android-boot-logo_634639.jpg",
  "public": 1,
  "users": [805, 808, 806]
}
34573544
807

{
  "users": [807]
}

804
807
810
811


Name:	queue-stage-chat	
Default Visibility Timeout:	5 minutes
URL:	https://sqs.sa-east-1.amazonaws.com/629832990358/queue-stage-chat	
Message Retention Period:	4 days
ARN:	arn:aws:sqs:sa-east-1:629832990358:queue-stage-chat	
Maximum Message Size:	256 KB
Created:	2017-08-17 18:00:37 GMT-03:00	
Receive Message Wait Time:	10 seconds
Last Updated:	2017-10-23 17:43:18 GMT-02:00	
Messages Available (Visible):	0
Delivery Delay:	0 seconds	
Messages in Flight (Not Visible):	0
Messages Delayed:	0


{
  "id" : 34573544,
  "text" :
  "message": "Bruneras : pela Paola Oliveira eu tomaria até caldo de cana...",
  "imageProfile": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/766485_8474937375957u_7879874798794750_n.jpg?oh=hg5464htgdtryurhgf753jjkkfj&oe=6GHD5TGE"
}



{
  "token" : "cicwGbd5kEY:APA91bHHAWsI08ySAr9jS7JAwdzFACrspU238ufIFBJgtoXRS0n3_05Kwuy6KJyiOYB30eWsLUHgyCyakEfIYX1KQwwLwIN67T02pxm1GYGDLeqRQ7boq37hQ61oTCMHaQrCtl-u6CJg",
  "appVersion" : "1.0.0",
  "carrier" : "Claro BR",
  "model" : "ASUS_X00LD",
  "os" : "android",
  "osVersion" : "7.1.1",
  "language" : "en_US"
}


34573544

My 
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6ODA5LCJ1c2VybmFtZSI6IkZlbGxpcHBlIiwibmFtZSI6IkZlbGxpcHBlIiwiZW1haWwiOiJmZWxsaXBwZS5tZW5kb25jYUBnbWFpbC5jb20iLCJiaW8iOiJLZWVwIGl0IHNpbXBsZS4iLCJwcml2YWN5IjoicHVibGljIiwidXNlckNvdW50cyI6eyJub3RpZmljYXRpb25zIjowLCJmb2xsb3dpbmciOjgsImZvbGxvd2VycyI6NywicG9zdHMiOjB9LCJ1c2VyTm90aWZpY2F0aW9ucyI6bnVsbCwicGljdHVyZSI6eyJ1cmwiOiJodHRwOi8vYXBpLXN0YWdlLnRpbWVoaS5jb20vdjEvbG9hZC9kMjk1NWVmOTFjZGIyZGRjN2M3NWRhODVlOTQ4YWJlMC5qcGVnIn0sImNvdmVyUGljdHVyZSI6bnVsbH0.__wcN4P4hADK0KYl5hl8iOnT8YkIOZcw9jMURyXFC6Y

{
  "title": "TimeHi",
  "method": "chat.new.1to1.message",
  "id": 34573548,
  "userId": 809,
  "message": {
    "en": "Brunão Sarado: Olá Apple.",
    "pt": "Brunão Sarado: Olá Apple."
  }
}


{
	"level": "error",
  "message": TimeHi-CHAT -  [dao.elastic.MessagesDAO] - [mapper_parsing_exception] 
  failed to parse [system_value] :: {"path":"/messages/message/5a0b19c14b319749df197479/_create",
  "query":{},
  "body":"{
    "@createdAtTimestamp":"2017-11-14T16:28:49.251Z",
    "@eventDateTimestamp":"2017-11-14T16:28:49.199Z",
    "@updatedAtTimestamp":"2017-11-14T16:28:49.251Z",
    "author_id":809,
    "author_name":"Bot",
    "chatId":34573568,
    "createdAt":"2017-11-14T16:28:49.251Z",
    "eventDate":"2017-11-14T16:28:49.199Z",
    "mongo_id":"5a0b19c14b319749df197479",
    "text":"user Bot removed from chat",
    "type":"text",
    "updatedAt":"2017-11-14T16:28:49.251Z",
    "system_type":"chat.edit.system.userRemoved",
    "system_value":{"id":809,"name":"Bot"}}",
    "statusCode":400,
    "response":"{"error":{
      "root_cause":[{"type":"mapper_parsing_exception",
      "reason":"failed to parse [system_value]"}],
    "type":"mapper_parsing_exception",
    "reason":"failed to parse [system_value]",
    "caused_by":{"type":"illegal_state_exception",
    "reason":"Can't get text on a START_OBJECT at 1:468"}},"status":400}"},
	"timestamp": "2017-11-14T16:28:49.266Z"
}
*/


