var Play;
(function (Play) {
    "use strict";
    Play.servers = {
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:23.21.150.121" },
        ]
    };
    Play.options = {
        mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
        },
        optional: []
    };
    class FirebaseSignalingService {
        onServerSdpMessage(lobby, channel, snapshot) {
            let value = snapshot.val();
            if (value.type == "offer") {
                console.log("offer");
                let pc = new RTCPeerConnection(Play.servers);
                let client = new Play.Client();
                client.id = value.source;
                let connection = new Play.Peer2PeerConnection();
                connection.peerConnection = pc;
                connection.messageHandler = (msg) => lobby.onMessage(client, msg);
                client.connection = connection;
                pc.ondatachannel = (e) => {
                    connection.dataChannel = (e["channel"]);
                    connection.dataChannel.onmessage = (e) => {
                        let message = JSON.parse(e.data);
                        connection.messageHandler(message);
                    };
                };
                lobby.clients.push(client);
                pc.onicecandidate = (event) => {
                    if (event.candidate != null) {
                        channel.push({
                            type: "candidate",
                            target: value.source,
                            candidate: JSON.stringify(event.candidate)
                        });
                    }
                };
                let offer = new RTCSessionDescription(JSON.parse(value.offer));
                pc.setRemoteDescription(offer);
                pc.createAnswer((answer) => {
                    pc.setLocalDescription(answer, () => {
                        channel.push({ type: "answer", target: value.source, answer: JSON.stringify(answer) });
                    });
                }, console.error);
                snapshot.ref().remove();
            }
            else if (value.type == "candidate" && value.target == null) {
                let candidate = new RTCIceCandidate(JSON.parse(value.candidate));
                let client = lobby.clients.find(c => c.id == value.source);
                let peerConnection = client.connection.peerConnection;
                peerConnection.addIceCandidate(candidate, () => {
                }, console.error);
                snapshot.ref().remove();
            }
        }
        createSignalingServer(lobby) {
            let firebase = new Firebase("https://fiery-inferno-1131.firebaseio.com/");
            let lobbyRef = firebase.child("lobby").child(lobby.configuration.lobbyId);
            let sdpRef = lobbyRef.child("sdp");
            sdpRef.on("child_added", (snapshot) => {
                this.onServerSdpMessage(lobby, sdpRef, snapshot);
            });
        }
        onClientSdpMessage(lobby, snapshot) {
            let value = snapshot.val();
            if (value.type == "answer" && value.target == lobby.clientGUID) {
                console.log("answer");
                let answer = new RTCSessionDescription(JSON.parse(value.answer));
                lobby.serverConnection.peerConnection.setRemoteDescription(answer);
                snapshot.ref().remove();
            }
            else if (value.type == "candidate" && (value.target != null && value.target == lobby.clientGUID)) {
                let candidate = new RTCIceCandidate(JSON.parse(value.candidate));
                lobby.serverConnection.peerConnection.addIceCandidate(candidate, () => {
                }, console.error);
                snapshot.ref().remove();
            }
        }
        createSignalingClient(lobby) {
            let firebase = new Firebase("https://fiery-inferno-1131.firebaseio.com/");
            let lobbyRef = firebase.child("lobby").child(lobby.configuration.lobbyId);
            let sdpRef = lobbyRef.child("sdp");
            sdpRef.on("child_added", (snapshot) => {
                this.onClientSdpMessage(lobby, snapshot);
            });
            let pc = new RTCPeerConnection(Play.servers);
            let channel = pc.createDataChannel(lobby.clientGUID, { ordered: true });
            let connection = new Play.Peer2PeerConnection();
            connection.peerConnection = pc;
            connection.dataChannel = channel;
            connection.messageHandler = (msg) => lobby.onMessage(null, msg);
            lobby.serverConnection = connection;
            channel.onopen = (event) => {
                console.log("connection open");
                let readyState = channel.readyState;
                channel.onmessage = (e) => {
                    let message = JSON.parse(e.data);
                    connection.messageHandler(message);
                };
                if (readyState == "open") {
                    lobby.sendToServer({
                        service: Play.ServiceType.Lobby,
                        id: Play.LobbyMessageId.CMSG_JOIN_REQUEST,
                        name: "myName",
                        team: 1
                    });
                }
            };
            pc.onicecandidate = (event) => {
                if (event.candidate != null) {
                    sdpRef.push({
                        type: "candidate",
                        source: lobby.clientGUID,
                        candidate: JSON.stringify(event.candidate)
                    });
                }
            };
            pc.createOffer((offer) => {
                pc.setLocalDescription(offer, () => {
                    sdpRef.push({ type: "offer", source: lobby.clientGUID, offer: JSON.stringify(offer) });
                });
            }, console.error, Play.options);
        }
    }
    Play.FirebaseSignalingService = FirebaseSignalingService;
})(Play || (Play = {}));
//# sourceMappingURL=signaling.js.map