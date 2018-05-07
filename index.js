'use strict';

const RestClient = require('./lib/restClient');
const ClientHttps = require('./lib/clientHttps');
const https = require('https');
const request = require('request');
const fs = require('fs');
const zlib = require('zlib');
const bl = require('bl');
const xml2json = require('xml2json');
const Promise = require('bluebird');


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



/*
{ 'xmlns:ns2': 'http://schemas.xmlsoap.org/ws/2002/07/utility',
  xmlns: 'http://ws.bast.de/container/TrafficDataService',
  'xmlns:ns3': 'http://www.w3.org/2000/09/xmldsig#',
  header: 
   { Identifier: { publicationId: '2261000' },
     'ns2:Timestamp': { 'ns2:Id': 'body', 'ns2:Created': '2018-05-07T12:01:15.436Z' } },
  body: 
   { binary: 
      [ [Object],

*/


const hostGasStations = 'broker.mdm-portal.de';
const pathGasStations = '/BASt-MDM-Interface/srv/container/v1.0';

const certificate = '/home/fellippe/Downloads/mdm-mtsk.dev.thinxnet.com.p12';
const passphrase = 'eXiuAXCbw7';




//getStations().then(res => { console.log(res); });
//getPrices().then(res => { console.log(res) });


  //writeFile('getPrices.json', JSON.stringify(res));
  



function getStations() {
  return new Promise((resolve, reject) => {

  let options = {
    hostname: hostGasStations, 
    port: '443',
    path: pathGasStations+'?subscriptionID=3144000',
    method: 'GET',
    headers: {
      'Content-Type': 'text/xml',
      'Accept-Encoding': 'gzip'
    },
    pfx: fs.readFileSync(certificate),
    passphrase: passphrase
  };
  
  options.agent = new https.Agent(options);

    https.get(options, (res) => {

      res
        .pipe(zlib.createGunzip())
        .pipe(bl((err, data) => {
          
          const xmlData = data.toString('utf-8');
          let jsonObject = xmlToJson(xmlData);
          let binaries = jsonObject.container.body.binary;

          extractBinaries(binaries, 'data')
            .then((result) => {
              resolve(result);
            });
        }))
    })
      .on('error', (err) => { reject(err); })
  })
}

function getPrices() {
  return new Promise((resolve, reject) => {

  let options = {
    hostname: hostGasStations, 
    port: '443',
    path: pathGasStations+'?subscriptionID=3144001',
    method: 'GET',
    headers: {
      'Content-Type': 'text/xml',
      'Accept-Encoding': 'gzip'
    },
    pfx: fs.readFileSync(certificate),
    passphrase: passphrase
  };
  
  options.agent = new https.Agent(options);

    https.get(options, (res) => {

      res
        .pipe(zlib.createGunzip())
        .pipe(bl((err, data) => {
          
          const xmlData = data.toString('utf-8');
          let jsonObject = xmlToJson(xmlData);
          let binaries = jsonObject.container.body.binary;

          extractBinaries(binaries, 'price')
            .then((result) => {
              resolve(result);
            });
        }))
    })
      .on('error', (err) => { reject(err); })
  })
}


// HELPERS

function extractBinaries (binaries, type) {

  return Promise.props({

    binaries: Promise.map(binaries, (binary) => {

      return base64Gunzip(binary['$t'])
        .then((res) => {

          let petrolStation = {};
          
          try {

            type === 'price'?
              petrolStation = formatStationPrice(res.d2LogicalModel.payloadPublication.petrolStationInformation)
              : petrolStation = formatStationData(res.d2LogicalModel.payloadPublication.petrolStation)
            
          } catch (err) { console.log(err.message) };

          return petrolStation;
        });
    })
  })
};


function formatStationPrice (input) {
  let formattedPrice = {};
  input.petrolStationReference ? formattedPrice.id = input.petrolStationReference.id : false;
  input.fuelPriceDiesel ? formattedPrice.diesel_value = input.fuelPriceDiesel.price : false;
  input.fuelPriceE10 ? formattedPrice.e10_value = input.fuelPriceE10.price : false;
  input.fuelPriceE5 ? formattedPrice.e5_value = input.fuelPriceE5.price : false;  

  return formattedPrice;
}


function formatStationData (input) {
  
  let formattedData = {
    id: input.id,
    name: input.petrolStationName,
    number: input.petrolStationHouseNumber ,
    city: input.petrolStationPlace,
    street: input.petrolStationStreet,
    brand: input.petrolStationBrand,
    zip: input.petrolStationPostcode,
  }

  formattedData.latitude = typeof(input.petrolStationLocation) !== 'object' ? '' : input.petrolStationLocation.latitude;
  formattedData.longitude = typeof(input.petrolStationLocation) !== 'object' ? '' :input.petrolStationLocation.longitude;

  /*
  formattedData.openingTimes = typeof(input.openingTimes) !== 'array' ? [] : input.openingTimes.map(elem => {
    return {
      recurringTimePeriodOfDay: {
        startTimeOfPeriod: elem.recurringTimePeriodOfDay.startTimeOfPeriod,
        endTimeOfPeriod: elem.recurringTimePeriodOfDay.endTimeOfPeriod
      },
      recurringDayWeekMonthPeriod: [
        elem.recurringDayWeekMonthPeriod.applicableDay
      ]
    };
  })
  */

  return formattedData;
};


function base64Gunzip(value) {
  let buffer = Buffer.from(value, 'base64');
  return new Promise((resolve, reject) => {
    zlib.gunzip(buffer, (err, res) => {
      const result = xmlToJson(res.toString());
      resolve(result);
    })
  })
};


function xmlToJson(xml) {
  const json = xml2json.toJson(xml);
  return JSON.parse(json);
}


function writeFile(path, content) {
  fs.writeFile(path, content, (err) => {
    if(err) { return console.log(err); }
  }); 
} 


function readfile(path) {
  const testXml = fs.readFileSync(path, 'utf-8');
  let obj =  xmlToJson(testXml);
  let binary = obj.container.body.binary;

  for (let idx in binary) {
    let currentBin = binary[idx]['$t'];
    base64Gunzip(currentBin);
  };
}

function getValue(object, field) {
  try {
    return object[field];
  } catch {
    return {};
  }
}


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