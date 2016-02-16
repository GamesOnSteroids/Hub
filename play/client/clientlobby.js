var Play;
(function (Play) {
    class ClientLobby {
        constructor(lobbyId) {
            this.clients = [];
            this.gameStarted = false;
            this.lobbyId = lobbyId;
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
            console.log("ClientLobby.onGameStart");
            this.gameStarted = true;
            if (this.gameStartedCallback != null) {
                this.gameStartedCallback();
            }
        }
        onJoin(message) {
            console.log("ClientLobby.onJoin");
            let c = new Play.Client();
            c.id = message.clientId;
            c.name = message.name;
            c.team = message.team;
            this.clients.push(c);
            if (message.isYou) {
                this.configuration = message.configuration;
                this.localClient = c;
            }
        }
    }
    Play.ClientLobby = ClientLobby;
})(Play || (Play = {}));
//# sourceMappingURL=clientlobby.js.map