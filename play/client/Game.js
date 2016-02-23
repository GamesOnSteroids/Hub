var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
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
            draw(delta) {
            }
            update(delta) {
            }
            onMouseUp(e) {
            }
            onMouseDown(e) {
            }
            onKeyDown(e) {
            }
            onKeyPress(e) {
            }
            on(id, handler) {
                this.lobby.on(Play.ServiceType.Game, id, (message) => {
                    handler(message);
                });
            }
            send(msg) {
                this.lobby.sendToServer(msg);
            }
            loadAsset(assetName) {
                return new Promise((resolve, reject) => {
                    if (assetName.endsWith(".png")) {
                        let asset = new Image();
                        asset.onload = () => {
                            resolve(asset);
                        };
                        asset.onerror = (ev) => {
                            reject(ev);
                        };
                        asset.src = assetName;
                    }
                    else {
                        throw "Unsupported type";
                    }
                });
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
        }
        Client.Game = Game;
    })(Client = Play.Client || (Play.Client = {}));
})(Play || (Play = {}));
//# sourceMappingURL=Game.js.map