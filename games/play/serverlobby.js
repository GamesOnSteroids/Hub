"use strict";

class ServerLobby extends Lobby {

  constructor(ref, gameConfiguration) {
    super();
    let lobbiesRef = ref.child("lobby");

    let lobbyDescription = {
      playerCount: 1,
      maxPlayers: 2,
      gameId: "minesweeper",
      createdAt: new Date(),
    };

    let lobbyRef = lobbiesRef.push();
    lobbyRef.set(lobbyDescription);

    this.isServer = true;

    let localClient = this.localClient = new Client();
    localClient.id = guid();
    localClient.name = "server";
    localClient.team = 0;
    this.clients.push(localClient);

    let sdpRef = lobbyRef.child("sdp");
    sdpRef.on("child_added", (snapshot) => { this.onSdpMessage(sdpRef, snapshot); } );


    this.on(LOBBY_SERVICE, CMSG_LOGIN, this.onLogin.bind(this));

    this.gameService = new Minesweeper.Service.MinesweeperService();
    this.gameService.lobby = this;

    this.gameService.initialize();
  }

  onSdpMessage(channel, snapshot) {
    let value = snapshot.val();

    if (value.type == "offer" && this.isServer) { // offer send by client, recieved by server
      console.log("offer");

      let pc =  new RTCPeerConnection(servers);

      let client = new Client();
      client.id = value.source;
      client.connection = pc;
      this.clients.push(client);

      pc.ondatachannel = (e) => {
        Firebase.goOffline();
        let receiveChannel = client.dataChannel = e.channel;
        receiveChannel.onmessage = (e) => {
          this.onDataMessage(e);
        };
      };
      pc.onicecandidate = (event) => {
        if (event.candidate != null) {
          channel.push( { type: "candidate", target: value.source, candidate: JSON.stringify(event.candidate) });
        }
      };

      let offer = new SessionDescription(JSON.parse(value.offer));
      pc.setRemoteDescription(offer);
      pc.createAnswer((answer) => {
          pc.setLocalDescription(answer, () => {
            channel.push({type: "answer", target: value.source, answer: JSON.stringify(answer)});
          });
      });
      snapshot.ref().remove();
    } else if (value.type == "candidate" && value.target == null) {

      let candidate = new IceCandidate(JSON.parse(value.candidate));
      this.clients.find(c=>c.id == value.source).connection.addIceCandidate(candidate);
      snapshot.ref().remove();
    }
  }


  onJoin(client, message) {
    this.gameService.onJoin(client);
  }


  onLogin(client, msg) {
    client.name = msg.name;
    client.team = msg.team;

    for (let c of this.clients) {
      this.sendTo(client, {service: LOBBY_SERVICE, id: SMSG_JOIN_ROOM, name: c.name, clientId: c.id, team: c.team}); // send other players to connecting player
      if (c.id != client.id) {
        this.sendTo(c, {service: LOBBY_SERVICE, id: SMSG_JOIN_ROOM, name: client.name, clientId: client.id, team: client.team}); // send connecting player to other players
      }
    }
    this.broadcast({service:LOBBY_SERVICE, id:SMSG_GAME_START});
  }



  onDataMessage(e) {
    console.log("message", e.data);
    let message = JSON.parse(e.data);

    let client = this.clients.find( c => c.dataChannel != null && c.dataChannel.id == e.target.id);
    this.onMessage(client, message);
  }

  broadcast(msg) {
    for (let client of this.clients) {
      this.sendTo(client, msg);
    }
  }

  sendToServer(msg) {
    this.onMessage(this.clients[0], msg);
  }

  sendTo(client, msg) {
    if (client.connection == null) { // local client
      this.onMessage(client, msg);
    } else {
      client.dataChannel.send(JSON.stringify(msg));
    }
  }
}
