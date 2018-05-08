'use strict';

const https = require('https');
const fs = require('fs');
const zlib = require('zlib');
const bl = require('bl');
const xml2json = require('xml2json');
const Promise = require('bluebird');
//var prettyjson = require('prettyjson');



const hostGasStations = 'broker.mdm-portal.de';
const pathGasStations = '/BASt-MDM-Interface/srv/container/v1.0';
const certificate = '/home/fellippe/Downloads/mdm-mtsk.dev.thinxnet.com.p12';
const passphrase = 'eXiuAXCbw7';




getStations().then(res => {
  console.log(res);
  //writeFile('./stationsData.json', JSON.stringify(res)); 
  //writeFile('./prettyStationsData.json', prettyjson.render(res, { noColor: true })); 
});


/*
//getPrices().then(res => { 
  //console.log(res);
  //writeFile('./stationsPrice.json', JSON.stringify(res)); 
  //writeFile('./prettyStationsPrice.json', prettyjson.render(res, { noColor: true })); 
//});
*/








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
          const jsonObject = xmlToJson(xmlData);
          const binaries = jsonObject.container.body.binary;

          resolve(extractBinaries(binaries)
            .then((res) => { return formatStationData(extractPetrolStations(res.binaries)); })
          );

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
          const jsonObject = xmlToJson(xmlData);
          const binaries = jsonObject.container.body.binary;

          resolve(extractBinaries(binaries)
            .then((res) => { return formatStationPrice(extractPetrolStations(res.binaries)); })
          );

        }))
    })
      .on('error', (err) => { reject(err); })
  })
}


// HELPERS

function extractBinaries (binaries) {
  return Promise.props({
    binaries: Promise.map(binaries, (binary) => {
      return base64Gunzip(binary['$t'])
        .then((res) => {
          return res;
        });
    })
  })
};


function extractPetrolStations(input) {

  return input.reduce((result, elem) => {

    const keyLogicalModel = searchKey(elem, 'LogicalModel');
    const keyPayloadPublication = searchKey(elem[keyLogicalModel], 'payloadPublication');
    const keyPetrolStation = searchKey(elem[keyLogicalModel][keyPayloadPublication], 'petrolStation');

    let elemContens = elem[keyLogicalModel][keyPayloadPublication][keyPetrolStation];
    
    if (!Array.isArray(elemContens)) { elemContens = [elemContens] }

    result = [...result, ...elemContens]; 

    return result; 

  }, []);
};


function formatStationPrice (input) {

  return input.reduce((result, elem) => {

    const fuelPriceDiesel = searchKey(elem, 'fuelPriceDiesel');
    const fuelPriceE10 = searchKey(elem, 'fuelPriceE10');
    const fuelPriceE5 = searchKey(elem, 'fuelPriceE5');

    let formattedPrice = {};

    elem[fuelPriceDiesel] ? formattedPrice.diesel_value = elem[fuelPriceDiesel].price : false;
    elem[fuelPriceE10] ? formattedPrice.e10_value = elem[fuelPriceE10].price : false;
    elem[fuelPriceE5] ? formattedPrice.e5_value = elem[fuelPriceE5].price : false; 

    elem.petrolStationReference ? result[elem.petrolStationReference.id] = formattedPrice : false;


    return result;

  }, {});
  
};


