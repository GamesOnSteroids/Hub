var Play;
(function (Play) {
    "use strict";
    class Camera {
        constructor() {
            this.scale = { x: 1, y: 1 };
            this.translate = { x: 20, y: 20 };
        }
        unproject(x, y) {
            return { x: (x - this.translate.x) / this.scale.x, y: (y - this.translate.y) / this.scale.y };
        }
    }
    Play.Camera = Camera;
    class Mouse {
    }
    Mouse.button = 0;
    Mouse.x = 0;
    Mouse.y = 0;
    Play.Mouse = Mouse;
    class Game {
        constructor(lobby) {
            this.lobby = lobby;
            this.canvas = document.getElementById("game-canvas");
            this.context = this.canvas.getContext("2d");
            this.canvas.onmousemove = (e) => {
                Mouse.x = e.offsetX;
                Mouse.y = e.offsetY;
            };
            this.canvas.onmouseup = (e) => {
                Mouse.x = e.offsetX;
                Mouse.y = e.offsetY;
                this.onMouseUp(e);
                if (e.button == 0)
                    Mouse.button &= ~1;
                if (e.button == 2)
                    Mouse.button &= ~2;
            };
            this.canvas.onmousedown = (e) => {
                Mouse.x = e.offsetX;
                Mouse.y = e.offsetY;
                if (e.button == 0)
                    Mouse.button |= 1;
                if (e.button == 2)
                    Mouse.button |= 2;
                this.onMouseDown(e);
            };
            this.canvas.oncontextmenu = (e) => {
                return false;
            };
            this.canvas.onselectstart = (e) => {
                return false;
            };
            this.tick = this.tick.bind(this);
            window.requestAnimationFrame(this.tick);
        }
        tick(time) {
            this.draw(time);
            this.update(time);
            window.requestAnimationFrame(this.tick);
        }
        draw(time) {
        }
        update(time) {
        }
        onMouseUp(e) {
        }
        onMouseDown(e) {
        }
        on(id, handler) {
            this.lobby.on(Play.ServiceType.Game, id, (client, message) => {
                handler(message);
            });
        }
        send(msg) {
            msg.service = Play.ServiceType.Game;
            this.lobby.sendToServer(msg);
        }
    }
    Play.Game = Game;
})(Play || (Play = {}));
//# sourceMappingURL=game.js.map