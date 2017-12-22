// iOS

const AWS = require('aws-sdk');
const SNS_ACCESS_KEY = '';
const SNS_SECRET_ACCESS_KEY = '';

// Enviado pelo Front
const __DEVICE_TOKEN__ = '984f0e9e6ab72a464ae2cba3dba3426ffa0d64901a7ed4b73d2117594f6b1c79'

let sns = new AWS.SNS({
		version: 'latest',
		debug: false,
		region: 'sa-east-1',
		accessKeyId: SNS_ACCESS_KEY,
		secretAccessKey: SNS_SECRET_ACCESS_KEY
	});


sns.listPlatformApplications({}, (err, data) => {
	if (err) {
		console.log(err, err.stack);
		throw new Error(err);
	}

	let platformApplicationArn = data.PlatformApplications[0].PlatformApplicationArn;

	// *****************************************************
	let params = {
	  PlatformApplicationArn: platformApplicationArn,
	  Token: __DEVICE_TOKEN__,
	  Attributes: {
		Enabled: 'true'
	  }
	};

	sns.createPlatformEndpoint(params, (err, data) => {
		if (err) { 
			console.log(err, err.stack);
			throw new Error(err);
		}

		let endpointArn = data.EndpointArn;

		// *****************************************************
		// Exemplo

		let apnsObj = {
			aps:{
				alert: 'Push test 01',
				title: "TimeHi",
				badge: 1,
				sound: "default"
			},
			body:{"title":"TimeHi","method":"post.new.like","postId":"587681756ba6700001cf3bcb","message":"Testando essa porra!!","imageUserProfile":"http://www.hdg.kjjhjd...."}
		};


		
		let apnsString = JSON.stringify(apnsObj);

		params = {
		  Message: JSON.stringify({
				default: 'Push test 01',
				APNS: apnsString,
				APNS_SANDBOX: apnsString
		  }),
		  MessageStructure: 'json',
		  TargetArn: endpointArn
		};

		sns.publish(params, (err, data) => {
			if (err) { 
				console.log(err, err.stack);
				throw new Error(err);
			}

			console.log(data);
		});
	});
});