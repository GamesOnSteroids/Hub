
Service = class Service {

}

class ChatService extends Service {

}



class Player {

}

Lobby = class Lobby {

  constructor(service) {
    this.server = this.localPlayer = new Player();
    this.server.id = 0;
    this.server.team = 0;
    this.players = [];
    this.players.push(this.localPlayer);
    this.messageHandlers = [];
    this.gameService = service;
    this.gameService.lobby = this;

    this.gameService.initialize();
  }

  on(messageId, callback) {
    this.messageHandlers[messageId] = callback;
  }

  onMessage(player, msg) {
    let handler = this.messageHandlers[msg.id];
    if (handler != null) {
      handler(player, msg);
    }
  }


  broadcast(msg) {
    for (let player of this.players) {
      this.sendTo(player, msg);
    }
  }

  sendToServer(msg) {
    this.sendTo(this.server, msg);
  }

  sendTo(player, msg) {
    if (this.server == this.localPlayer) {
      this.onMessage(this.localPlayer, msg);
    } else {
      // send message over socket
    }
  }
}
