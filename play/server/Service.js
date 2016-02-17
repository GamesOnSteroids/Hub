var Play;
(function (Play) {
    var Server;
    (function (Server) {
        "use strict";
        class Service {
            constructor(lobby) {
                this.lobby = lobby;
            }
        }
        Server.Service = Service;
    })(Server = Play.Server || (Play.Server = {}));
})(Play || (Play = {}));
//# sourceMappingURL=Service.js.map