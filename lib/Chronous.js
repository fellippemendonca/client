'use strict';

module.exports = Chronous;

function Chronous() {
  this.date = new Date();
  this.stop = () => {
    return (new Date() - this.date)/1000;
  }
}