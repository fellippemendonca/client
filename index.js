'use strict';

const RestClient = require('./lib/restClient');
const ClientHttps = require('./lib/clientHttps');
const https = require('https');
const request = require('request');
const fs = require('fs');
const zlib = require('zlib');
const bl = require('bl');
const parser = require('xml2json');








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



httpsGet();
function httpsGet() {

  let options = {
    hostname: 'broker.mdm-portal.de', 
    port: '443',
    path: '/BASt-MDM-Interface/srv/container/v1.0?subscriptionID=3144000',
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
    //res.pipe(zlib.createGunzip()).pipe(process.stdout)
    res.pipe(zlib.createGunzip()).pipe(bl((err, data) => {

      let jsonObj = JSON.parse(parser.toJson(data.toString()));

      let test = jsonObj.container.body.binary[0]['$t']

      console.log(test);
      
      /*
      let buffer = Buffer.from('');
      for (let elem in jsonObj.container.body.binary) {
        let code = jsonObj.container.body.binary[elem];

        buffer = Buffer.concat([buffer, Buffer.from(code['$t'])]);
      }
      fs.writeFileSync('requestOutput', buffer);
      */
    }))
  })
  //.on('error', (e) => { console.error(`Got error: ${e.message}`) })

}


/*
{ container: 
   { 'xmlns:ns2': 'http://schemas.xmlsoap.org/ws/2002/07/utility',
     xmlns: 'http://ws.bast.de/container/TrafficDataService',
     'xmlns:ns3': 'http://www.w3.org/2000/09/xmldsig#',
     header: { Identifier: [Object], 'ns2:Timestamp': [Object] },
     body: { binary: [Array] } } }

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