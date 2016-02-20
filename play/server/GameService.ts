module Play.Server {
    "use strict";

    import GameMessage = Play.GameMessage;


    export abstract class GameService extends Service {

        private lastFrame: number;

        constructor(lobby:ServerLobby) {
            super(lobby);

            this.tick = this.tick.bind(this);
            this.lastFrame = performance.now();
        }

        tick(time:number) {
            let delta = time - this.lastFrame;
            this.update(delta);

            this.lastFrame = time;
            window.requestAnimationFrame(this.tick);
        }

        get players(): Client[] {
            return this.lobby.clients;
        }

        start(): void { }

        update(delta: number): void { }

        on<T extends GameMessage>(id:number, handler:(client:Client, msg:T) => void) {
            this.lobby.on(ServiceType.Game, id, <any>handler);
        }


        broadcast<T extends GameMessage>(msg:T): void {
            (<any>msg).service = ServiceType.Game;
            this.lobby.broadcast(<any>msg);
        }

        sendTo<T extends GameMessage>(client:Client, msg:T): void {
            (<any>msg).service = ServiceType.Game;
            client.connection.send(msg);
        }

    }
}