var Mahjong;
(function (Mahjong) {
    var Server;
    (function (Server) {
        "use strict";
        var GameService = Play.Server.GameService;
        class MahjongService extends GameService {
            constructor(lobby) {
                super(lobby);
                let configuration = this.lobby.configuration.gameConfiguration;
            }
        }
        Server.MahjongService = MahjongService;
    })(Server = Mahjong.Server || (Mahjong.Server = {}));
})(Mahjong || (Mahjong = {}));
//# sourceMappingURL=MahjongService.js.map