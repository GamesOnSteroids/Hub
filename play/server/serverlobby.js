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
            this.lobbyId = lobbyId;
            this.configuration = configuration;
            this.messageHandlers = [];
            this.messageHandlers[Play.ServiceType.Lobby] = [];
            this.messageHandlers[Play.ServiceType.Game] = [];
            this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.CMSG_JOIN_REQUEST, this.onJoinRequest.bind(this));
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
        onJoinRequest(client, msg) {
            console.log("ServerLobby.onJoinRequest");
            client.name = msg.name;
            client.team = msg.team;
            for (let other of this.clients) {
                if (other.id == client.id) {
                    client.connection.send({
                        service: Play.ServiceType.Lobby,
                        id: Play.LobbyMessageId.SMSG_JOIN,
                        name: other.name,
                        clientId: other.id,
                        team: other.team,
                        isYou: true,
                        configuration: this.configuration
                    });
                }
                else {
                    client.connection.send({
                        service: Play.ServiceType.Lobby,
                        id: Play.LobbyMessageId.SMSG_JOIN,
                        name: other.name,
                        clientId: other.id,
                        team: other.team,
                        isReady: other.isReady
                    });
                    other.connection.send({
                        service: Play.ServiceType.Lobby,
                        id: Play.LobbyMessageId.SMSG_JOIN,
                        name: client.name,
                        clientId: client.id,
                        team: client.team
                    });
                }
            }
            if (this.clients.length == this.configuration.maxPlayers) {
                this.broadcast({
                    service: Play.ServiceType.Lobby,
                    id: Play.LobbyMessageId.SMSG_GAME_START
                });
            }
            new Play.FirebaseLobbyService().onClientJoined(this, client);
        }
    }
    Play.ServerLobby = ServerLobby;
})(Play || (Play = {}));
//# sourceMappingURL=serverlobby.js.map