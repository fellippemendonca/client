'use strict';

const RestClient = require('./lib/restClient');
const ClientHttps = require('./lib/clientHttps');
const https = require('https');
const request = require('request');
const fs = require('fs');
const zlib = require('zlib');
const bl = require('bl');
const xml2json = require('xml2json');


const xpath = require('xpath')
const dom = require('xmldom').DOMParser
 






//console.log(httpster());

function httpster() {
  let clientHttps = new ClientHttps();
clientHttps.set('broker.mdm-portal.de', 443, '/home/fellippe/Downloads/mdm-mtsk.dev.thinxnet.com.p12', 'eXiuAXCbw7');
//restClient.headers.Authorization = env.token;
clientHttps.get('/BASt-MDM-Interface/srv/container/v1.0?subscriptionID=3144000')
  .then(res => {
    console.log(res);
  })
  .catch(err => { console.log(err) });
};


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




function httpsGet() {

  let options = {
    hostname: 'broker.mdm-portal.de', 
    port: '443',
    //path: '/BASt-MDM-Interface/srv/container/v1.0?subscriptionID=3144000',
    path: '/BASt-MDM-Interface/srv/container/v1.0?subscriptionID=3144001',
    method: 'GET',
    headers: {
      'Content-Type': 'text/xml',
      'Accept-Encoding': 'gzip'
    },
    pfx: fs.readFileSync('/home/fellippe/Downloads/mdm-mtsk.dev.thinxnet.com.p12'),
    passphrase: 'eXiuAXCbw7'
  };

  options.agent = new https.Agent(options);

  https.get(options, (res) => {

    res.pipe(zlib.createGunzip()).pipe(bl((err, data) => {

      const xmlData = data.toString('utf-8');
      const object = xmlToJson(xmlData);
      let binary = object.container.body.binary;
      for (let idx in binary) {
        let currentBin = binary[idx]['$t'];
        base64Gunzip(currentBin);
      };

    }))
  })
  .on('error', (e) => { console.error(`Got error: ${e.message}`) })

}

httpsGet();




//readfile('./test.xml')
//readfile('./test1.xml')


function readfile(path) {
  const testXml = fs.readFileSync(path, 'utf-8');
  let obj =  xmlToJson(testXml);
  let binary = obj.container.body.binary;

  for (let idx in binary) {
    let currentBin = binary[idx]['$t'];
    base64Gunzip(currentBin);
  };
}

function xmlToJson(xml) {
  const json = xml2json.toJson(xml);
  return JSON.parse(json);
}

function base64Gunzip(value) {
  let buffer = Buffer.from(value, 'base64');
  zlib.gunzip(buffer, (err, res) => {
    value = res.toString();
    value = xmlToJson(value)
    //console.log(value.d2LogicalModel);
  })
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


function writeFile(path, content) {
  fs.writeFile(path, content, function(err) {
    if(err) { return console.log(err); }
  }); 
} 



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