var Play;
(function (Play) {
    "use strict";
    class FirebaseLobbyService {
        onClientJoined(lobby, client) {
            let firebase = new Firebase("https://fiery-inferno-1131.firebaseio.com/");
            let lobbyRef = firebase.child("lobby").child(lobby.configuration.lobbyId);
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
                let firebase = new Firebase("https://fiery-inferno-1131.firebaseio.com/");
                let lobbiesRef = firebase.child("lobby");
                if (configuration.lobbyId == null) {
                    lobbiesRef.once("value", (snapshot) => {
                        let lobbyRef = null;
                        let found = snapshot.forEach((snapshot) => {
                            let value = snapshot.val();
                            if (value.playerCount < value.maxPlayers) {
                                lobbyRef = snapshot.ref();
                                return true;
                            }
                        });
                        if (!found) {
                            let lobbyDescription = {
                                playerCount: 1,
                                maxPlayers: configuration.maxPlayers,
                                gameId: configuration.gameId,
                                createdAt: new Date(),
                            };
                            let lobbyRef = lobbiesRef.push();
                            lobbyRef.set(lobbyDescription, () => {
                                configuration.lobbyId = lobbyRef.key();
                                let clientLobby = new Play.ClientLobby(configuration);
                                clientLobby.clientGUID = guid();
                                let localClient = clientLobby.localClient = new Play.Client();
                                localClient.id = clientLobby.clientGUID;
                                localClient.name = "server";
                                localClient.team = 0;
                                let serverLobby = new Play.ServerLobby(configuration);
                                let gameService = new Minesweeper.Service.MinesweeperService(serverLobby);
                                let signalingService = new Play.FirebaseSignalingService();
                                signalingService.createSignalingServer(serverLobby);
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
                                clientLobby.sendToServer({
                                    service: Play.ServiceType.Lobby,
                                    id: Play.LobbyMessageId.CMSG_JOIN_REQUEST,
                                    name: "myName",
                                    team: 1
                                });
                                resolve(clientLobby);
                            });
                        }
                        else {
                            configuration.lobbyId = lobbyRef.key();
                            let lobby = new Play.ClientLobby(configuration);
                            lobby.clientGUID = guid();
                            let signalingService = new Play.FirebaseSignalingService();
                            signalingService.createSignalingClient(lobby);
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