module Play.Client {
    "use strict";

    export class Camera {
        public scaleX = 1;
        public scaleY = 1;
        public translateX = 0;
        public translateY = 0;

        private shakeMagnitude: number;
        private shakeDuration: number = 0;
        private shakeTimer: number;
        private originalPositionX: number;
        private originalPositionY: number;

        unproject(x:number, y:number):{x: number, y: number} {
            return {x: (x - this.translateX) / this.scaleX, y: (y - this.translateY) / this.scaleY};
        }

        update(delta: number) {

            if (this.shakeDuration > 0) {
                this.shakeTimer += delta;


                let x = Math.random() * 2 - 1;
                let y = Math.random() * 2 - 1;
                x *= this.shakeMagnitude ;
                y *= this.shakeMagnitude ;

                this.translateX += x;
                this.translateY += y;

                if (this.shakeTimer > this.shakeDuration) {
                    this.translateX = this.originalPositionX;
                    this.translateY = this.originalPositionY;
                    this.shakeDuration = 0;
                }

            }
        }

        shake(magnitude: number, duration: number) {
            if (this.shakeDuration != 0) {
                return;
            }

            this.shakeMagnitude = magnitude;
            this.shakeDuration = duration;
            this.shakeTimer = 0;
            this.originalPositionX = this.translateX;
            this.originalPositionY = this.translateY;
        }
    }

    export class Mouse {
        public static button:number = 0;
        public static x:number = 0;
        public static y:number = 0;
    }


    export class Game {
        protected lobby:ClientLobby;
        protected canvas:HTMLCanvasElement;
        protected context:CanvasRenderingContext2D;

        private lastFrame: number;

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

        draw(delta:number) {
        }

        update(delta:number) {
        }

        onMouseUp(e:MouseEvent) {
        }

        onMouseDown(e:MouseEvent) {
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