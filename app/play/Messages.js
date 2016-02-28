var Play;
(function (Play) {
    "use strict";
    class LobbyConfiguration {
    }
    Play.LobbyConfiguration = LobbyConfiguration;
    (function (ServiceType) {
        ServiceType[ServiceType["Lobby"] = 1] = "Lobby";
        ServiceType[ServiceType["Game"] = 2] = "Game";
    })(Play.ServiceType || (Play.ServiceType = {}));
    var ServiceType = Play.ServiceType;
    (function (LobbyMessageId) {
        LobbyMessageId[LobbyMessageId["CMSG_JOIN_REQUEST"] = 1] = "CMSG_JOIN_REQUEST";
        LobbyMessageId[LobbyMessageId["SMSG_PLAYER_JOINED"] = 2] = "SMSG_PLAYER_JOINED";
        LobbyMessageId[LobbyMessageId["SMSG_GAME_START"] = 3] = "SMSG_GAME_START";
        LobbyMessageId[LobbyMessageId["SMSG_GAME_OVER"] = 4] = "SMSG_GAME_OVER";
        LobbyMessageId[LobbyMessageId["CMSG_READY"] = 5] = "CMSG_READY";
        LobbyMessageId[LobbyMessageId["SMSG_PLAYER_READY"] = 6] = "SMSG_PLAYER_READY";
        LobbyMessageId[LobbyMessageId["CMSG_CHAT"] = 7] = "CMSG_CHAT";
        LobbyMessageId[LobbyMessageId["SMSG_PLAYER_CHAT"] = 8] = "SMSG_PLAYER_CHAT";
    })(Play.LobbyMessageId || (Play.LobbyMessageId = {}));
    var LobbyMessageId = Play.LobbyMessageId;
    class Message {
        constructor(id, service) {
            this.id = id;
            this.service = service;
        }
    }
    Play.Message = Message;
    class GameMessage extends Message {
        constructor(id) {
            super(id, ServiceType.Game);
            this.id = id;
        }
    }
    Play.GameMessage = GameMessage;
    class LobbyMessage extends Message {
        constructor(id) {
            super(id, ServiceType.Lobby);
            this.id = id;
        }
    }
    Play.LobbyMessage = LobbyMessage;
    class ChatMessage extends LobbyMessage {
        constructor(text) {
            super(LobbyMessageId.CMSG_CHAT);
            this.text = text;
        }
    }
    Play.ChatMessage = ChatMessage;
    class PlayerChatMessage extends LobbyMessage {
        constructor(playerId, text) {
            super(LobbyMessageId.SMSG_PLAYER_CHAT);
            this.playerId = playerId;
            this.text = text;
        }
    }
    Play.PlayerChatMessage = PlayerChatMessage;
    class GameOverMessage extends LobbyMessage {
        constructor() {
            super(LobbyMessageId.SMSG_GAME_OVER);
        }
    }
    Play.GameOverMessage = GameOverMessage;
    class ReadyMessage extends LobbyMessage {
        constructor() {
            super(LobbyMessageId.CMSG_READY);
        }
    }
    Play.ReadyMessage = ReadyMessage;
    class PlayerReadyMessage extends LobbyMessage {
        constructor(playerId) {
            super(LobbyMessageId.SMSG_PLAYER_READY);
            this.playerId = playerId;
        }
    }
    Play.PlayerReadyMessage = PlayerReadyMessage;
    class JoinRequestMessage extends LobbyMessage {
        constructor(name, team) {
            super(LobbyMessageId.CMSG_JOIN_REQUEST);
            this.name = name;
            this.team = team;
        }
    }
    Play.JoinRequestMessage = JoinRequestMessage;
    class PlayerJoinedMessage extends LobbyMessage {
        constructor(playerId, name, team, configuration, isYou) {
            super(LobbyMessageId.SMSG_PLAYER_JOINED);
            this.playerId = playerId;
            this.name = name;
            this.team = team;
            this.configuration = configuration;
            this.isYou = isYou;
        }
    }
    Play.PlayerJoinedMessage = PlayerJoinedMessage;
    class GameStartMessage extends LobbyMessage {
        constructor() {
            super(LobbyMessageId.SMSG_GAME_START);
        }
    }
    Play.GameStartMessage = GameStartMessage;
})(Play || (Play = {}));
