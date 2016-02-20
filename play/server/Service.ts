module Play.Server {
    "use strict";

    export class Service {
        protected lobby:ServerLobby;

        constructor(lobby:ServerLobby) {
            this.lobby = lobby;
        }
    }
}