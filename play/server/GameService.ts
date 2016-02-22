module Play.Server {
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

        protected get players(): Client[] {
            return this.lobby.clients;
        }

        /**
         * Attach handler to specific message from clients
         * @param id Id of the message
         * @param handler Callback to call when message arrives
         */
        protected on<T extends GameMessage>(id: number, handler: (client: Client, msg: T) => void): void {
            this.lobby.on(ServiceType.Game, id, <any>handler);
        }



        protected broadcast<T extends GameMessage>(msg: T): void {
            this.lobby.broadcast(<any>msg);
        }

        /**
         * Sends message only to specific client
         * @param client Client that will receive message
         * @param msg Message to send
         */
        protected sendTo<T extends GameMessage>(client: Client, msg: T): void {
            client.connection.send(msg);
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
            window.requestAnimationFrame(this.tick);
        }

    }
}