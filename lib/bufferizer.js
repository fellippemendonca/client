'use strict';

module.exports = bufferizer;

function bufferizer(message) {
  let stx = new Buffer ([0x02]);
  let etx = new Buffer ([0x03]);

  let stringBuffer = new Buffer.from(`${JSON.stringify(message)}`);

  let halfStartBuffer = Buffer.concat([stx, new Buffer.from(stringBuffer.slice(0, 100))]);
  let halfEndBuffer = Buffer.concat([new Buffer.from(stringBuffer.slice(100, stringBuffer.length)), etx]);
  let entireBuffer = Buffer.concat([stx, stringBuffer, etx]);
  return { init: halfStartBuffer, end: halfEndBuffer, full: entireBuffer };
}