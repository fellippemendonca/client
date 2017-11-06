/*
 * dao/elastic/user/userDAO.js
 *
 * +----------------------------------+
 * | Software Engineer: Erick Rettozi |
 * |                                  |
 * | (C) 2017 TimeHi/Kiddo Labs       |
 * +----------------------------------+
 *
 */

'use strict';

const util = require('util'),
      Promise = require('bluebird');

/*************************************************************************
* Constructor
* @Public
*************************************************************************/
function UsersDAO(app) {
	this._app = app;
	this._elastic = app.ctx.es;
}

/*************************************************************************
 * usernameExists()
 * @Private
 *************************************************************************/
UsersDAO.prototype.usernameExists = async function(username) {

	let self = this;

	return await new Promise((resolve,reject) => {
		 self._checkUserByUsername(username)
		    .then( (user) => {
			if( user &&
			    typeof user.hits != 'undefined' &&
			    typeof user.hits.total != 'undefined' &&
			    !!user.hits.total )
				return resolve(user)
			else
				return resolve(null);
		    })
		    .catch(error => {
		        reject(new Error(error));
		    });
	}).catch(error => {
		throw new Error(error);
	});
}

/*************************************************************************
 * _checkUserByUsername()
 * @Private
 *************************************************************************/
UsersDAO.prototype._checkUserByUsername = async function (username) {

	let self = this;

        return await self._elastic.search({
            index: 'users',
       	    type: 'usersdata',
            body: {
		  query: {
		        bool: {
		            must: [ { match: { username: username } } ],
		  	}
	    	  }
	    }
	});
}

UsersDAO.prototype.findUserDevice = async function(requestData) {

	let query = {};

	getValue(requestData.query, 'userId') ?
		query = { term: { user_id: parseInt(getValue(requestData.query, 'userId')) } }
		: false;

	return await this._elastic.search({
	  index: 'usersdevices',
	  type: 'userdevice',
	  _sourceInclude: ['id', 'user_id', 'device_key', 'language', 'os', 'token'],
	  body: {
		  query: query
	  }
	})
	.then(result => {
	  return formatArrayOutput(result);
	})
	.catch(err => {
	  return formatObjectOutput(null);
	});
};


UsersDAO.prototype.createUserDevice = async function(data) {
	
	let newDevice = {
			id: getValue(data, 'id')
		, app_version : getValue(data, 'appVersion')
		, os_version : getValue(data, 'osVersion')
		, device_key: getValue(data, 'deviceKey')
		, is_active: getValue(data, 'isActive')
		, language : getValue(data, 'language')
		, carrier : getValue(data, 'carrier')
		, user_id: getValue(data, 'userId')
		, token : getValue(data, 'token')
		, model : getValue(data, 'model')
		, os : getValue(data, 'os')
		, last_seen: new Date()
	};

	return await this._elastic.create({
		index: 'usersdevices',
		type: 'userdevice',
		id: newDevice.id,
		body: newDevice
	})
	.then(() => {
		return formatBooleanOutput(true);
	})
	.catch(err => {
		return formatBooleanOutput(false);
	});
};

UsersDAO.prototype.updateUserDevice = async function(request) {
	let timeNow = new Date();
	let updateScript = { inline: `ctx._source.last_seen = "${timeNow.toISOString()}";` };
	
	getValue(request.body, 'appVersion') ? updateScript.inline += `ctx._source.app_version = "${getValue(request.body, 'appVersion')}";`: false;
	getValue(request.body, 'osVersion') ? updateScript.inline += `ctx._source.os_version = "${getValue(request.body, 'osVersion')}";`: false;
	getValue(request.body, 'isActive') ? updateScript.inline += `ctx._source.is_active = "${getValue(request.body, 'isActive')}";`: false;
	getValue(request.body, 'language') ? updateScript.inline += `ctx._source.language = "${getValue(request.body, 'language')}";`: false;
	getValue(request.body, 'carrier') ? updateScript.inline += `ctx._source.carrier = "${getValue(request.body, 'carrier')}";`: false;
	getValue(request.body, 'token') ? updateScript.inline += `ctx._source.token = "${getValue(request.body, 'token')}";`: false;
	getValue(request.body, 'model') ? updateScript.inline += `ctx._source.model = "${getValue(request.body, 'model')}";`: false;
	getValue(request.body, 'os') ? updateScript.inline += `ctx._source.os = "${getValue(request.body, 'os')}";`: false;
	
	return await this._elastic.updateByQuery({
		index: 'usersdevices',
		type: 'userdevice',
		body: {
			size: 1,
			query: {
        match: { device_key: getValue(request.params, 'deviceKey') }
			},
			script: updateScript
		}
	})
	.then((res) => {
		return formatBooleanOutput(true);
	})
	.catch(err => {
		return formatBooleanOutput(false);
	});
};

UsersDAO.prototype.deleteUserDevice = async function(request) {

	return await this._elastic.deleteByQuery({
		index: 'usersdevices',
		type: 'userdevice',
		body: {
			size: 1,
      query: {
      	match: { device_key: getValue(request.params, 'deviceKey') }
      }
		}
	})
	.then((res) => {
		return formatBooleanOutput(true);
	})
	.catch(err => {
		return formatBooleanOutput(false);
	});
};

module.exports = UsersDAO;


//HELPERS

function getValue(object, field) {
	try { return object[field]; }
	catch (err) { return null; }
};

function formatArrayOutput(result) {
	try {
	  return result.hits.hits.map(result => {
		let formatted = result._source;
		formatted.id = result._id;
		return formatted;
	  });
	}
	catch (err) {
	  return [];
	}
};

function formatBooleanOutput(result) {
	try {
	  let formatted = result ? true : false;
	  return { result: formatted };
	}
	catch (err) {
	  return { result: false };
	}
};
