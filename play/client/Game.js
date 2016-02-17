var Play;
(function (Play) {
    var Client;
    (function (Client) {
        "use strict";
        class Camera {
            constructor() {
                this.scaleX = 1;
                this.scaleY = 1;
                this.translateX = 0;
                this.translateY = 0;
                this.shakeDuration = 0;
            }
            unproject(x, y) {
                return { x: (x - this.translateX) / this.scaleX, y: (y - this.translateY) / this.scaleY };
            }
            update(delta) {
                if (this.shakeDuration > 0) {
                    this.shakeTimer += delta;
                    let x = Math.random() * 2 - 1;
                    let y = Math.random() * 2 - 1;
                    x *= this.shakeMagnitude;
                    y *= this.shakeMagnitude;
                    this.translateX += x;
                    this.translateY += y;
                    if (this.shakeTimer > this.shakeDuration) {
                        this.translateX = this.originalPositionX;
                        this.translateY = this.originalPositionY;
                        this.shakeDuration = 0;
                    }
                }
            }
            shake(magnitude, duration) {
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
        Client.Camera = Camera;
        class Mouse {
        }
        Mouse.button = 0;
        Mouse.x = 0;
        Mouse.y = 0;
        Client.Mouse = Mouse;
        class Game {
            constructor(lobby) {
                this.lobby = lobby;
            }
            initialize() {
                this.canvas = document.getElementById("game-canvas");
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
            tick(time) {
                let delta = time - this.lastFrame;
                if (this.lobby.state != Client.LobbyState.GAME_RUNNING && this.lobby.state != Client.LobbyState.GAME_OVER) {
                    return;
                }
                this.draw(delta);
                this.update(delta);
                this.lastFrame = time;
                window.requestAnimationFrame(this.tick);
            }
            draw(delta) {
            }
            update(delta) {
            }
            onMouseUp(e) {
            }
            onMouseDown(e) {
            }
            on(id, handler) {
                this.lobby.on(Play.ServiceType.Game, id, (message) => {
                    handler(message);
                });
            }
            send(msg) {
                msg.service = Play.ServiceType.Game;
                this.lobby.sendToServer(msg);
            }
        }
        Client.Game = Game;
    })(Client = Play.Client || (Play.Client = {}));
})(Play || (Play = {}));
//# sourceMappingURL=Game.js.map