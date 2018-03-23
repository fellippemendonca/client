'use strict';
const loremIpsum = require('lorem-ipsum');


module.exports = {
  shake: shake,
  chatAck: chatAck,
  chatCreate: chatCreate,
  chatListen: chatListen,
  chatIn: chatIn,
  chatOut: chatOut,
  chatMessage: chatMessage,
  chatMessageFuture: chatMessageFuture,
  chatMessageExplosive: chatMessageExplosive,
  chatMessageCustom: chatMessageCustom,
  notify: notify,
  broadcast: broadcast, 
  chatAdd: chatAdd,
  chatKick: chatKick,
  keepAlive: keepAlive,
  chatTyping: chatTyping
};

function shake(input) {
  return {
    event: 'shake',
    //debug: true,
    author: {
      id:  getValue(input, 'userId') || 0,
      name: `Bot`,
      picture: {
        url: 'http://eliseinfotech.com/wp-content/uploads/2016/09/android-robot-icon-22.png'
      },
      latitude: parseFloat(`-23.5753${getRandomInt(1, 99)}`), 
      longitude: parseFloat(`-46.6569${getRandomInt(1, 99)}`)
    }
  };
};

function chatTyping(input) {
  return {
    event: 'chat-typing',
    id: input.chatId,
    //debug: true,
    author: {
      id:  getValue(input, 'userId') || 0,
      name: `Bot`,
      picture: {
        url: 'http://eliseinfotech.com/wp-content/uploads/2016/09/android-robot-icon-22.png'
      }
      
    }
  };
};

function chatAck(input) {
  return {
    event: 'chat-ack',
    id: input.chatId,
    //debug: true,
    author: {
      id:  getValue(input, 'userId') || 0,
      name: `Bot`,
      picture: {
        url: 'http://eliseinfotech.com/wp-content/uploads/2016/09/android-robot-icon-22.png'
      }
      
    },
    eventDate: JSON.stringify(new Date())
  };
};

function chatCreate(input) {
  return {
    event: 'chat-create',
    id: input.chatId,
    //debug: true,
    members: input.members,
    author: {
      id:  getValue(input, 'userId') || 0,
      name: `Bot`,
      picture: { url: 'https://timehi.s3-sa-east-1.amazonaws.com/user/3c22e4cc5332f30ca27f.jpg'}
    }
  };
};

function chatListen(input) {
  return {
    event: 'chat-listen',
    //debug: true,
    chats: input.chats,
    author: {
      id:  getValue(input, 'userId') || 0,
      name: `Bot`,
      picture: { url: 'https://timehi.s3-sa-east-1.amazonaws.com/user/3c22e4cc5332f30ca27f.jpg'}
    }
  };
};

function chatIn(input) {
  return {
    event: 'chat-in',
    //debug: true,
    id: input.chatId,
    author: {
      id:  getValue(input, 'userId') || 0,
      name: `Bot`,
      picture: { url: 'https://timehi.s3-sa-east-1.amazonaws.com/user/3c22e4cc5332f30ca27f.jpg'}
    }
  };
};

function chatOut(input) {
  return {
    event: 'chat-out',
    //debug: true,
    id: input.chatId,
    author: {
      id:  getValue(input, 'userId') || 0,
      name: `Bot`,
      picture: { url: 'https://timehi.s3-sa-east-1.amazonaws.com/user/3c22e4cc5332f30ca27f.jpg'}
    }
  };
};

function chatMessage(input) {
  return {
    event: 'chat-msg',
    ////debug: true,
    id: input.chatId,
    author: {
      id:  getValue(input, 'userId') || 0,
      name: `Bruneras`,
      picture: { url: 'https://timehi.s3-sa-east-1.amazonaws.com/user/3c22e4cc5332f30ca27f.jpg'}
    },
    radius: 500, latitude: -23.575355, longitude: -46.656955, condition: 'in',
    //text: `${new Date()}`,
    text: input.chatMessage || `${loremIpsum({count: 1})}`,
    //expireTime: 30,
    //eventDate: '2018-01-17T10:52:59.045-02:00',
    //system: { type: "chat.edit.system.newUser", value: "Bruneras" },
    //mediaUrl: '',
    //mediaDuration: 12,
    type: 'text'

   //mediauration: 'fc0145ab1064d8/2017/12/18/2b98c73746d0d2a8fd32960f7003e9c6.jpeg',
    //type: 'picture',

    //mediaUrl: 'fc0145ab1064d9/2017/12/21/94f6ded7615e3e1e85f295db70c9edfc.mp4',
    //type: 'video',
    //createdAt: new Date()
  };
};

