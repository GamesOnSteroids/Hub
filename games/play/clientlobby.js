"use strict";

class ClientLobby extends Lobby {

  onDataMessage(e) {
    console.log("message", e.data);
    let message = JSON.parse(e.data);

    this.onMessage(message);
  }


  onMessage(msg) {
    let handler = this.messageHandlers[msg.service][msg.id];
    if (handler != null) {
      handler(null, msg);
    }
  }



  onJoin(client, message) {

    let c = new Client();
    c.id = message.clientId;
    c.name = message.name;
    c.team = message.team;

    this.clients.push(c);

    if (c.id == this.clientGUID) {
      this.localClient = c;
    }
  }

  constructor(lobbyRef) {
    super();

    this.clientGUID = guid();

    let sdpRef = lobbyRef.child("sdp");
    sdpRef.on("child_added", (snapshot) => { this.onSdpMessage(sdpRef, snapshot); });


    let pc = new RTCPeerConnection(servers);
    let channel = pc.createDataChannel("channel", {ordered: true});

    this.server = new Server();
    this.server.connection = pc;
    this.server.dataChannel = channel;

    channel.onopen = (event) => {
      console.log("connection open");
      let readyState = channel.readyState;
      channel.onmessage = (e) => { this.onDataMessage(e); };
      if (readyState == "open") {
        this.join();
      }
    };
    pc.onicecandidate = (event) => {
      if (event.candidate != null) {
        sdpRef.push( { type: "candidate", source: this.clientGUID, candidate: JSON.stringify(event.candidate) });
      }
    };
    pc.createOffer((offer) => {
      pc.setLocalDescription(offer, () => {
        sdpRef.push({type: "offer", source: this.clientGUID, offer: JSON.stringify(offer)});
      });
    }, null, options);


  }

  onSdpMessage(channel, snapshot) {
    let value = snapshot.val();

    if (value.type == "answer" && value.target == this.clientGUID) {
      console.log("answer");

      let answer = new SessionDescription(JSON.parse(value.answer));
      this.server.connection.setRemoteDescription(answer);
      snapshot.ref().remove();

    } else if (value.type == "candidate" && (value.target != null && value.target == this.clientGUID)) {
      let candidate = new IceCandidate(JSON.parse(value.candidate));
      this.server.connection.addIceCandidate(candidate);
      snapshot.ref().remove();
    }
  }

  sendToServer(msg) {
    this.server.dataChannel.send(JSON.stringify(msg));
  }

}
