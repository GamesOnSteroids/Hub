namespace Play.Client {

    "use strict";

    import GameConfiguration = Minesweeper.GameConfiguration;

    export class Mouse {
        public static button: number = 0;
        public static x: number = 0;
        public static y: number = 0;
    }


    export class Game {
        public changeListener = new EventDispatcher<this>();

        protected canvas: HTMLCanvasElement;
        protected context: CanvasRenderingContext2D;

        private lobby: ClientLobby;
        private lastFrame: number;

        get players(): PlayerInfo[] {
            return this.lobby.players;
        }

        get localPlayer(): PlayerInfo {
            return this.lobby.localPlayer;
        }

        get configuration(): GameConfiguration {
            return this.lobby.configuration.gameConfiguration;
        }

        protected emitChange(): void {
            this.changeListener.dispatch(this);
        }

        constructor(lobby: ClientLobby) {
            this.lobby = lobby;
        }

        public initialize(): void {
            this.canvas = <HTMLCanvasElement>document.getElementById("game-canvas");
            this.context = this.canvas.getContext("2d");
            this.canvas.onkeypress = this.onKeyPress.bind(this);
            this.canvas.onkeydown = this.onKeyDown.bind(this);
            this.canvas.tabIndex = 1000;
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

        protected draw(delta: number): void {
        }

        protected update(delta: number): void {
        }

        protected onMouseUp(e: MouseEvent): void {
        }

        protected onMouseDown(e: MouseEvent): void {
        }

        protected onKeyDown(e: KeyboardEvent): void {

        }

        protected onKeyPress(e: KeyboardEvent): void {

        }

        protected on<T extends GameMessage>(id: number, handler: (message: T) => void): void {
            this.lobby.on(ServiceType.Game, id, (message: Message) => {
                handler(message as T);
            });
        }

        protected send(msg: GameMessage): void {
            this.lobby.sendToServer(msg);
        }


        private tick(time: number): void {
            let delta = time - this.lastFrame;
            if (this.lobby.state != LobbyState.GAME_RUNNING && this.lobby.state != LobbyState.GAME_OVER) {
                return;
            }

            this.draw(delta);
            this.update(delta);

            this.lastFrame = time;
            window.requestAnimationFrame(this.tick);
        }
    }
}