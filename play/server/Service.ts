module Play.Server {
    "use strict";

    export class Service {
        public lobby:ServerLobby;

        constructor(lobby:ServerLobby) {
            this.lobby = lobby;
        }
    }
}