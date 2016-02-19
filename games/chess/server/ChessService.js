var Chess;
(function (Chess) {
    var Server;
    (function (Server) {
        "use strict";
        var GameService = Play.Server.GameService;
        class ChessService extends GameService {
            constructor(lobby) {
                super(lobby);
            }
        }
        Server.ChessService = ChessService;
    })(Server = Chess.Server || (Chess.Server = {}));
})(Chess || (Chess = {}));
//# sourceMappingURL=ChessService.js.map