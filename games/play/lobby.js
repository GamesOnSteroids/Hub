"use strict";


var LOBBY_SERVICE = 1;
var GAME_SERVICE = 2;

var CMSG_LOGIN = 1;
var SMSG_JOIN_ROOM = 2;
var SMSG_GAME_START = 3;


var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection ||  window.webkitRTCPeerConnection || window.msRTCPeerConnection;
var SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || window.msRTCSessionDescription;
var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;

navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;


class Service {

}

class ChatService extends Service {

}


class GameService extends Service {

  on(id, handler) {
    this.lobby.on(GAME_SERVICE, id, handler);
  }

  broadcast(msg) {
    msg.service = GAME_SERVICE;
    this.lobby.broadcast(msg);
  }
}

class Player {

}

class Server {

}
class Client {

}

var servers = {
  iceServers: [
      {urls: "stun:stun.l.google.com:19302"},
      {urls: "stun:23.21.150.121"},
  ]
};

var options = {
  optional: [],
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
  }
};


function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

class Signaling {

}



class Lobby {

  constructor() {
    Lobby.current = this;

    this.clients = [];

    this.messageHandlers = [];
    this.messageHandlers[LOBBY_SERVICE] = [];
    this.messageHandlers[GAME_SERVICE] = [];

    this.on(LOBBY_SERVICE, SMSG_JOIN_ROOM, this.onJoin.bind(this));
    this.on(LOBBY_SERVICE, SMSG_GAME_START, this.onGameStart.bind(this));
  }

  join() {
    this.sendToServer({ service: LOBBY_SERVICE, id: CMSG_LOGIN, name: "myName", team: 1 });
  }



  onGameStart(client, message) {
    console.log("game start");

    ReactRouter.browserHistory.pushState({ }, '/minesweeper');
  }



  on(serviceId, messageId, callback) {
    this.messageHandlers[serviceId][messageId] = callback;
  }

  onMessage(client, msg) {
    let handler = this.messageHandlers[msg.service][msg.id];
    if (handler != null) {
      handler(client, msg);
    }
  }

}
