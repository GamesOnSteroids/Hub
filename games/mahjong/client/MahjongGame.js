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
var Mahjong;
(function (Mahjong) {
    var Client;
    (function (Client) {
        "use strict";
        var Camera = Play.Client.Camera;
        var Game = Play.Client.Game;
        var Mouse = Play.Client.Mouse;
        const TILE_SIZE = 30;
        var TileType;
        (function (TileType) {
            TileType[TileType["Suite"] = 0] = "Suite";
            TileType[TileType["Dragon"] = 1] = "Dragon";
            TileType[TileType["Wind"] = 2] = "Wind";
        })(TileType || (TileType = {}));
        var SuiteType;
        (function (SuiteType) {
            SuiteType[SuiteType["Pin"] = 0] = "Pin";
            SuiteType[SuiteType["Man"] = 1] = "Man";
            SuiteType[SuiteType["Sou"] = 2] = "Sou";
        })(SuiteType || (SuiteType = {}));
        class Tile {
        }
        var SetType;
        (function (SetType) {
            SetType[SetType["Chi"] = 0] = "Chi";
            SetType[SetType["Pon"] = 1] = "Pon";
            SetType[SetType["Kan"] = 2] = "Kan";
        })(SetType || (SetType = {}));
        class Set {
        }
        class Hand {
        }
        class MahjongGame extends Game {
            constructor(lobby) {
                super(lobby);
                this.isLoaded = false;
                this.load().then(() => {
                    this.isLoaded = true;
                    console.log("MahjongGame.loadComplete");
                }).catch((e) => {
                    console.log("e", e);
                });
            }
            initialize() {
                super.initialize();
                this.canvas.width = 672;
                this.canvas.height = 504;
                this.context.imageSmoothingEnabled = false;
                this.canvas.style.cursor = "pointer";
                this.camera = new Camera(this.canvas);
                this.camera.translateX = 0;
                this.camera.translateY = 0;
                this.emitChange();
            }
            onMouseDown(e) {
                if (Mouse.button == 2) {
                }
            }
            onMouseUp(e) {
                if (Mouse.button == 1 || Mouse.button == 3) {
                }
            }
            update(delta) {
                this.camera.update(delta);
            }
            draw(delta) {
                if (!this.isLoaded) {
                    return;
                }
                let ctx = this.context;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.fillStyle = "#2F6231";
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.setTransform(this.camera.scaleX, 0, 0, this.camera.scaleY, this.camera.translateX, this.camera.translateY);
                this.drawWall(ctx);
                let hand = new Hand();
                hand.tiles = [];
                for (let i = 0; i < 12; i++) {
                    let tile = new Tile();
                    hand.tiles.push(tile);
                }
                return;
                this.drawHand(ctx, hand);
                {
                    let x = 160;
                    let y = 20;
                    for (let i = 0; i < 12; i++) {
                        let image = this.assets.back;
                        ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
                        x += 23;
                    }
                }
                {
                    let y = 140;
                    for (let i = 0; i < 12; i++) {
                        let image = this.assets.side;
                        ctx.drawImage(image, 0, 0, image.width, image.height, 40, y, image.width, image.height);
                        y += 12;
                    }
                }
                {
                    let y = 140;
                    for (let i = 0; i < 12; i++) {
                        let image = this.assets.side;
                        ctx.drawImage(image, 0, 0, image.width, image.height, 540, y, image.width, image.height);
                        y += 12;
                    }
                }
            }
            drawWall(ctx) {
                let x = 138;
                let y = 123;
                let wallSize = 34;
                let tilesInAllWalls = 43;
                {
                    let tilesInWall = Math.min(tilesInAllWalls, wallSize);
                    for (let i = 0; i < tilesInWall; i++) {
                        let image = this.assets.backdown;
                        if (i % 2 == 0) {
                            ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
                        }
                        else {
                            ctx.drawImage(image, 0, 0, image.width, image.height, x, y - 12, image.width, image.height);
                            x += image.width;
                        }
                    }
                }
                if (tilesInAllWalls > wallSize * 1) {
                    x = 527;
                    y = 122;
                    let tilesInWall = Math.min(tilesInAllWalls - wallSize * 1, wallSize);
                    for (let i = 0; i < tilesInWall; i++) {
                        let image = this.assets.backside;
                        if (i % 2 == 0) {
                            ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
                        }
                        else {
                            ctx.drawImage(image, 0, 0, image.width, image.height, x, y - 12, image.width, image.height);
                            y += 12;
                        }
                    }
                }
            }
            drawHand(ctx, hand) {
                let x = 160;
                let y = 400;
                for (let tile of hand.tiles) {
                    this.drawTile(ctx, tile, x, y);
                    x += 23;
                }
            }
            drawTile(ctx, tile, x, y) {
                let image = this.assets.tiles[Mahjong.TileId.Pin2];
                ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
            }
            load() {
                return __awaiter(this, void 0, Promise, function* () {
                    this.assets = {};
                    let root = "games/mahjong/assets/";
                    this.assets.tiles = [];
                    this.assets.tiles[Mahjong.TileId.Pin1] = yield this.loadAsset(`${root}images/pin-1.png`);
                    this.assets.tiles[Mahjong.TileId.Pin2] = yield this.loadAsset(`${root}images/pin-2.png`);
                    this.assets.tiles[Mahjong.TileId.Pin3] = yield this.loadAsset(`${root}images/pin-3.png`);
                    this.assets.tiles[Mahjong.TileId.Pin4] = yield this.loadAsset(`${root}images/pin-4.png`);
                    this.assets.tiles[Mahjong.TileId.Pin5] = yield this.loadAsset(`${root}images/pin-5.png`);
                    this.assets.tiles[Mahjong.TileId.Pin6] = yield this.loadAsset(`${root}images/pin-6.png`);
                    this.assets.tiles[Mahjong.TileId.Pin7] = yield this.loadAsset(`${root}images/pin-7.png`);
                    this.assets.tiles[Mahjong.TileId.Pin8] = yield this.loadAsset(`${root}images/pin-8.png`);
                    this.assets.tiles[Mahjong.TileId.Pin9] = yield this.loadAsset(`${root}images/pin-9.png`);
                    this.assets.back = yield this.loadAsset(`${root}images/back.png`);
                    this.assets.backdown = yield this.loadAsset(`${root}images/back-down.png`);
                    this.assets.backside = yield this.loadAsset(`${root}images/back-side.png`);
                });
            }
        }
        Client.MahjongGame = MahjongGame;
    })(Client = Mahjong.Client || (Mahjong.Client = {}));
})(Mahjong || (Mahjong = {}));
//# sourceMappingURL=MahjongGame.js.map