'use strict';

const redisClient = require('redis').createClient;

const Redis = function () {
    try {
        return redisClient;
    } catch (err) {
        return new Error(err);
    }
};

module.exports = Redis;