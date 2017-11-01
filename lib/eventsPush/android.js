// Android

const AWS = require('aws-sdk');
const SNS_ACCESS_KEY = '';
const SNS_SECRET_ACCESS_KEY = '';

// Enviado pelo Front
const __DEVICE_TOKEN__ = 'cicwGbd5kEY:APA91bHHAWsI08ySAr9jS7JAwdzFACrspU238ufIFBJgtoXRS0n3_05Kwuy6KJyiOYB30eWsLUHgyCyakEfIYX1KQwwLwIN67T02pxm1GYGDLeqRQ7boq37hQ61oTCMHaQrCtl-u6CJg1';

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

	let platformApplicationArn = data.PlatformApplications[1].PlatformApplicationArn;

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
		let GCM_data = {
			data: {
				message: {
					title:"TimeHi",
					method:"post.new.like",
					id:"587681756ba6700001cf3bcb",
					message:"Jesus!!",
					imageProfile:"https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/20108518_10212498300239842_1643282782923120127_n.jpg?oh=107498e7847211f42069b01e6264414a&oe=5A3C359A"
				}
			}
		};

		let messageString = { "default" : "Push Test 07",
		             	      "GCM": JSON.stringify(GCM_data) };

		params = {
		  Message: JSON.stringify({
                                messageString
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