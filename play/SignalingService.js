var Play;
(function (Play) {
    "use strict";
    var Client = Play.Server.Client;
    var Peer2PeerConnection = Play.Server.Peer2PeerConnection;
    Play.servers = {
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:23.21.150.121" },
        ],
    };
    Play.options = {
        mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true,
        },
        optional: [],
    };
    class SignalingService {
        onServerSdpMessage(server, channel, value) {
            if (value.type == "offer") {
                console.log("SignalingService.offer");
                let pc = new RTCPeerConnection(Play.servers);
                let client = new Client();
                client.id = value.source;
                let connection = new Peer2PeerConnection();
                connection.peerConnection = pc;
                connection.messageHandler = (msg) => server.onMessage(client, msg);
                client.connection = connection;
                pc.ondatachannel = (e) => {
                    connection.dataChannel = (e["channel"]);
                    connection.dataChannel.onmessage = (e) => {
                        let message = JSON.parse(e.data);
                        connection.messageHandler(message);
                    };
                };
                server.clients.push(client);
                pc.onicecandidate = (event) => {
                    if (event.candidate != undefined) {
                        channel.send({
                            candidate: JSON.stringify(event.candidate),
                            target: value.source,
                            type: "candidate",
                        });
                    }
                };
                let offer = new RTCSessionDescription(JSON.parse(value.offer));
                pc.setRemoteDescription(offer);
                pc.createAnswer((answer) => {
                    pc.setLocalDescription(answer, () => {
                        channel.send({
                            type: "answer",
                            target: value.source,
                            answer: JSON.stringify(answer),
                        });
                    });
                }, console.error);
                return true;
            }
            else if (value.type == "candidate" && value.target == null) {
                let candidate = new RTCIceCandidate(JSON.parse(value.candidate));
                let client = server.clients.find(c => c.id == value.source);
                let peerConnection = client.connection.peerConnection;
                peerConnection.addIceCandidate(candidate, () => {
                }, console.error);
                return true;
            }
            return false;
        }
        createSignalingServer(lobby, channel) {
            channel.onReceive((snapshot) => {
                return this.onServerSdpMessage(lobby, channel, snapshot);
            });
        }
        onClientSdpMessage(lobby, value) {
            if (value.type == "answer" && value.target == lobby.clientGUID) {
                console.log("SignalingService.answer");
                let answer = new RTCSessionDescription(JSON.parse(value.answer));
                lobby.serverConnection.peerConnection.setRemoteDescription(answer);
                return true;
            }
            else if (value.type == "candidate" && (value.target != undefined && value.target == lobby.clientGUID)) {
                let candidate = new RTCIceCandidate(JSON.parse(value.candidate));
                lobby.serverConnection.peerConnection.addIceCandidate(candidate, () => {
                }, console.error);
                return true;
            }
            return false;
        }
        createSignalingClient(lobby, channel) {
            channel.onReceive((data) => {
                return this.onClientSdpMessage(lobby, data);
            });
            let pc = new RTCPeerConnection(Play.servers);
            let dataChannel = pc.createDataChannel(lobby.clientGUID, { ordered: true });
            let connection = new Peer2PeerConnection();
            connection.peerConnection = pc;
            connection.dataChannel = dataChannel;
            connection.messageHandler = (msg) => lobby.onMessage(msg);
            lobby.serverConnection = connection;
            dataChannel.onopen = (event) => {
                console.log("SignalingService.dataChannel.onopen");
                let readyState = dataChannel.readyState;
                dataChannel.onmessage = (e) => {
                    let message = JSON.parse(e.data);
                    connection.messageHandler(message);
                };
                if (readyState == "open") {
                    lobby.join();
                }
            };
            pc.onicecandidate = (event) => {
                if (event.candidate != undefined) {
                    channel.send({
                        type: "candidate",
                        source: lobby.clientGUID,
                        candidate: JSON.stringify(event.candidate)
                    });
                }
            };
            pc.createOffer((offer) => {
                console.log("SignalingService.createOffer");
                pc.setLocalDescription(offer, () => {
                    channel.send({
                        type: "offer",
                        source: lobby.clientGUID,
                        offer: JSON.stringify(offer),
                    });
                });
            }, console.error, Play.options);
        }
    }
    Play.SignalingService = SignalingService;
})(Play || (Play = {}));
//# sourceMappingURL=SignalingService.js.map