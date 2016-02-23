namespace Mahjong.Server {
    "use strict";

    // import Client = Play.Server.Client;
    import GameService = Play.Server.GameService;
    import ServerLobby = Play.Server.ServerLobby;
    // import IPlayerInfo = Play.IPlayerInfo;

    export class MahjongService extends GameService {


        constructor(lobby: ServerLobby) {
            super(lobby);

            // this.on(MessageId.CMSG_REVEAL_REQUEST, this.onRevealRequest.bind(this));

            // let configuration = this.lobby.configuration.gameConfiguration;

        }

    }
}