function formatStationData (input) {

  return input.reduce((result, elem) => {

    const petrolStationName = searchKey(elem, 'petrolStationName');
    const petrolStationHouseNumber = searchKey(elem, 'petrolStationHouseNumber');
    const petrolStationPlace = searchKey(elem, 'petrolStationPlace');
    const petrolStationStreet = searchKey(elem, 'petrolStationStreet');
    const petrolStationBrand = searchKey(elem, 'petrolStationBrand');
    const petrolStationPostcode = searchKey(elem, 'petrolStationPostcode');

    let formattedData = {
      name: typeof(elem[petrolStationName]) === 'string' ? elem[petrolStationName] : '',
      number: typeof(elem[petrolStationHouseNumber]) === 'string' ? elem[petrolStationHouseNumber] : '',
      city: typeof(elem[petrolStationPlace]) === 'string' ? elem[petrolStationPlace] : '',
      street: typeof(elem[petrolStationStreet]) === 'string' ? elem[petrolStationStreet] : '',
      brand: typeof(elem[petrolStationBrand]) === 'string' ? elem[petrolStationBrand] : '',
      zip: typeof(elem[petrolStationPostcode]) === 'string' ? elem[petrolStationPostcode] : '',
    };
    
    formattedData.latitude = '1.1';
      formattedData.longitude = '1.1';
    /*
    if (searchKey(elem, 'petrolStationLocation')) {
      const petrolStationLocation = searchKey(elem, 'petrolStationLocation');
      const latitude = searchKey(elem[petrolStationLocation], 'latitude');
      const longitude = searchKey(elem[petrolStationLocation], 'longitude');

      formattedData.latitude = typeof(elem[petrolStationLocation]) === 'object' ? elem[petrolStationLocation][latitude] : '1.1';
      formattedData.longitude = typeof(elem[petrolStationLocation]) === 'object' ? elem[petrolStationLocation][longitude] : '1.1';
    } else {
      formattedData.latitude = '1.1';
      formattedData.longitude = '1.1';
    }
    */
    //typeof(elem.petrolStationLocation) !== 'object' ? console.log(elem) : false;

    const openingTimes = searchKey(elem, 'openingTimes');
    
    if (elem[openingTimes]) {

      if (Array.isArray(elem[openingTimes])) {

        formattedData[openingTimes] = elem[openingTimes].map(time => {

          const recurringTimePeriodOfDay = searchKey(time, 'recurringTimePeriodOfDay');
          
          const startTimeOfPeriod = searchKey(time[recurringTimePeriodOfDay], 'startTimeOfPeriod');
          const endTimeOfPeriod = searchKey(time[recurringTimePeriodOfDay], 'endTimeOfPeriod');


          const recurringDayWeekMonthPeriod = searchKey(time, 'recurringDayWeekMonthPeriod');
          const applicableDay = searchKey(time[recurringDayWeekMonthPeriod], 'applicableDay');


          return {
            recurringTimePeriodOfDay: {
              startTimeOfPeriod: time[recurringTimePeriodOfDay][startTimeOfPeriod],
              endTimeOfPeriod: time[recurringTimePeriodOfDay][endTimeOfPeriod]
            },
            recurringDayWeekMonthPeriod: [
              time[recurringDayWeekMonthPeriod][applicableDay]
            ]
          };
        });

      } /*else if (Array.isArray(elem[openingTimes].recurringDayWeekMonthPeriod.applicableDay)) {
        
        formattedData[openingTimes] = elem[openingTimes].recurringDayWeekMonthPeriod.applicableDay.map(day => {
          return {
            recurringTimePeriodOfDay: elem[openingTimes].recurringTimePeriodOfDay,
            recurringDayWeekMonthPeriod: [ day ]
          };
        }); 

      } else {
        formattedData[openingTimes] = [
          {
            recurringTimePeriodOfDay: {
              startTimeOfPeriod: elem[openingTimes].recurringTimePeriodOfDay.startTimeOfPeriod,
              endTimeOfPeriod: elem[openingTimes].recurringTimePeriodOfDay.endTimeOfPeriod
            },
            recurringDayWeekMonthPeriod: [
              elem[openingTimes].recurringDayWeekMonthPeriod.applicableDay
            ]
          }
        ];
      }*/

    }
    
    result[elem.id] = formattedData;
    
    return result;

  }, {});

};



function searchKey(object, value) {

  const keys = Object.keys(object);
  let found = undefined

  keys.map(key => {
    if (key.indexOf(value, 0) > -1) { found = key };
  })
  return found;
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
};


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