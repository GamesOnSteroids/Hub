var Play;
(function (Play) {
    class ClientLobby {
        constructor(configuration) {
            this.clients = [];
            ClientLobby.current = this;
            this.configuration = configuration;
            this.messageHandlers = [];
            this.messageHandlers[Play.ServiceType.Lobby] = [];
            this.messageHandlers[Play.ServiceType.Game] = [];
            this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.SMSG_GAME_START, this.onGameStart.bind(this));
            this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.SMSG_JOIN, this.onJoin.bind(this));
        }
        sendToServer(msg) {
            this.serverConnection.send(msg);
        }
        on(service, messageId, callback) {
            this.messageHandlers[service][messageId] = callback;
        }
        onMessage(msg) {
            let handler = this.messageHandlers[msg.service][msg.id];
            if (handler != null) {
                handler(msg);
            }
        }
        onGameStart(message) {
            console.log("game start");
            if (this.gameStarted != null) {
                this.gameStarted();
            }
        }
        onJoin(message) {
            this.configuration = message.configuration;
            let c = new Play.Client();
            c.id = message.clientId;
            c.name = message.name;
            c.team = message.team;
            this.clients.push(c);
            if (c.id == this.clientGUID) {
                this.localClient = c;
            }
        }
    }
    Play.ClientLobby = ClientLobby;
})(Play || (Play = {}));
//# sourceMappingURL=clientlobby.js.map