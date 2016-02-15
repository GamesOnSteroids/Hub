var Play;
(function (Play) {
    (function (ServiceType) {
        ServiceType[ServiceType["Lobby"] = 1] = "Lobby";
        ServiceType[ServiceType["Game"] = 2] = "Game";
        ServiceType[ServiceType["Chat"] = 3] = "Chat";
    })(Play.ServiceType || (Play.ServiceType = {}));
    var ServiceType = Play.ServiceType;
    (function (LobbyMessageId) {
        LobbyMessageId[LobbyMessageId["CMSG_JOIN_REQUEST"] = 1] = "CMSG_JOIN_REQUEST";
        LobbyMessageId[LobbyMessageId["SMSG_JOIN"] = 2] = "SMSG_JOIN";
        LobbyMessageId[LobbyMessageId["SMSG_GAME_START"] = 3] = "SMSG_GAME_START";
    })(Play.LobbyMessageId || (Play.LobbyMessageId = {}));
    var LobbyMessageId = Play.LobbyMessageId;
    class Service {
        constructor(lobby) {
            this.lobby = lobby;
        }
    }
    Play.Service = Service;
    class ChatService extends Service {
    }
    class Lobby {
        constructor(configuration) {
            this.clients = [];
            Lobby.current = this;
            this.configuration = configuration;
            this.messageHandlers = [];
            this.messageHandlers[ServiceType.Lobby] = [];
            this.messageHandlers[ServiceType.Game] = [];
            this.on(ServiceType.Lobby, LobbyMessageId.SMSG_GAME_START, this.onGameStart.bind(this));
        }
        sendToServer(msg) {
            this.serverConnection.send(msg);
        }
        onGameStart(client, message) {
            console.log("game start");
            this.configuration = message.configuration;
            ReactRouter.browserHistory.pushState({}, '/minesweeper');
        }
        on(service, messageId, callback) {
            this.messageHandlers[service][messageId] = callback;
        }
        onMessage(client, msg) {
            console.log("onMessage", msg);
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
    }
    Play.Lobby = Lobby;
})(Play || (Play = {}));
//# sourceMappingURL=lobby.js.map