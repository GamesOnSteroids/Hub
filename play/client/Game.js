var Play;
(function (Play) {
    var Client;
    (function (Client) {
        "use strict";
        class Mouse {
        }
        Mouse.button = 0;
        Mouse.x = 0;
        Mouse.y = 0;
        Client.Mouse = Mouse;
        class Game {
            constructor(lobby) {
                this.changeListener = new Client.EventDispatcher();
                this.lobby = lobby;
            }
            get players() {
                return this.lobby.players;
            }
            get localPlayer() {
                return this.lobby.localPlayer;
            }
            get configuration() {
                return this.lobby.configuration.gameConfiguration;
            }
            emitChange() {
                this.changeListener.dispatch(this);
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