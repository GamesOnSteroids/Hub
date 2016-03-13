var Play;
(function (Play) {
    "use strict";
    var Client = Play.Server.Client;
    var ServerLobby = Play.Server.ServerLobby;
    var LocalServerConnection = Play.Server.LocalServerConnection;
    var LocalClientConnection = Play.Server.LocalClientConnection;
    class FirebaseLobbyService {
        onClientJoined(lobby, client) {
            let firebase = new Firebase(config.get(environment).firebaseURL);
            let lobbyRef = firebase.child("lobby").child(lobby.configuration.lobbyId);
            lobbyRef.child("playerCount").set(lobby.clients.length, () => { });
        }
        getLobbyList() {
            return new Promise((resolve, reject) => {
                let lobbiesRef = new Firebase(config.get(environment).firebaseURL).child("lobby");
                lobbiesRef.once("value", (snapshot) => {
                    let result = [];
                    snapshot.forEach((lobbySnapshot) => {
                        result.push(lobbySnapshot.val());
                    });
                    resolve(result);
                });
            });
        }
        findLobby(configuration) {
            return new Promise((resolve, reject) => {
                Firebase.goOnline();
                if (configuration.lobbyId == null) {
                    let lobbiesRef = new Firebase(config.get(environment).firebaseURL).child("lobby");
                    lobbiesRef.once("value", (snapshot) => {
                        let lobbyRef = null;
                        let found = snapshot.forEach((lobbySnapshot) => {
                            let value = lobbySnapshot.val();
                            if (value.playerCount < value.maxPlayers && value.gameId == configuration.gameConfiguration.id && value.gameVariant == configuration.variant.id) {
                                lobbyRef = lobbySnapshot.ref();
                                return true;
                            }
                        });
                        if (!found) {
                            let lobbyDescription = {
                                playerCount: 0,
                                maxPlayers: configuration.variant.maxPlayers,
                                gameId: configuration.gameConfiguration.id,
                                createdAt: new Date(),
                                gameVariant: configuration.variant.id,
                            };
                            let lobbyRef = lobbiesRef.push();
                            lobbyRef.set(lobbyDescription, () => {
                                lobbyRef.onDisconnect().remove();
                                let lobbyId = lobbyRef.key();
                                configuration.lobbyId = lobbyId;
                                this.createLobby(configuration, resolve);
                            });
                        }
                        else {
                            let lobbyId = lobbyRef.key();
                            configuration.lobbyId = lobbyId;
                            this.joinLobby(configuration, resolve);
                        }
                    });
                }
                else {
                    new Firebase(config.get(environment).firebaseURL).child(`lobby/${configuration.lobbyId}`).once("value", (snapshot) => {
                        let lobbyId = snapshot.key();
                        let description = snapshot.val();
                        configuration.lobbyId = lobbyId;
                        configuration.gameConfiguration = gamesConfiguration.find(g => g.id == description.gameId);
                        configuration.variant = configuration.gameConfiguration.variants.find(v => v.id == description.gameVariant);
                        this.joinLobby(configuration, resolve);
                    });
                }
            });
        }
        createLobby(configuration, resolve) {
            let clientLobby = new ClientLobby(configuration);
            clientLobby.clientGUID = Guid.generate();
            let localClient = new Client();
            localClient.id = clientLobby.clientGUID;
            localClient.name = "server";
            localClient.team = 0;
            let serverLobby = new ServerLobby(configuration);
            let signalingService = new Play.SignalingService();
            let ref = new Firebase(config.get(environment).firebaseURL).child("lobby").child(serverLobby.configuration.lobbyId).child("sdp");
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
        }
        ;
        joinLobby(configuration, resolve) {
            let lobby = new ClientLobby(configuration);
            lobby.clientGUID = Guid.generate();
            let signalingService = new Play.SignalingService();
            let ref = new Firebase(config.get(environment).firebaseURL).child("lobby").child(lobby.configuration.lobbyId).child("sdp");
            signalingService.createSignalingClient(lobby, new Play.FirebaseSignalingChannel(ref));
            lobby.serverConnection.onDisconnect = lobby.onServerDisconnect.bind(lobby);
            resolve(lobby);
        }
        ;
    }
    Play.FirebaseLobbyService = FirebaseLobbyService;
})(Play || (Play = {}));
