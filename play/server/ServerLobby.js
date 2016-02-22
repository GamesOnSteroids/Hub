var Play;
(function (Play) {
    var Server;
    (function (Server) {
        "use strict";
        (function (LobbyState) {
            LobbyState[LobbyState["IN_LOBBY"] = 0] = "IN_LOBBY";
            LobbyState[LobbyState["GAME_RUNNING"] = 1] = "GAME_RUNNING";
            LobbyState[LobbyState["GAME_OVER"] = 2] = "GAME_OVER";
        })(Server.LobbyState || (Server.LobbyState = {}));
        var LobbyState = Server.LobbyState;
        class ChatService extends Server.Service {
        }
        class ServerLobby {
            constructor(lobbyId, configuration) {
                this.clients = [];
                this.state = LobbyState.IN_LOBBY;
                this.messageHandlers = new Map([
                    [Play.ServiceType.Lobby, new Map()],
                    [Play.ServiceType.Game, new Map()]
                ]);
                this.lobbyId = lobbyId;
                this.configuration = configuration;
                this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.CMSG_JOIN_REQUEST, this.onJoinRequest.bind(this));
                this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.CMSG_READY, this.onReady.bind(this));
                this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.CMSG_CHAT, this.onChat.bind(this));
            }
            on(service, messageId, callback) {
                this.messageHandlers.get(service).set(messageId, callback);
            }
            onMessage(client, msg) {
                let handler = this.messageHandlers.get(msg.service).get(msg.id);
                if (handler != undefined) {
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
                this.broadcast(new Play.GameOverMessage());
                this.state = LobbyState.IN_LOBBY;
                this.messageHandlers.get(Play.ServiceType.Game).clear();
            }
            startGame() {
                this.gameService = new this.configuration.serviceClass(this);
                this.state = LobbyState.GAME_RUNNING;
                this.broadcast(new Play.GameStartMessage());
                this.gameService.start();
            }
            onChat(client, msg) {
                this.broadcast(new Play.PlayerChatMessage(client.id, msg.text));
            }
            onReady(client, msg) {
                console.log("ServerLobby.onReady");
                if (this.state != LobbyState.IN_LOBBY) {
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
                console.log("ServerLobby.onJoinRequest", msg);
                client.name = msg.name;
                client.team = this.clients.indexOf(client);
                client.isConnected = true;
                for (let other of this.clients) {
                    if (other.id == client.id) {
                        client.connection.send(new Play.PlayerJoinedMessage(other.id, other.name, other.team, this.configuration.gameConfiguration, true));
                    }
                    else {
                        if (other.isConnected) {
                            client.connection.send(new Play.PlayerJoinedMessage(other.id, other.name, other.team));
                            other.connection.send(new Play.PlayerJoinedMessage(client.id, client.name, client.team));
                        }
                    }
                }
                new Play.FirebaseLobbyService().onClientJoined(this, client);
            }
        }
        Server.ServerLobby = ServerLobby;
    })(Server = Play.Server || (Play.Server = {}));
})(Play || (Play = {}));
//# sourceMappingURL=ServerLobby.js.map