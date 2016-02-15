var Play;
(function (Play) {
    var MinesweeperService = Minesweeper.Service.MinesweeperService;
    class LobbyService {
        onJoin(client, message) {
            let c = new Play.Client();
            c.id = message.clientId;
            c.name = message.name;
            c.team = message.team;
            this.lobby.clients.push(c);
            if (c.id == this.lobby.clientGUID) {
                this.lobby.localClient = c;
            }
        }
        onJoinRequest(client, msg) {
            client.name = msg.name;
            client.team = msg.team;
            for (let other of this.lobby.clients) {
                client.connection.send({
                    service: Play.ServiceType.Lobby,
                    id: Play.LobbyMessageId.SMSG_JOIN,
                    name: other.name,
                    clientId: other.id,
                    team: other.team
                });
                if (other.id != client.id) {
                    other.connection.send({
                        service: Play.ServiceType.Lobby,
                        id: Play.LobbyMessageId.SMSG_JOIN,
                        name: client.name,
                        clientId: client.id,
                        team: client.team
                    });
                }
            }
            this.lobby.broadcast({
                service: Play.ServiceType.Lobby,
                id: Play.LobbyMessageId.SMSG_GAME_START,
                configuration: this.lobby.configuration
            });
        }
    }
    Play.LobbyService = LobbyService;
    class FirebaseLobbyService extends LobbyService {
        findLobby(configuration) {
            return new Promise((resolve, reject) => {
                let firebase = new Firebase("https://fiery-inferno-1131.firebaseio.com/");
                let lobbiesRef = firebase.child("lobby");
                if (configuration.lobbyId == null) {
                    lobbiesRef.once("value", (snapshot) => {
                        let lobbyRef = null;
                        let found = snapshot.forEach((snapshot) => {
                            let value = snapshot.val();
                            if (Object.keys(value.playerCount).length < value.maxPlayers) {
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
                            lobbyRef.set(lobbyDescription);
                            configuration.lobbyId = lobbyRef.key();
                            let lobby = this.lobby = new Play.Lobby(configuration);
                            lobby.clientGUID = guid();
                            lobby.on(Play.ServiceType.Lobby, Play.LobbyMessageId.CMSG_JOIN_REQUEST, this.onJoinRequest.bind(this));
                            let localClient = lobby.localClient = new Play.Client();
                            localClient.id = lobby.clientGUID;
                            localClient.name = "server";
                            localClient.team = 0;
                            let localConnection = new Play.LocalConnection();
                            localConnection.messageHandler = (msg) => { lobby.onMessage(localClient, msg); };
                            localClient.connection = localConnection;
                            lobby.serverConnection = localConnection;
                            lobby.clients.push(localClient);
                            let gameService = new MinesweeperService(lobby);
                            let signalingService = new Play.FirebaseSignalingService();
                            signalingService.createSignalingServer(lobby);
                            resolve(lobby);
                        }
                        else {
                            configuration.lobbyId = lobbyRef.key();
                            let lobby = this.lobby = new Play.Lobby(configuration);
                            lobby.clientGUID = guid();
                            lobby.on(Play.ServiceType.Lobby, Play.LobbyMessageId.SMSG_JOIN, this.onJoin.bind(this));
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