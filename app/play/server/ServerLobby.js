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
            constructor(configuration) {
                this.clients = [];
                this.state = LobbyState.IN_LOBBY;
                this.messageHandlers = new Map([
                    [Play.ServiceType.Lobby, new Map()],
                    [Play.ServiceType.Game, new Map()]
                ]);
                ServerLobby.current = this;
                this.configuration = configuration;
                this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.CMSG_JOIN_REQUEST, this.onJoinRequest.bind(this));
                this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.CMSG_READY, this.onReady.bind(this));
                this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.CMSG_CHAT, this.onChat.bind(this));
            }
            on(service, messageId, callback) {
                this.messageHandlers.get(service).set(messageId, callback);
            }
            destroy() {
                this.clients.forEach(c => c.connection.disconnect());
            }
            onMessage(client, msg) {
                let handler = this.messageHandlers.get(msg.service).get(msg.id);
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
                this.broadcast(new Play.GameOverMessage());
                this.state = LobbyState.IN_LOBBY;
                this.messageHandlers.get(Play.ServiceType.Game).clear();
            }
            startGame() {
                this.gameService = new (ClassUtils.resolveClass(this.configuration.gameConfiguration.serviceClass))(this);
                this.state = LobbyState.GAME_RUNNING;
                this.broadcast(new Play.GameStartMessage());
                this.gameService.start();
            }
            onChat(client, msg) {
                this.broadcast(new Play.PlayerChatMessage(client.name, msg.text));
            }
            onReady(client, msg) {
                console.log("ServerLobby.onReady");
                if (this.state != LobbyState.IN_LOBBY) {
                    return;
                }
                client.isReady = true;
                this.broadcast(new Play.PlayerReadyMessage(client.id));
                let readyCount = 0;
                for (let c of this.clients) {
                    if (c.isReady) {
                        readyCount++;
                    }
                }
                if (readyCount == this.configuration.variant.maxPlayers) {
                    this.startGame();
                }
            }
            onDisconnect(client) {
                if (client.isConnected) {
                    client.isConnected = false;
                    this.clients.splice(this.clients.indexOf(client), 1);
                    this.broadcast(new Play.PlayerLeftMessage(client.id));
                    this.gameOver();
                }
            }
            onJoinRequest(client, msg) {
                console.log("ServerLobby.onJoinRequest", msg);
                client.connection.onDisconnect = this.onDisconnect.bind(this, client);
                client.name = msg.name;
                let teamCount = this.configuration.variant.teamCount;
                if (teamCount == null) {
                    teamCount = this.configuration.variant.maxPlayers;
                }
                client.position = this.clients.indexOf(client);
                client.team = Math.floor(this.clients.indexOf(client) % teamCount);
                client.isConnected = true;
                client.connection.send(new Play.PlayerJoinedMessage(client.id, client.name, client.team, client.position, this.configuration.gameConfiguration, true));
                for (let other of this.clients) {
                    if (other.id != client.id) {
                        if (other.isConnected) {
                            client.connection.send(new Play.PlayerJoinedMessage(other.id, other.name, other.team, other.position));
                            other.connection.send(new Play.PlayerJoinedMessage(client.id, client.name, client.team, client.position));
                        }
                    }
                }
                new Play.FirebaseLobbyService().onClientJoined(this, client);
            }
        }
        Server.ServerLobby = ServerLobby;
    })(Server = Play.Server || (Play.Server = {}));
})(Play || (Play = {}));
