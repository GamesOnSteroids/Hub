var Play;
(function (Play) {
    "use strict";
    class GameService extends Play.Service {
        constructor(lobby) {
            super(lobby);
        }
        on(id, handler) {
            this.lobby.on(Play.ServiceType.Game, id, handler);
        }
        broadcast(msg) {
            msg.service = Play.ServiceType.Game;
            this.lobby.broadcast(msg);
        }
        sendTo(client, msg) {
            msg.service = Play.ServiceType.Game;
            client.connection.send(msg);
        }
    }
    Play.GameService = GameService;
})(Play || (Play = {}));
//# sourceMappingURL=gameservice.js.map