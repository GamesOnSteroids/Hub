var Play;
(function (Play) {
    "use strict";
    var Client = Play.Server.Client;
    var ServerLobby = Play.Server.ServerLobby;
    var LocalServerConnection = Play.Server.LocalServerConnection;
    var LocalClientConnection = Play.Server.LocalClientConnection;
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
                                let clientLobby = new ClientLobby(lobbyId, configuration);
                                clientLobby.clientGUID = guid();
                                let localClient = new Client();
                                localClient.id = clientLobby.clientGUID;
                                localClient.name = "server";
                                localClient.team = 0;
                                let serverLobby = new ServerLobby(lobbyId, configuration);
                                let signalingService = new Play.SignalingService();
                                var ref = new Firebase("https://fiery-inferno-1131.firebaseio.com/").child("lobby").child(serverLobby.lobbyId).child("sdp");
                                signalingService.createSignalingServer(serverLobby, new Play.FirebaseSignalingChannel(ref));
                                let localServerConnection = new LocalServerConnection(localClient);
                                localServerConnection.messageHandler = (client, msg) => {
                                    serverLobby.onMessage(localClient, msg);
                                };
                                clientLobby.serverConnection = localServerConnection;
                                let localClientConnection = new LocalClientConnection();
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
                            let lobby = new ClientLobby(lobbyId, configuration);
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
//# sourceMappingURL=LobbyService.js.map