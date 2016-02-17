var Play;
(function (Play) {
    "use strict";
    class Service {
        constructor(lobby) {
            this.lobby = lobby;
        }
    }
    Play.Service = Service;
    class ChatService extends Service {
    }
    class ServerLobby {
        constructor(lobbyId, configuration) {
            this.clients = [];
            this.state = Play.LobbyState.IN_LOBBY;
            this.lobbyId = lobbyId;
            this.configuration = configuration;
            this.messageHandlers = [];
            this.messageHandlers[Play.ServiceType.Lobby] = [];
            this.messageHandlers[Play.ServiceType.Game] = [];
            this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.CMSG_JOIN_REQUEST, this.onJoinRequest.bind(this));
            this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.CMSG_READY, this.onReady.bind(this));
        }
        on(service, messageId, callback) {
            this.messageHandlers[service][messageId] = callback;
        }
        onMessage(client, msg) {
            let handler = this.messageHandlers[msg.service][msg.id];
            if (handler != null) {
                handler(client, msg);
            }
        }
        broadcast(msg) {
            for (let client of this.clients) {
                client.connection.send(msg);
            }
        }
        gameOver() {
            for (let client of this.clients) {
                client.isReady = false;
            }
            this.broadcast({ service: Play.ServiceType.Lobby, id: Play.LobbyMessageId.SMSG_GAME_OVER });
            this.state = Play.LobbyState.IN_LOBBY;
            this.messageHandlers[Play.ServiceType.Game] = [];
        }
        startGame() {
            this.gameService = new Minesweeper.Service.MinesweeperService(this);
            this.state = Play.LobbyState.GAME_RUNNING;
            this.broadcast({
                service: Play.ServiceType.Lobby,
                id: Play.LobbyMessageId.SMSG_GAME_START
            });
        }
        onReady(client, msg) {
            console.log("ServerLobby.onReady");
            if (this.state != Play.LobbyState.IN_LOBBY) {
                return;
            }
            client.isReady = true;
            let readyCount = 0;
            for (let c of this.clients) {
                if (c.isReady) {
                    readyCount++;
                }
            }
            if (readyCount == this.configuration.maxPlayers) {
                this.startGame();
            }
        }
        onJoinRequest(client, msg) {
            console.log("ServerLobby.onJoinRequest");
            client.name = msg.name;
            client.team = this.clients.indexOf(client);
            for (let other of this.clients) {
                if (other.id == client.id) {
                    client.connection.send({
                        service: Play.ServiceType.Lobby,
                        id: Play.LobbyMessageId.SMSG_PLAYER_JOINED,
                        name: other.name,
                        playerId: other.id,
                        team: other.team,
                        isYou: true,
                        configuration: this.configuration
                    });
                }
                else {
                    client.connection.send({
                        service: Play.ServiceType.Lobby,
                        id: Play.LobbyMessageId.SMSG_PLAYER_JOINED,
                        name: other.name,
                        playerId: other.id,
                        team: other.team,
                        isReady: other.isReady
                    });
                    other.connection.send({
                        service: Play.ServiceType.Lobby,
                        id: Play.LobbyMessageId.SMSG_PLAYER_JOINED,
                        name: client.name,
                        playerId: client.id,
                        team: client.team
                    });
                }
            }
            new Play.FirebaseLobbyService().onClientJoined(this, client);
        }
    }
    Play.ServerLobby = ServerLobby;
})(Play || (Play = {}));
//# sourceMappingURL=serverlobby.js.map