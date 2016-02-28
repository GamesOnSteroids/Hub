var Mahjong;
(function (Mahjong) {
    var Server;
    (function (Server) {
        "use strict";
        var GameService = Play.Server.GameService;
        class MahjongService extends GameService {
            constructor(lobby) {
                super(lobby);
            }
        }
        Server.MahjongService = MahjongService;
    })(Server = Mahjong.Server || (Mahjong.Server = {}));
})(Mahjong || (Mahjong = {}));
