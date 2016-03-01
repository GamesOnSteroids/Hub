var Play;
(function (Play) {
    var Client;
    (function (Client) {
        "use strict";
        (function (LobbyState) {
            LobbyState[LobbyState["IN_LOBBY"] = 0] = "IN_LOBBY";
            LobbyState[LobbyState["GAME_RUNNING"] = 1] = "GAME_RUNNING";
            LobbyState[LobbyState["GAME_OVER"] = 2] = "GAME_OVER";
        })(Client.LobbyState || (Client.LobbyState = {}));
        var LobbyState = Client.LobbyState;
        class ChatLog {
            constructor(date, author, text) {
                this.date = date;
                this.author = author;
                this.text = text;
            }
        }
        Client.ChatLog = ChatLog;
        class ClientLobby {
            constructor(lobbyId, configuration) {
                this.players = [];
                this.messageLog = [];
                this.state = LobbyState.IN_LOBBY;
                this.changeListener = new Client.EventDispatcher();
                this.messageHandlers = new Map([
                    [Play.ServiceType.Lobby, new Map()],
                    [Play.ServiceType.Game, new Map()]
                ]);
                this.lobbyId = lobbyId;
                this.configuration = configuration;
                this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.SMSG_GAME_START, this.onGameStart.bind(this));
                this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.SMSG_PLAYER_JOINED, this.onJoin.bind(this));
                this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.SMSG_GAME_OVER, this.onGameOver.bind(this));
                this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.SMSG_PLAYER_READY, this.onPlayerReady.bind(this));
                this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.SMSG_PLAYER_CHAT, this.onPlayerChat.bind(this));
            }
            sendToServer(msg) {
                this.serverConnection.send(msg);
            }
            on(service, messageId, callback) {
                this.messageHandlers.get(service).set(messageId, callback);
            }
            onMessage(msg) {
                let handler = this.messageHandlers.get(msg.service).get(msg.id);
                if (handler != null) {
                    handler(msg);
                }
            }
            sendChat(message) {
                this.sendToServer(new Play.ChatMessage(message));
            }
            backToLobby() {
                this.state = LobbyState.IN_LOBBY;
                this.emitChange(() => {
                    this.ready();
                });
            }
            join() {
                this.sendToServer({
                    service: Play.ServiceType.Lobby,
                    id: Play.LobbyMessageId.CMSG_JOIN_REQUEST,
                    name: localStorage.getItem("nickname"),
                    team: 1,
                });
                this.ready();
            }
            ready() {
                console.log("ClientLobby.ready");
                this.sendToServer({ service: Play.ServiceType.Lobby, id: Play.LobbyMessageId.CMSG_READY });
            }
            emitChange(completed) {
                this.changeListener.dispatch(this, completed);
            }
            onPlayerChat(message) {
                let player = this.players.find(p => p.id == message.playerId);
                this.messageLog.push(new ChatLog(new Date(), player.name, message.text));
                this.emitChange();
            }
            onPlayerReady(message) {
                console.log("ClientLobby.onPlayerReady");
                let player = this.players.find(p => p.id == message.playerId);
                player.isReady = true;
                this.emitChange();
            }
            onGameOver(message) {
                console.log("ClientLobby.onGameOver");
                for (let player of this.players) {
                    player.isReady = false;
                }
                this.messageHandlers.get(Play.ServiceType.Game).clear();
                this.state = LobbyState.GAME_OVER;
                this.emitChange();
            }
            onGameStart(message) {
                console.log("ClientLobby.onGameStart");
                this.game = new (ClassUtils.resolveClass(this.configuration.gameConfiguration.gameClass))(this);
                this.state = LobbyState.GAME_RUNNING;
                this.emitChange();
            }
            onJoin(message) {
                console.log("ClientLobby.onJoin", message);
                let player = new Client.PlayerInfo();
                player.gameData = {};
                player.id = message.playerId;
                player.name = message.name;
                player.team = message.team;
                this.players.push(player);
                if (message.isYou) {
                    this.configuration.gameConfiguration = message.configuration;
                    this.localPlayer = player;
                }
                this.emitChange();
            }
        }
        Client.ClientLobby = ClientLobby;
    })(Client = Play.Client || (Play.Client = {}));
})(Play || (Play = {}));
