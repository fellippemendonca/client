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
  notify: notify,
  broadcast: broadcast, 
  chatAdd: chatAdd,
  chatKick: chatKick,
  keepAlive: keepAlive
};

function shake(input) {
  return {
    event: 'shake',
    debug: true,
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

function chatAck(input) {
  return {
    event: 'chat-ack',
    id: input.chatId,
    debug: true,
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
    debug: true,
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
    debug: true,
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
    debug: true,
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
    debug: true,
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
    debug: true,
    id: input.chatId,
    author: {
      id:  getValue(input, 'userId') || 0,
      name: `Bot`,
      picture: { url: 'https://timehi.s3-sa-east-1.amazonaws.com/user/3c22e4cc5332f30ca27f.jpg'}
    },
    //text: `${new Date()}`,
    text: input.chatMessage || `${loremIpsum({count: 1})}`,
    //expireTime: 30,
    //eventDate: new Date(1511111119999),
    //system: { type: "chat.edit.system.newUser", value: "Bruneras" },
    mediaUrl: 'http://media3.giphy.com/media/kEKcOWl8RMLde/giphy.gif',
    type: 'picture'//'picture',
    //createdAt: new Date()
  };
};

function notify(input) {
  return {
    event: 'chat-msg',
    debug: true,
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
    debug: true,
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
    debug: true,
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

function chatKick(num) {
  return {
    event: 'chat-kick',
    debug: true,
    id: 34573465,
    author: {
      id:  getValue(input, 'userId') || 0,
      name: `Bot`,
    },
    text: `user Leo removed from chat`,
    type: 'text',
    target: { id: 7, name: 'Leo' }
  };
};



function keepAlive() {
  return {
    debug: true,
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