function chatMessageCustom() {
  return {
    event: 'chat-msg',
    id: 34573544,
    author: {
      id: 805,
      name: 'Bruneras',
      picture: {
        url: 'https://timehi.s3-sa-east-1.amazonaws.com/user/3c22e4cc5332f30ca27f.jpg'
      }
    },
    text: 'futuro custom',
    mediaUrl: null,
    type: 'text'//,
    //token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRpbWVIaSIsImlhdCI6MTQ5MjUzNjc2MX0.BERAjBsqiODSMmFfHGf8_bQ1ZOrC2SIj01KOVPFJHNU'
  }
}

function chatMessageExplosive(input) {
  return {
    event: 'chat-msg',
    //debug: true,
    id: input.chatId,
    author: {
      id:  getValue(input, 'userId') || 0,
      name: `Bruneras`,
      picture: { url: 'https://timehi.s3-sa-east-1.amazonaws.com/user/3c22e4cc5332f30ca27f.jpg'}
    },
    //text: `${new Date()}`,
    text: input.chatMessage || `${loremIpsum({count: 1})}`,
    expireTime: 30,
    //eventDate: new Date(1511111119999),
    //system: { type: "chat.edit.system.newUser", value: "Bruneras" },
    mediaUrl: '', //'http://media3.giphy.com/media/kEKcOWl8RMLde/giphy.gif',
    type: 'text'//'picture',
    //createdAt: new Date()
  };
};

function chatMessageFuture(input) {
  let time = new Date();

  return {
    event: 'chat-msg',
    //debug: true,
    id: input.chatId,
    author: {
      id:  getValue(input, 'userId') || 0,
      name: `Bruneras`,
      picture: { url: 'https://timehi.s3-sa-east-1.amazonaws.com/user/3c22e4cc5332f30ca27f.jpg'}
    },
    text: input.chatMessage || `${loremIpsum({count: 1})}`,
    eventDate: new Date(time.getTime() + 31000),
    mediaUrl: '', //'http://media3.giphy.com/media/kEKcOWl8RMLde/giphy.gif',
    type: 'text'//'picture',
  };
};

function notify(input) {
  return {
    event: 'chat-msg',
    //debug: true,
    id: input.chatId,
    text: `${loremIpsum({count: 1})}`,
    //expireTime: 30,
    //eventDate: new Date(1511111119999),
    //system: { type: "chat.edit.system.newUser", value: "Bruneras" },
    //mediaUrl: 'http://mediaUrl.jpg',
    type: 'text',
    //createdAt: new Date()
    target: input.target,
    broadcast: true,
    author: {
      id:  getValue(input, 'userId') || 0,
      name: `Bot`,
      picture: { url: 'https://timehi.s3-sa-east-1.amazonaws.com/user/3c22e4cc5332f30ca27f.jpg'}
    }
  };
};

function broadcast(input) {
  return {
    event: 'shake',
    //debug: true,
    author: {
      id:  getValue(input, 'userId') || 0,
      name: `Bot`,
      picture: {
        url: 'http://eliseinfotech.com/wp-content/uploads/2016/09/android-robot-icon-22.png'
      },
      latitude: parseFloat(`-23.5753${getRandomInt(1, 99)}`), 
      longitude: parseFloat(`-46.6569${getRandomInt(1, 99)}`)
    },
    broadcast: true
  };
};


function chatAdd(num) {
  return {
    event: 'chat-add',
    //debug: true,
    id: 34573465,
    author: {
      id:  getValue(input, 'userId') || 0,
      name: `Bot`,
    },
    text: `User Leo added to chat`,
    type: 'text',
    target: { id: 7, name: 'Leo' }
  };
};

function chatKick(input) {
  return {
    event: 'chat-kick',
    //debug: true,
    id: input.chatId,
    author: {
      id:  getValue(input, 'userId') || 0,
      name: `Bot`,
      picture: { url: 'https://timehi.s3-sa-east-1.amazonaws.com/user/3c22e4cc5332f30ca27f.jpg'}
    },
    text: `user Bot removed from chat`,
    system: { type: 'chat.edit.system.userRemoved', value: "Bruneras" },
    mediaUrl: '',
    type: 'text',//'picture',
    target: { id: getValue(input, 'targetId'), name: 'Bot' }
  };
};



function keepAlive() {
  return {
    //debug: true,
    event: 'keep-alive',
    author: {
      id:  getValue(input, 'userId') || 0,
      name: `Bot`,
    }
  };
};

// HELPERS
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getValue(object, field) {
  try { return object[field]; }
  catch (err) { return null; }
};