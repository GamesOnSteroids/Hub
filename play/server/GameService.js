var Play;
(function (Play) {
    var Server;
    (function (Server) {
        "use strict";
        class GameService extends Server.Service {
            constructor(lobby) {
                super(lobby);
            }
            get players() {
                return this.lobby.clients;
            }
            start() { }
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
        Server.GameService = GameService;
    })(Server = Play.Server || (Play.Server = {}));
})(Play || (Play = {}));
//# sourceMappingURL=GameService.js.map