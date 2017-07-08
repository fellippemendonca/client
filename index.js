var net = require('net');

var HOST = '192.168.1.66';//'192.168.1.66',
var PORT = 3000;

function carpetBombServer(){
  let client = new net.Socket();
  let userId = getRandomInt(0, 20);

  client.connect(PORT, HOST, function() {
    client.write(messageSample(userId));
    setTimeout(() => { client.destroy() }, (getRandomInt(10, 20)*1000));
  });

  client.on('data', function(data) {
    console.log(`userId: ${userId}, received: ${data}`);
  });

  client.on('close', function() {
    console.log('Connection closed');
  });

  client.on('error', function(err) {
    console.log(err);
  });
}


setInterval(() => { carpetBombServer(); },(2000));



function messageSample(num) {
  let genId = num;
  return JSON.stringify({
    event: 'chat',
    id: getRandomInt(10000000, 100000000),
    user: { id: genId, name: `User-${genId}`},
    chatId: getRandomInt(0, 2),
    message: `Test message text from User-${genId}`,
    media: {
      type: 'video/picture',
      path: 'http://youtube.com'
    },
    createdAt: new Date()
  });
};

// HELPERS
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}