var net = require('net');
var loremIpsum = require('lorem-ipsum');
var output = loremIpsum();

const db = require('./lib/db');
const Mysql = db().mysql;




var HOST =  'localhost';// '192.168.1.66'// '' chat-stage.timehi.com;
var PORT = 5333;

function carpetBombServer() {
  let client = new net.Socket();
  client.setNoDelay(true);
  let userId = getRandomInt(0, 9999999999) ; // 5

  client.connect(PORT, HOST, function() {
    //client.write(messageSample(userId, 'chat-in'));
    //client.write(messageSample(userId, 'chat-msg'));
    client.write(messageSample(userId, 'shake'));
  });

  setTimeout(() => {
      //client.write(messageSample(userId, 'chat-out'));
      client.destroy();
  }, 10000);

  client.on('connect', function(data) {
    console.log(`userId: ${userId}, 'event': 'connect'`);
  });

  client.on('data', function(data) {
    console.log(`userId: ${userId}, received: ${data}`);
  });

  client.on('close', function() {
    console.log('Connection closed');
    client.destroy();
  });

  client.on('error', function(err) {
    console.log(err);
    client.destroy();
  });

  client.on('timeout', function(data) {
    console.log(`userId: ${userId}, 'event': 'timeout', obj: ${data}`);
    client.destroy();
  });
}


setInterval(() => { carpetBombServer(); },(1000));



function messageSample(num, eventType) {
  let genId = num;
  var message = 
    {
      event: eventType,
      auth: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRpbWVIaSIsImlhdCI6MTQ5MjUzNjc2MX0.BERAjBsqiODSMmFfHGf8_bQ1ZOrC2SIj01KOVPFJHNU'
      },
      id: JSON.stringify(getRandomInt(10000000, 100000000)),
      user: { 
        id: `${genId}`, 
        username: `User-${genId}`,
        picture: {thumbnail:'/user/3a31432c58b04007050e.jpg'},
	      latitude: `-23.5751${getRandomInt(00, 99)}`, 
	      longitude: `-46.6569${getRandomInt(00, 99)}`
      },
      chatId: '34573465', //getRandomInt(0, 2), //'34573465',//
      message: `${loremIpsum({count: 1})} from User-${genId}`,
      media: {
        type: 'video/picture',
        path: 'http://youtube.com'
    },
    createdAt: JSON.stringify(new Date())
  }
  let stx = new Buffer ([0x02]);
  let etx = new Buffer ([0x03]);
  let stringBuffer = new Buffer.from(`${JSON.stringify(message)}`);
  return Buffer.concat([stx, stringBuffer, etx]);
};

//-23.575123, -46.656920
//-23.575064, -46.656861

// HELPERS
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/*

{
      "chatId": "34573465",
      "id": "34532367",
      "event": "chat",
      "media": {
        "type": "picture",
        "path": "http:\/\/youtube.com"
      },
      "message": "HI from Hell",
      "createdAt": "2017-07-12T15:32:07.675Z",
      "user": {
        "id": "5873ca0d80804e000qweqwe15ab3f8",
        "username": "Robot",
        "picture": {
          "thumbnail": "\/user\/3a31432c58b04007050e.jpg"
        }
      }
    }



{
    event: 'chat',
    id: '123124124', // getRandomInt(10000000, 100000000),
    user: { id: genId, name: `User-${genId}`},
    chatId: '34573465',//getRandomInt(0, 3),
    message: `Test message text from User-${genId}`,
    media: {
      type: 'video/picture',
      path: 'http://youtube.com'
    },
    createdAt: new Date()
  }

*/



