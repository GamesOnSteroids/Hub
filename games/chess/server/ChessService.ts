module Chess.Server {
    "use strict";

    import GameService = Play.Server.GameService;
    import ServerLobby = Play.Server.ServerLobby;

    export class ChessService extends GameService {
        constructor(lobby:ServerLobby) {
            super(lobby);
        }
    }
}