namespace Play.Client {

    "use strict";

    export class Mouse {
        public static button: number = 0;
        public static x: number = 0;
        public static y: number = 0;
    }

    export class Touch {
        public static touching: boolean = false;
        public static startX: number = 0;
        public static startY: number = 0;
        public static endX: number = 0;
        public static endY: number = 0;
    }

    export enum Action {
        LEFT,
        UP,
        DOWN,
        RIGHT,
        CLICK
    }

    export class Game<TVariant extends IGameVariant, TPlayerData>{
        public changeListener = new EventDispatcher<this>();

        protected canvas: HTMLCanvasElement;
        protected context: CanvasRenderingContext2D;

        private lobby: ClientLobby;
        private lastFrame: number;

        get players(): PlayerInfo<TPlayerData>[] {
            return this.lobby.players;
        }

        get localPlayer(): PlayerInfo<TPlayerData> {
            return this.lobby.localPlayer;
        }

        get variant(): TVariant {
            return <TVariant>this.lobby.configuration.variant;
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

            this.canvas.tabIndex = 1000;
            this.canvas.focus();

            this.canvas.ontouchstart = this.onTouchStart;
            this.canvas.ontouchend = this.onTouchEnd;
            this.canvas.ontouchmove = (e) => {
                this.onTouchMove(e);
                e.preventDefault();
            };
            this.canvas.onkeypress = (e) => {
                this.onKeyPress(e);
                e.preventDefault();
            };
            this.canvas.onkeydown = (e) => {
                this.onKeyDown(e);
                e.preventDefault();
            };

            this.canvas.onclick = (e) => {
                e.preventDefault();
                return false;
            };
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
                if (e && e.preventDefault) { e.preventDefault(); }
                if (e && e.stopPropagation) { e.stopPropagation(); }
                return false;
            };
            this.canvas.onselectstart = (e) => {
                if (e && e.preventDefault) { e.preventDefault(); }
                if (e && e.stopPropagation) { e.stopPropagation(); }
                return false;
            };
            this.canvas.ondragstart  = (e) => {
                if (e && e.preventDefault) { e.preventDefault(); }
                if (e && e.stopPropagation) { e.stopPropagation(); }
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

        protected onTouchMove(e: TouchEvent): void {
            console.log("Game.onTouchMove");
        }
        protected onTouchStart(e: TouchEvent): void {
            console.log("Game.onTouchStart", e);
            Touch.startX = e.changedTouches[0].pageX;
            Touch.startY = e.changedTouches[0].pageY;
            Touch.touching = true;
        }

        protected onTouchEnd(e: TouchEvent): void {
            console.log("Game.onTouchEnd", e);
            Touch.touching = false;
            Touch.endX = e.changedTouches[0].pageX;
            Touch.endY = e.changedTouches[0].pageY;

            let dirX = Touch.endX - Touch.startX;
            let dirY = Touch.endY - Touch.startY;

            let treshold = 20;

            if (Math.abs(dirX) > Math.abs(dirY)) {
                if (Math.abs(dirX) > treshold) {
                    if (dirX > 0) {
                        // swipe right
                    } else {

                    }
                }
            } else {
                if (Math.abs(dirY) > treshold) {
                    if (dirY > 0) {

                    } else {

                    }
                }
            }
        }

        protected onMouseDown(e: MouseEvent): void {
            console.log("Game.onMouseDown", e);
            if (e.buttons == 1) {
                let treshold = this.canvas.width / 4;
                if (e.offsetX < treshold) {
                    this.onAction(Action.LEFT);
                } else if (e.offsetX > this.canvas.width - treshold) {
                    this.onAction(Action.RIGHT);
                } else {
                    this.onAction(Action.CLICK);
                }
            }

        }

        protected onKeyDown(e: KeyboardEvent): void {
            if (e.keyCode == 37) { // left
                this.onAction(Action.LEFT);
            } else if (e.keyCode == 39) { // right
                this.onAction(Action.RIGHT);
            } else if (e.keyCode == 40) { // down
                this.onAction(Action.DOWN);
            } else if (e.keyCode == 38) { // up
                this.onAction(Action.UP);
            }
        }

        protected onKeyPress(e: KeyboardEvent): void {

        }

        protected onAction(action: Action): void {

        }

        protected on<T extends GameMessage>(id: number, handler: (message: T) => void): void {
            this.lobby.on(ServiceType.Game, id, (message: Message) => {
                handler(message as T);
            });
        }

        protected send(msg: GameMessage): void {
            this.lobby.sendToServer(msg);
        }


        protected playSound(sound: HTMLAudioElement): void {
            sound.currentTime = 0;
            sound.play();
        }

        protected loadAsset(assetName: string): Promise<any> {

            return new Promise<any>((resolve, reject) => {
                if (assetName.endsWith(".png")) {
                    let asset = new Image();
                    asset.onload = () => {
                        resolve(asset);
                    };
                    asset.onerror = (ev: Event) => {
                        reject(ev);
                    };
                    asset.src = assetName;
                } else {
                    throw "Unsupported type";
                }
            });
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