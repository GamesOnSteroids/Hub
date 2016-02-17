var Play;
(function (Play) {
    "use strict";
    "use strict";
    (function (ServiceType) {
        ServiceType[ServiceType["Lobby"] = 1] = "Lobby";
        ServiceType[ServiceType["Game"] = 2] = "Game";
        ServiceType[ServiceType["Chat"] = 3] = "Chat";
    })(Play.ServiceType || (Play.ServiceType = {}));
    var ServiceType = Play.ServiceType;
    (function (LobbyMessageId) {
        LobbyMessageId[LobbyMessageId["CMSG_JOIN_REQUEST"] = 1] = "CMSG_JOIN_REQUEST";
        LobbyMessageId[LobbyMessageId["SMSG_PLAYER_JOINED"] = 2] = "SMSG_PLAYER_JOINED";
        LobbyMessageId[LobbyMessageId["SMSG_GAME_START"] = 3] = "SMSG_GAME_START";
        LobbyMessageId[LobbyMessageId["SMSG_GAME_OVER"] = 4] = "SMSG_GAME_OVER";
        LobbyMessageId[LobbyMessageId["CMSG_READY"] = 5] = "CMSG_READY";
        LobbyMessageId[LobbyMessageId["SMSG_PLAYER_READY"] = 6] = "SMSG_PLAYER_READY";
    })(Play.LobbyMessageId || (Play.LobbyMessageId = {}));
    var LobbyMessageId = Play.LobbyMessageId;
})(Play || (Play = {}));
//# sourceMappingURL=shared.js.map