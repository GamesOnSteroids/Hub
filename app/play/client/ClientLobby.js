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
            constructor(configuration) {
                this.players = [];
                this.messageLog = [];
                this.state = LobbyState.IN_LOBBY;
                this.changeListener = new Client.EventDispatcher();
                this.messageHandlers = new Map([
                    [Play.ServiceType.Lobby, new Map()],
                    [Play.ServiceType.Game, new Map()]
                ]);
                this.configuration = configuration;
                this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.SMSG_GAME_START, this.onGameStart.bind(this));
                this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.SMSG_PLAYER_JOINED, this.onJoin.bind(this));
                this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.SMSG_PLAYER_LEFT, this.onLeft.bind(this));
                this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.SMSG_GAME_OVER, this.onGameOver.bind(this));
                this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.SMSG_PLAYER_READY, this.onPlayerReady.bind(this));
                this.on(Play.ServiceType.Lobby, Play.LobbyMessageId.SMSG_PLAYER_CHAT, this.onPlayerChat.bind(this));
            }
            getPlayerColor(player) {
                if (this.configuration.variant.teamCount == null) {
                    return player.position;
                }
                else {
                    if (player.id == this.localPlayer.id) {
                        return 0;
                    }
                    else if (player.team == this.localPlayer.team) {
                        return 1;
                    }
                    else {
                        return 2;
                    }
                }
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
            leave() {
                console.log("ClientLobby.leave");
                this.serverConnection.disconnect();
            }
            join() {
                this.sendToServer({
                    service: Play.ServiceType.Lobby,
                    id: Play.LobbyMessageId.CMSG_JOIN_REQUEST,
                    name: authentization.displayName
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
                this.messageLog.push(new ChatLog(new Date(), message.name, message.text));
                this.emitChange();
            }
            onPlayerReady(message) {
                console.log("ClientLobby.onPlayerReady");
                let player = this.players.find(p => p.id == message.playerId);
                player.isReady = true;
                this.emitChange();
            }
            onServerDisconnect() {
                this.players.splice(0, this.players.length);
                this.players.push(this.localPlayer);
                this.messageHandlers.get(Play.ServiceType.Game).clear();
                this.state = LobbyState.GAME_OVER;
                this.messageLog.push(new ChatLog(new Date(), "System", "Server has disconnected."));
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
            onLeft(message) {
                console.log("ClientLobby.onLeft", message);
                let player = this.players.find(p => p.id == message.playerId);
                this.players.splice(this.players.indexOf(player), 1);
                this.messageLog.push(new ChatLog(new Date(), "System", `${player.name} has left.`));
                this.emitChange();
            }
            onJoin(message) {
                console.log("ClientLobby.onJoin", message);
                let player = new Client.PlayerInfo();
                player.gameData = {};
                player.id = message.playerId;
                player.name = message.name;
                player.team = message.team;
                player.position = message.position;
                this.players.push(player);
                if (message.isYou) {
                    this.configuration.gameConfiguration = message.configuration;
                    this.localPlayer = player;
                }
                else {
                    this.messageLog.push(new ChatLog(new Date(), "System", `${player.name} has joined.`));
                }
                this.emitChange();
            }
        }
        Client.ClientLobby = ClientLobby;
    })(Client = Play.Client || (Play.Client = {}));
})(Play || (Play = {}));
