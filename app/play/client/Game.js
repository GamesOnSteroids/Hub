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
        class Touch {
        }
        Touch.touching = false;
        Touch.startX = 0;
        Touch.startY = 0;
        Touch.endX = 0;
        Touch.endY = 0;
        Client.Touch = Touch;
        (function (Action) {
            Action[Action["LEFT"] = 0] = "LEFT";
            Action[Action["UP"] = 1] = "UP";
            Action[Action["DOWN"] = 2] = "DOWN";
            Action[Action["RIGHT"] = 3] = "RIGHT";
            Action[Action["CLICK"] = 4] = "CLICK";
        })(Client.Action || (Client.Action = {}));
        var Action = Client.Action;
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
                    if (e && e.preventDefault) {
                        e.preventDefault();
                    }
                    if (e && e.stopPropagation) {
                        e.stopPropagation();
                    }
                    return false;
                };
                this.canvas.onselectstart = (e) => {
                    if (e && e.preventDefault) {
                        e.preventDefault();
                    }
                    if (e && e.stopPropagation) {
                        e.stopPropagation();
                    }
                    return false;
                };
                this.canvas.ondragstart = (e) => {
                    if (e && e.preventDefault) {
                        e.preventDefault();
                    }
                    if (e && e.stopPropagation) {
                        e.stopPropagation();
                    }
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
            onTouchMove(e) {
            }
            onTouchStart(e) {
                console.log("Game.onTouchStart", e);
                Touch.startX = e.changedTouches[0].pageX;
                Touch.startY = e.changedTouches[0].pageY;
                Touch.touching = true;
            }
            onTouchEnd(e) {
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
                        }
                        else {
                        }
                    }
                }
                else {
                    if (Math.abs(dirY) > treshold) {
                        if (dirY > 0) {
                        }
                        else {
                        }
                    }
                }
            }
            onMouseDown(e) {
                console.log("Game.onMouseDown", e);
                if (e.buttons == 1) {
                    let treshold = this.canvas.width / 4;
                    if (e.offsetX < treshold) {
                        this.onAction(Action.LEFT);
                    }
                    else if (e.offsetX > this.canvas.width - treshold) {
                        this.onAction(Action.RIGHT);
                    }
                    else {
                        this.onAction(Action.CLICK);
                    }
                }
            }
            onKeyDown(e) {
                if (e.keyCode == 37) {
                    this.onAction(Action.LEFT);
                }
                else if (e.keyCode == 39) {
                    this.onAction(Action.RIGHT);
                }
                else if (e.keyCode == 40) {
                    this.onAction(Action.DOWN);
                }
                else if (e.keyCode == 38) {
                    this.onAction(Action.UP);
                }
            }
            onKeyPress(e) {
            }
            onAction(action) {
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