/*
 load(context)
        .then('middleware')
        .then('dao')
        .then('server/chat/controller/chat')
        .then('server/chat/route/chat')
		.then('service/chatServer/lib/chatServer')


// Connect DB
	let uriDB = util.format('mongodb://%s:%s/%s'
				,app.ctx.config.db.mongo.host
				,app.ctx.config.db.mongo.port
				,app.ctx.config.db.mongo.dbname);

	app.ctx.db.mongo.connect(uriDB,app.ctx.config.db.mongo.options);

        // Connect MySQL
        let connMySQL = new app.ctx.db.mysql(app.ctx.config.db.mysql.database,
                                             app.ctx.config.db.mysql.user,
                                             app.ctx.config.db.mysql.password, {
                                                host: app.ctx.config.db.mysql.host,
                                                port: app.ctx.config.db.mysql.port,
                                                dialect: 'mysql'
                                           });

        // Checking connection status
        connMySQL
            .authenticate()
            .then(function (err) {
                if (err) {
                        console.error('Error MySQL connecting: %s', err);
                        app.ctx.logger.error(API_NAME,'Error MySQL connecting: %s', err);
                        return;
                }

                console.log('MySQL - Connection has been established successfully');
                app.ctx.logger.info(API_NAME,'MySQL - Connection has been established successfully');
            }, function(err) {
                console.error('Error MySQL connecting: %s', err);
                app.ctx.logger.error(API_NAME,'Error MySQL connecting: %s', err);
                return;
            });

	// On connected to MongoDB-Server
        app.ctx.db.mongo.connection.on("connected",function(ref) {
                console.log('Connected to MongoDB-Server [ %s ]', uriDB);
                app.ctx.logger.info(API_NAME,'Connected to MongoDB-Server [ %s ]', uriDB);

		// Connect Redis
			app.ctx.redis = app.ctx.redisClient(app.ctx.config.db.redis.port
							   ,app.ctx.config.db.redis.host);

		// Redis events
		app.ctx.redis.on('connect', function(){
			console.log('Connected to Redis-Server [ %s:%s ]'
				    ,app.ctx.config.db.redis.host
				    ,app.ctx.config.db.redis.port);
			app.ctx.logger.info(API_NAME,'Redis Connected [ %s:%s]'
					   ,app.ctx.config.db.redis.host
                                    	   ,app.ctx.config.db.redis.port);
		});

		app.ctx.redis.on('ready', function(){
			console.log('Redis Ready');
			app.ctx.logger.info(API_NAME,'Redis Ready');
		});

		app.ctx.redis.on('reconnecting', function(){
			console.log('Redis Reconnecting');
			app.ctx.logger.warn(API_NAME,'Redis Reconnecting');
		});

		app.ctx.redis.on('error', function(err){
			console.error('Redis Error: %s',err);
			app.ctx.logger.error(API_NAME,'Redis Error: %s',err);
		});

		app.ctx.redis.on('end', function(){
			console.log('Redis End');
			app.ctx.logger.warn(API_NAME,'Redis End');
		});

        	// Start server
                app.listen(app.ctx.config.server.port,app.ctx.config.server.host,function(){
                       	console.log('Start Server on SCOPE: %s. Listen on port: %s'
                               	    ,scope
	                            ,app.ctx.config.server.port);

        	        app.ctx.logger.info(API_NAME
                                           ,'Start Server on SCOPE: %s. Listen on port: %s'
                       	                   ,scope
                               	           ,app.ctx.config.server.port);
		});
       	});


// DB events
        app.ctx.db.mongo.connection.on("error", function(err) {
                console.error('Failed to connect to DB %s on startup '
                              ,app.ctx.config.db.mongo.dbname
                              ,err);

                app.ctx.logger.error(API_NAME
                                    ,'Failed to connect to DB %s on startup %s'
                                    ,app.ctx.config.db.mongo.dbname
                                    ,err);
        });
		
        app.ctx.db.mongo.connection.on('disconnected', function () {
                console.log('MongoDB: %s disconnected', app.ctx.config.db.mongo.dbname);
                app.ctx.logger.info(API_NAME,'MongoDB: %s disconnected', app.ctx.config.db.mongo.dbname);
        });

        let closeDB = function() { 
	        // MongoDB-Server disconnect
                app.ctx.db.mongo.connection.close(function () {
                        console.log('MongoDB: %s is disconnected through app termination'
				   ,app.ctx.config.db.mongo.dbname);

                        app.ctx.logger.warn(API_NAME
					   ,'MongoDB: %s is disconnected through app termination'
					   ,app.ctx.config.db.mongo.dbname);

	                // MySQL-Server disconnect
        	        try {
                	        connMySQL.close();
                        	console.log('MySQL: %s is disconnected',app.ctx.config.db.mysql.database);
	                        app.ctx.logger.warn(API_NAME,'MySQL: %s is disconnected',app.ctx.config.db.mysql.database);
        	        } catch(err) {
                	        console.error('MySQL: %s disconnect Error %s',app.ctx.config.db.mysql.database,err);
                        	app.ctx.logger.error(API_NAME,'MySQL: %s disconnect Error %s',app.ctx.config.db.mysql.database,err);
                	}

	                // End process
        	        process.exit(0);
                });
        }

*/               



const Sequelize = require('sequelize');

let sequelize = new Sequelize('timehi', 'timehi', 'hftsdgtujgf6754hfy562945312', 
  {
    host: 'localhost',
    port: '3306',
    dialect: 'mysql'
  });
  sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Chats = sequelize.define('chats', {
    name: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    imageUrl: {
        type: Sequelize.STRING, field: 'image_url'
    },
    public: {
        type: Sequelize.INTEGER
    },
    createdAt: {
        type: Sequelize.DATE, field: 'created_at',
        allowNull: true
    },
    updatedAt: {
        type: Sequelize.DATE, field: 'updated_at',
        allowNull: true
    },
    deletedAt: {
        type: Sequelize.DATE, field: 'deleted_at',
        allowNull: true
    }
  }
);

const ChatsMembers = sequelize.define('chats_members', {
    chatId: {
      type: Sequelize.INTEGER, field: 'chat_id'
    },
    userId: {
      type: Sequelize.INTEGER, field: 'user_id'
    },
    offset: {
      type: Sequelize.INTEGER
    },
    muted: {
      type: Sequelize.INTEGER
    },
    admin: {
      type: Sequelize.INTEGER
    }
  }
);


Chats.hasMany(ChatsMembers);
ChatsMembers.belongsTo(Chats);



///*

//sequelize.sync().then(() => {});
ChatsMembers.find({
  where: {USER_ID: 2},
  attributes: [['chat_id', 'chatId'], 'offset', 'muted', 'admin'],
  include: [
    {
      model: Chats,
      attributes: ['name', 'description', ['image_url','imageUrl'], 'public']
    }
  ]
})
.then((results) => {
    //console.log(results.dataValues );

    //console.log(results.chat.dataValues);
  });



//sequelize.query(`SELECT * FROM chats`).spread((results, metadata) => {
  //console.log(results);
  //console.log(metadata);
  // Results will be an empty array and metadata will contain the number of affected rows.
//});
