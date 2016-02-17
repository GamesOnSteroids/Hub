var Play;
(function (Play) {
    "use strict";
    class FirebaseLobbyService {
        onClientJoined(lobby, client) {
            let firebase = new Firebase("https://fiery-inferno-1131.firebaseio.com/");
            let lobbyRef = firebase.child("lobby").child(lobby.lobbyId);
            lobbyRef.transaction((data) => {
                if (data != null) {
                    data.playerCount += 1;
                }
                return data;
            }, (error, commited, snapshot) => {
                if (error != null) {
                    console.error(error);
                }
            }, true);
        }
        findLobby(configuration) {
            return new Promise((resolve, reject) => {
                let lobbiesRef = new Firebase("https://fiery-inferno-1131.firebaseio.com/").child("lobby");
                if (configuration.lobbyId == null) {
                    lobbiesRef.once("value", (snapshot) => {
                        let lobbyRef = null;
                        let found = snapshot.forEach((snapshot) => {
                            let value = snapshot.val();
                            if (value.playerCount < value.maxPlayers && value.gameId == configuration.gameId) {
                                lobbyRef = snapshot.ref();
                                return true;
                            }
                        });
                        if (!found) {
                            let lobbyDescription = {
                                playerCount: 0,
                                maxPlayers: configuration.maxPlayers,
                                gameId: configuration.gameId,
                                createdAt: new Date(),
                            };
                            let lobbyRef = lobbiesRef.push();
                            lobbyRef.set(lobbyDescription, () => {
                                let lobbyId = lobbyRef.key();
                                let clientLobby = new Play.ClientLobby(lobbyId);
                                clientLobby.clientGUID = guid();
                                let localClient = new Play.Client();
                                localClient.id = clientLobby.clientGUID;
                                localClient.name = "server";
                                localClient.team = 0;
                                let serverLobby = new Play.ServerLobby(lobbyId, configuration);
                                let signalingService = new Play.SignalingService();
                                var ref = new Firebase("https://fiery-inferno-1131.firebaseio.com/").child("lobby").child(serverLobby.lobbyId).child("sdp");
                                signalingService.createSignalingServer(serverLobby, new Play.FirebaseSignalingChannel(ref));
                                let localServerConnection = new Play.LocalServerConnection(localClient);
                                localServerConnection.messageHandler = (client, msg) => {
                                    serverLobby.onMessage(localClient, msg);
                                };
                                clientLobby.serverConnection = localServerConnection;
                                let localClientConnection = new Play.LocalClientConnection();
                                localClientConnection.messageHandler = (msg) => {
                                    clientLobby.onMessage(msg);
                                };
                                localClient.connection = localClientConnection;
                                serverLobby.clients.push(localClient);
                                clientLobby.join();
                                resolve(clientLobby);
                            });
                        }
                        else {
                            let lobbyId = lobbyRef.key();
                            let lobby = new Play.ClientLobby(lobbyId);
                            lobby.clientGUID = guid();
                            let signalingService = new Play.SignalingService();
                            var ref = new Firebase("https://fiery-inferno-1131.firebaseio.com/").child("lobby").child(lobby.lobbyId).child("sdp");
                            signalingService.createSignalingClient(lobby, new Play.FirebaseSignalingChannel(ref));
                            resolve(lobby);
                        }
                    });
                }
                else {
                    throw "Not implemented";
                }
            });
        }
    }
    Play.FirebaseLobbyService = FirebaseLobbyService;
})(Play || (Play = {}));
//# sourceMappingURL=lobbyservice.js.map