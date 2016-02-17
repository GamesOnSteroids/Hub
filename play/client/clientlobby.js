var Play;
(function (Play) {
    "use strict";
    (function (LobbyState) {
        LobbyState[LobbyState["IN_LOBBY"] = 0] = "IN_LOBBY";
        LobbyState[LobbyState["GAME_RUNNING"] = 1] = "GAME_RUNNING";
        LobbyState[LobbyState["GAME_OVER"] = 2] = "GAME_OVER";
    })(Play.LobbyState || (Play.LobbyState = {}));
    var LobbyState = Play.LobbyState;
    class ClientLobby {
        constructor(lobbyId) {
            this.players = [];
            this.state = LobbyState.IN_LOBBY;
            this.lobbyId = lobbyId;
            this.messageHandlers = [];
            this.messageHandlers[Play.ServiceType.Lobby] = [];
            this.messageHandlers[Play.ServiceType.Game] = [];
            this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.SMSG_GAME_START, this.onGameStart.bind(this));
            this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.SMSG_PLAYER_JOINED, this.onJoin.bind(this));
            this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.SMSG_GAME_OVER, this.onGameOver.bind(this));
            this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.SMSG_PLAYER_READY, this.onPlayerReady.bind(this));
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
        changeState(state, completed) {
            console.log("ClientLobby.changeState", state);
            this.state = state;
            if (this.changeListener != null) {
                this.changeListener(this, completed);
            }
        }
        backToLobby() {
            this.changeState(LobbyState.IN_LOBBY, () => {
                this.ready();
            });
        }
        join() {
            this.sendToServer({
                service: Play.ServiceType.Lobby,
                id: Play.LobbyMessageId.CMSG_JOIN_REQUEST,
                name: guid(),
                team: 1
            });
            this.ready();
        }
        ready() {
            console.log("ClientLobby.ready");
            this.sendToServer({ service: Play.ServiceType.Lobby, id: Play.LobbyMessageId.CMSG_READY });
        }
        onPlayerReady(message) {
            console.log("ClientLobby.onPlayerReady");
            let player = this.players.find(p => p.id == message.playerId);
            player.isReady = true;
        }
        onGameOver(message) {
            console.log("ClientLobby.onGameOver");
            this.messageHandlers[Play.ServiceType.Game] = [];
            this.changeState(LobbyState.GAME_OVER);
        }
        onGameStart(message) {
            console.log("ClientLobby.onGameStart");
            this.changeState(LobbyState.GAME_RUNNING);
        }
        onJoin(message) {
            console.log("ClientLobby.onJoin");
            let player = new Play.PlayerInfo();
            player.id = message.playerId;
            player.name = message.name;
            player.team = message.team;
            this.players.push(player);
            if (message.isYou) {
                this.configuration = message.configuration;
                this.localPlayer = player;
            }
            if (this.changeListener != null) {
                this.changeListener(this, null);
            }
        }
    }
    Play.ClientLobby = ClientLobby;
})(Play || (Play = {}));
//# sourceMappingURL=clientlobby.js.map