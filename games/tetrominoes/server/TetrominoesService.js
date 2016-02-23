var Tetrominoes;
(function (Tetrominoes) {
    var Server;
    (function (Server) {
        "use strict";
        var GameService = Play.Server.GameService;
        class TetrominoesService extends GameService {
            constructor(lobby) {
                super(lobby);
            }
        }
        Server.TetrominoesService = TetrominoesService;
    })(Server = Tetrominoes.Server || (Tetrominoes.Server = {}));
})(Tetrominoes || (Tetrominoes = {}));
//# sourceMappingURL=TetrominoesService.js.map