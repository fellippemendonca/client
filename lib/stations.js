'use strict';

const https = require('https');
const fs = require('fs');
const zlib = require('zlib');
const bl = require('bl');
const xml2json = require('xml2json');
const Promise = require('bluebird');
const _ = require('lodash');
var prettyjson = require('prettyjson');

const TXN_MTSK_HOST = process.env.TXN_MTSK_HOST;
const TXN_MTSK_AUTH_CERT = process.env.TXN_MTSK_AUTH_CERT;
const TXN_MTSK_AUTH_PASS = process.env.TXN_MTSK_AUTH_PASS;
const TXN_MTSK_PATH_PRICE = process.env.TXN_MTSK_PATH_PRICE;
const TXN_MTSK_PATH_DATA = process.env.TXN_MTSK_PATH_DATA;


module.exports = {
    getStations: getStations,
    getPrices: getPrices
}

function getPrices() {
  return getData('prices');
}

function getStations() {
  return getData('stations');
}

function getData(type) {
  return new Promise((resolve, reject) => {
    let pathSelect = TXN_MTSK_PATH_DATA;
    let typeFormatter = formatStationData;
    if (type === 'prices') {
      pathSelect = TXN_MTSK_PATH_PRICE;
      typeFormatter = formatStationPrice;
    }
    const options = {
      hostname: TXN_MTSK_HOST,
      port: '443',
      path: pathSelect,
      method: 'GET',
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip'
      },
      pfx: fs.readFileSync(TXN_MTSK_AUTH_CERT),
      passphrase: TXN_MTSK_AUTH_PASS
    };
    options.agent = new https.Agent(options);
    https.get(options, (res) => {
      res
        .pipe(zlib.createGunzip())
        .pipe(bl((err, data) => {
          if (err) { reject(err); }
          const xmlData = data.toString('utf-8');
          const jsonObject = xmlToJson(xmlData);
          const binaries = jsonObject.container.body.binary;
          const output = decodeBinaries(binaries)
            .then((decodedData) => {
              const petrolStationList = extractPetrolStations(decodedData, type);
              console.log({ type: type, amount: petrolStationList.length });
              return typeFormatter(petrolStationList);
            })
            .catch((err) => { reject(err); });
          resolve(output);
        }));
    })
      .on('error', (err) => { reject(err); });
  });
}

// HELPERS
function extractPetrolStations(input, type) {
  let objectName = 'petrolStation';
  if (type === 'prices') { objectName = 'petrolStationInformation'; }
  return input.reduce((result, elem) => {
    let elemAttr = elem.d2LogicalModel.payloadPublication[objectName];
    if (!Array.isArray(elemAttr)) { elemAttr = [elemAttr]; }
    result = [...result, ...elemAttr];
    return result;
  }, []);
}

function formatStationPrice(input) {
  return input.reduce((result, elem) => {
    if (!elem) { return result; }
    const formattedPrice = {};
    if (elem.fuelPriceDiesel) { formattedPrice.diesel_value = elem.fuelPriceDiesel.price; }
    if (elem.fuelPriceE10) { formattedPrice.e10_value = elem.fuelPriceE10.price; }
    if (elem.fuelPriceE5) { formattedPrice.e5_value = elem.fuelPriceE5.price; }
    if (elem.petrolStationReference) { result[elem.petrolStationReference.id.toLowerCase()] = formattedPrice; }
    return result;
  }, {});
}

function formatStationData(input) {
  return input.reduce((result, elem) => {
    if (!elem || typeof (elem.petrolStationLocation.latitude) !== 'string' || typeof (elem.petrolStationLocation.longitude) !== 'string') {
      //glog.info('Missing Gas Station Required Data', { data: JSON.stringify(elem) });
      return result;
    }
    const formattedData = {
      name: typeof (elem.petrolStationName) === 'string' ? elem.petrolStationName : '',
      brand: typeof (elem.petrolStationBrand) === 'string' ? elem.petrolStationBrand : '',
      street: typeof (elem.petrolStationStreet) === 'string' ? elem.petrolStationStreet : '',
      number: typeof (elem.petrolStationHouseNumber) === 'string' ? elem.petrolStationHouseNumber : '',
      zip: typeof (elem.petrolStationPostcode) === 'string' ? elem.petrolStationPostcode : '',
      city: typeof (elem.petrolStationPlace) === 'string' ? elem.petrolStationPlace : '',
    };
    formattedData.latitude = elem.petrolStationLocation.latitude;
    formattedData.longitude = elem.petrolStationLocation.longitude;
    if (!elem.openingTimes) {
      //glog.info('Missing Gas Station openingTimes Data', { data: JSON.stringify(elem) });
    } else {
      if (Array.isArray(elem.openingTimes)) {
        formattedData.openingTimes = elem.openingTimes.map((time) => {
          const days = time.recurringDayWeekMonthPeriod.applicableDay;
          return {
            recurringTimePeriodOfDay: {
              startTimeOfPeriod: time.recurringTimePeriodOfDay.startTimeOfPeriod,
              endTimeOfPeriod: time.recurringTimePeriodOfDay.endTimeOfPeriod
            },
            recurringDayWeekMonthPeriod: Array.isArray(days) ? days : [days]
          };
        });
      } else if (Array.isArray(elem.openingTimes.recurringDayWeekMonthPeriod.applicableDay)) {
        formattedData.openingTimes = elem.openingTimes.recurringDayWeekMonthPeriod.applicableDay.map((day) => {
          return {
            recurringTimePeriodOfDay: elem.openingTimes.recurringTimePeriodOfDay,
            recurringDayWeekMonthPeriod: [ day ]
          };
        });
      } else {
        formattedData.openingTimes = [
          {
            recurringTimePeriodOfDay: {
              startTimeOfPeriod: elem.openingTimes.recurringTimePeriodOfDay.startTimeOfPeriod,
              endTimeOfPeriod: elem.openingTimes.recurringTimePeriodOfDay.endTimeOfPeriod
            },
            recurringDayWeekMonthPeriod: [
              elem.openingTimes.recurringDayWeekMonthPeriod.applicableDay
            ]
          }
        ];
      }
    }
    result[elem.id.toLowerCase()] = formattedData;
    return result;
  }, {});
}

function decodeBinaries(binaries) {
  return Promise.map(binaries, (binary) => {
    return base64Gunzip(binary['$t'])
      .then((res) => {
        const jsonObj = xmlToJson(res);
        return cleanPrefix(jsonObj, 'd2LogicalModel');
      })
      .catch((err) => {
        return null;
      });
  });
}

async function base64Gunzip(value) {
  const buffer = Buffer.from(value, 'base64');
  const expanded = await zlib.gunzipSync(buffer).toString();
  return expanded;
}

function xmlToJson(xml) {
  const options = {
    object: true,
    reversible: false,
    coerce: false,
    sanitize: true,
    trim: true,
    arrayNotation: false,
    alternateTextNode: false
  };
  return xml2json.toJson(xml, options);
}

function cleanPrefix(object, key) {
  const keyLogicalModel = searchKey(object, key);
  const countPrefix = keyLogicalModel.indexOf(key);
  if (countPrefix > 0) {
    const prefix = keyLogicalModel.slice(0, countPrefix);
    const objectString = JSON.stringify(object);
    return JSON.parse(objectString.replace(new RegExp(prefix, 'g'), ''));
  }
  return object;
}

function searchKey(object, value) {
  return Object.keys(object).find((elem) => { return elem.indexOf(value, 0) > -1; });
}
  

















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


