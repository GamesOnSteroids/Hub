namespace Play.Server {
    "use strict";

    import GameMessage = Play.GameMessage;


    export abstract class GameService extends Service {

        private lastFrame: number;

        constructor(lobby: ServerLobby) {
            super(lobby);

            this.tick = this.tick.bind(this);
            this.lastFrame = performance.now();
        }

        /**
         * Called when game starts
         */
        public start(): void {
            // nothing to do
        }

        protected get players(): PlayerInfo[] {
            return this.lobby.clients;
        }

        protected get configuration(): any {
            return this.lobby.configuration.gameConfiguration;
        }

        /**
         * Attach handler to specific message from clients
         * @param id Id of the message
         * @param handler Callback to call when message arrives
         */
        protected on<T extends GameMessage>(id: number, handler: (client: Client, msg: T) => void): void {
            this.lobby.on(ServiceType.Game, id, <any>handler);
        }

        /**
         * Called every 1/60th of a second
         * @param delta time between last and current call
         */
        protected update(delta: number): void {
            // nothing to do
        }

        // todo: this should be private
        protected tick(time: number): void {
            let delta = time - this.lastFrame;
            this.update(delta);

            this.lastFrame = time;
            if (this.lobby.state == LobbyState.GAME_RUNNING) {
                window.requestAnimationFrame(this.tick);
            }
        }

    }
}