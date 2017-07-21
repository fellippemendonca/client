'use strict';

const mysql = require('sequelize');

var DB = function() {
  try {
    return { mysql:mysql };
  } catch(err) {
    return new Error(err);
  }
}

module.exports = DB;