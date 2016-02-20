module Play.Client {
    "use strict";


    export class Mouse {
        public static button:number = 0;
        public static x:number = 0;
        public static y:number = 0;
    }


    export class Game {
        private lobby:ClientLobby;
        protected canvas:HTMLCanvasElement;
        protected context:CanvasRenderingContext2D;
        public changeListener = new EventDispatcher<this>();
        private lastFrame: number;

        get players() {
            return this.lobby.players;
        }

        get localPlayer() {
            return this.lobby.localPlayer;
        }

        get configuration() {
            return this.lobby.configuration.gameConfiguration;
        }

        emitChange(): void {
            this.changeListener.dispatch(this);
        }

        constructor(lobby:ClientLobby) {
            this.lobby = lobby;
        }

        initialize() {
            this.canvas = <HTMLCanvasElement>document.getElementById("game-canvas");
            this.context = this.canvas.getContext("2d");
            this.canvas.onmousemove = (e) => {
                Mouse.x = e.offsetX;
                Mouse.y = e.offsetY;
                Mouse.button = e.buttons;
            };
            this.canvas.onmouseup = (e) => {
                Mouse.x = e.offsetX;
                Mouse.y = e.offsetY;
                this.onMouseUp(e);
                Mouse.button = e.buttons;
            };
            this.canvas.onmousedown = (e) => {
                Mouse.x = e.offsetX;
                Mouse.y = e.offsetY;
                Mouse.button = e.buttons;
                this.onMouseDown(e);
            };
            this.canvas.oncontextmenu = (e) => {
                return false;
            };
            this.canvas.onselectstart = (e) => {
                return false;
            };

            this.tick = this.tick.bind(this);
            this.lastFrame = performance.now();
            window.requestAnimationFrame(this.tick);
        }

        tick(time:number) {
            let delta = time - this.lastFrame;
            if (this.lobby.state != LobbyState.GAME_RUNNING && this.lobby.state != LobbyState.GAME_OVER) {
                return;
            }

            this.draw(delta);
            this.update(delta);

            this.lastFrame = time;
            window.requestAnimationFrame(this.tick);
        }

        draw(delta:number): void {
        }

        update(delta:number): void {
        }

        onMouseUp(e:MouseEvent): void {
        }

        onMouseDown(e:MouseEvent): void {
        }

        on<T extends GameMessage>(id:number, handler:(message:T) => void):void {
            this.lobby.on(ServiceType.Game, id, (message:IMessage) => {
                handler(<any>message);
            });
        }

        send<T extends GameMessage>(msg:T):void {
            (<any>msg).service = ServiceType.Game;
            this.lobby.sendToServer((<any>msg));
        }
    }
}