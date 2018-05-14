'use strict';

const fs = require('fs');
const Promise = require('bluebird');
const _ = require('lodash');
//let prettyjson = require('prettyjson');
const stations = require('./lib/stations');
const firebaseAdmin = require('./lib/firebaseAdmin');

/*
const firebaseApp = require('./lib/firebaseApp');

firebaseApp.init();
firebaseApp.get();

*/

const message = {
  title: 'Test Title',
  body: 'This is a Test Notification Body'//,
  //token: 
};

firebaseAdmin.init();
firebaseAdmin.send(message);


















/*
stations.getStations().then(res => { //console.log(res); writeFile('./stationsData.json', JSON.stringify(res)); 
    //writeFile('./prettyStationsData.json', prettyjson.render(res, { noColor: true })); 
  }).catch(err => { console.log(err); });


stations.getPrices().then(res => {
  //console.log(res); 
  writeFile('./stationsPrice.json', JSON.stringify(res)); 
  //writeFile('./prettyStationsPrice.json', prettyjson.render(res, { noColor: true })); 
})
  .catch(err => { console.log(err); });


  */

////////////////////////////////////////////////////////////////////////////////not part of project

function writeFile(path, content) {
  fs.writeFile(path, content, (err) => {
    if(err) { return console.log(err); }
  }); 
};


function readfile(path) {
  const testXml = fs.readFileSync(path, 'utf-8');
  let obj =  xmlToJson(testXml);
  let binary = obj.container.body.binary;

  for (let idx in binary) {
    let currentBin = binary[idx]['$t'];
    base64Gunzip(currentBin);
  };
};


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



//requester();

function requester() {
  var options = {
    url: 'https://broker.mdm-portal.de/BASt-MDM-Interface/srv/container/v1.0?subscriptionID=3144000',
    headers: {
      'Content-Type': 'text/xml',
      'Accept-Encoding': 'gzip'
    },
    agentOptions: {
      pfx: fs.readFileSync('/home/fellippe/Downloads/mdm-mtsk.dev.thinxnet.com.p12'),
      passphrase: 'eXiuAXCbw7'
    }
  };
  
  request.get(options, (error, response, body) => {})
    .pipe(zlib.createGunzip()) // unzip
    .pipe(process.stdout);
};


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