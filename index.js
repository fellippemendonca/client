const net = require('net');
const Promise = require('bluebird');
const loremIpsum = require('lorem-ipsum');
const output = loremIpsum();
const RestClient = require('./lib/RestClient');
const bufferizer = require('./lib/bufferizer');
const distMeter = require('./lib/distMeter');
const environment = require('./lib/environment');

//"latitude":-23.576252,"longitude":-46.65455

let coord1 = { latitude: -23.5754310, longitude: -46.5754310 };
let coord2 = { latitude: -23.5754319, longitude: -46.5754319 };

console.log(`Total Distance: ${distMeter(coord1, coord2)}`);



let restClient = new RestClient(environment);

//restClient.get('/v1/chat?type=GROUP').then(resp => { console.log(resp) }).catch(err => { console.log(err) });
//restClient.get('/v1/chat/34573465/messages?page=1').then(resp => { console.log(resp) }).catch(err => { console.log(err) });

//carpetBombServer(environment.socket);
//carpetBombServer(environment.socket2);


clientsInit(1, environment.socket2);


function clientsInit(max, socket) {
  if(max > 90) {
    setInterval(() => { carpetBombServer(socket) }, max);
  } else {
    for (let i = 0; i < max; i++) {
      carpetBombServer(socket);
    }
  }
}

console.log(new Date(1511111119999));


function carpetBombServer(socket) {
  let client = new net.Socket();
  let userId = getRandomInt(2, 20) ; // 5

  client.connect(socket.port, socket.host, () => {
    //let spltMsg = messageSample(userId, 'shake');
    //client.write(messageSample(userId, 'chat-in').full);
    //setTimeout(() => { client.write(messageSample(userId, 'chat-msg').full) }, 100);
    //client.write(shake(userId).full);
    //client.write(keepAlive().full);
    
    //client.write(chatKick(userId).full); 
    //client.write(chatAdd(userId).full);
    client.write(messageSample(userId, 'chat-msg').full);
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
    token: environment.defaultTkn,
    id: 34573465,
    author: {
      id: genId,
      name: `Bot-${genId}`
    },
    text: `${loremIpsum({count: 1})} from Bot-${genId}`,
    expireTime: 30,
    //eventDate: new Date(1511111119999),
    //system: { type: "chat.edit.system.newUser", value: "Bruneras" },
    //mediaUrl: 'http://mediaUrl.jpg',
    type: 'text'
  }

  return bufferizer(message);
};

function chatAdd(num) {
  let genId = num;
  var message = {
    event: 'chat-add',
    id: 34573465,
    token: environment.defaultTkn,
    author: {
      id: genId,
      name: `Bot-${genId}`
    },
    text: `User Leo added to chat`,
    type: 'text',
    target: { id: 7, name: 'Leo' }
  }
  return bufferizer(message);
};

function chatKick(num) {
  let genId = num;
  var message = {
    event: 'chat-kick',
    id: 34573465,
    token: environment.defaultTkn,
    author: {
      id: genId,
      name: `Bot-${genId}`
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
    token: environment.defaultTkn,
    author: {
      id: genId,
      name: `Bot-${genId}`,
      picture: {
        url: 'http://eliseinfotech.com/wp-content/uploads/2016/09/android-robot-icon-22.png'
      },
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
34573471
34573471

> use timehi
switched to db timehi
> db.messages.find({chatId: 34573465}).sort({createdAt:-1}).skip(0).limit(2).pretty()

db.messages.find({ chatId: 34573465, $and: [ {createdAt: {$lt: new Date()}} ] }).sort({createdAt:-1}).pretty()

db.messages.find({ chatId: 34573465, createdAt: {$lt: new Date()} }).sort({createdAt:-1}).pretty()


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

*/