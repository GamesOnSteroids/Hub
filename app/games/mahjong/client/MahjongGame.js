var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
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
                this.table = new Mahjong.Table();
                this.table.currentTurn = Mahjong.Wind.EAST;
                {
                    this.hand = new Mahjong.Hand();
                    this.hand.wind = Mahjong.Wind.EAST;
                    this.hand.tiles = new Mahjong.Tiles([
                        Mahjong.Tile.MAN_1,
                        Mahjong.Tile.MAN_1,
                        Mahjong.Tile.MAN_2,
                        Mahjong.Tile.MAN_3,
                        Mahjong.Tile.MAN_3,
                        Mahjong.Tile.SOU_1,
                        Mahjong.Tile.SOU_2,
                        Mahjong.Tile.SOU_3,
                        Mahjong.Tile.EAST,
                        Mahjong.Tile.EAST,
                        Mahjong.Tile.EAST,
                        Mahjong.Tile.PIN_1,
                        Mahjong.Tile.PIN_1]);
                    this.table.hands.push(this.hand);
                }
                {
                    let hand = new Mahjong.Hand();
                    hand.wind = Mahjong.Wind.EAST;
                    hand.pond.push(Mahjong.TileId.MAN_3);
                    this.table.hands.push(hand);
                }
            }
            initialize() {
                super.initialize();
                this.canvas.width = 651;
                this.canvas.height = 458;
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
                this.drawWalls(ctx);
                for (let tile of this.table.hands[1].pond) {
                    this.drawTile(ctx, tile, 20, 20);
                }
                this.drawHand(ctx, this.hand);
            }
            drawWall(ctx) {
            }
            drawWalls(ctx) {
                let wallBreak = 7 * 2;
                let wallSize = 34;
                let tilesInAllWalls = 43;
                if (tilesInAllWalls > wallSize * 1) {
                    let x = 527;
                    let y = 122;
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
                {
                    let x = 526;
                    let y = 130;
                    let tilesInWall = Math.min(tilesInAllWalls, wallSize);
                    for (let i = 0; i < tilesInWall; i++) {
                        let image = this.assets.backdown;
                        if (i % 2 == 0) {
                            ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
                        }
                        else {
                            ctx.drawImage(image, 0, 0, image.width, image.height, x, y - 12, image.width, image.height);
                            x -= image.width;
                        }
                    }
                }
                if (tilesInAllWalls > wallSize * 1) {
                    let x = 527;
                    let y = 122;
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
                if (tilesInAllWalls > wallSize * 2) {
                    let x = 527;
                    let y = 122;
                    let tilesInWall = Math.min(tilesInAllWalls - wallSize * 2, wallSize);
                    for (let i = 0; i < tilesInWall; i++) {
                        let image = this.assets.backside;
                        if (i % 2 == 0) {
                            ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
                        }
                        else {
                            ctx.drawImage(image, 0, 0, image.width, image.height, x, y - 12, image.width, image.height);
                            y -= 12;
                        }
                    }
                }
            }
            drawHand(ctx, hand) {
                let moves = this.table.getAvailableMoves(Mahjong.TileId.MAN_3, this.hand);
                let x = 165;
                let y = 399;
                for (let tile of hand.tiles.tiles) {
                    let drawn = false;
                    for (let move of moves) {
                        if (move.type == Mahjong.MoveType.CHI) {
                            if (move.tiles[0] == tile.id) {
                                this.drawTile(ctx, tile.id, x, y - 20);
                                drawn = true;
                            }
                        }
                    }
                    if (!drawn) {
                        this.drawTile(ctx, tile.id, x, y);
                    }
                    x += 23;
                }
            }
            drawTile(ctx, tile, x, y) {
                let image = this.assets.tiles[tile];
                ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
            }
            load() {
                return __awaiter(this, void 0, Promise, function* () {
                    this.assets = {};
                    let root = "app/games/mahjong/assets/";
                    this.assets.tiles = [];
                    this.assets.tiles[Mahjong.TileId.PIN_1] = yield this.loadAsset(`${root}images/pin-1.png`);
                    this.assets.tiles[Mahjong.TileId.PIN_2] = yield this.loadAsset(`${root}images/pin-2.png`);
                    this.assets.tiles[Mahjong.TileId.PIN_3] = yield this.loadAsset(`${root}images/pin-3.png`);
                    this.assets.tiles[Mahjong.TileId.PIN_4] = yield this.loadAsset(`${root}images/pin-4.png`);
                    this.assets.tiles[Mahjong.TileId.PIN_5] = yield this.loadAsset(`${root}images/pin-5.png`);
                    this.assets.tiles[Mahjong.TileId.PIN_6] = yield this.loadAsset(`${root}images/pin-6.png`);
                    this.assets.tiles[Mahjong.TileId.PIN_7] = yield this.loadAsset(`${root}images/pin-7.png`);
                    this.assets.tiles[Mahjong.TileId.PIN_8] = yield this.loadAsset(`${root}images/pin-8.png`);
                    this.assets.tiles[Mahjong.TileId.PIN_9] = yield this.loadAsset(`${root}images/pin-9.png`);
                    this.assets.tiles[Mahjong.TileId.MAN_1] = yield this.loadAsset(`${root}images/man-1.png`);
                    this.assets.tiles[Mahjong.TileId.MAN_2] = yield this.loadAsset(`${root}images/man-2.png`);
                    this.assets.tiles[Mahjong.TileId.MAN_3] = yield this.loadAsset(`${root}images/man-3.png`);
                    this.assets.tiles[Mahjong.TileId.MAN_4] = yield this.loadAsset(`${root}images/man-4.png`);
                    this.assets.tiles[Mahjong.TileId.MAN_5] = yield this.loadAsset(`${root}images/man-5.png`);
                    this.assets.tiles[Mahjong.TileId.MAN_6] = yield this.loadAsset(`${root}images/man-6.png`);
                    this.assets.tiles[Mahjong.TileId.MAN_7] = yield this.loadAsset(`${root}images/man-7.png`);
                    this.assets.tiles[Mahjong.TileId.MAN_8] = yield this.loadAsset(`${root}images/man-8.png`);
                    this.assets.tiles[Mahjong.TileId.MAN_9] = yield this.loadAsset(`${root}images/man-9.png`);
                    this.assets.tiles[Mahjong.TileId.SOU_1] = yield this.loadAsset(`${root}images/sou-1.png`);
                    this.assets.tiles[Mahjong.TileId.SOU_2] = yield this.loadAsset(`${root}images/sou-2.png`);
                    this.assets.tiles[Mahjong.TileId.SOU_3] = yield this.loadAsset(`${root}images/sou-3.png`);
                    this.assets.tiles[Mahjong.TileId.SOU_4] = yield this.loadAsset(`${root}images/sou-4.png`);
                    this.assets.tiles[Mahjong.TileId.SOU_5] = yield this.loadAsset(`${root}images/sou-5.png`);
                    this.assets.tiles[Mahjong.TileId.SOU_6] = yield this.loadAsset(`${root}images/sou-6.png`);
                    this.assets.tiles[Mahjong.TileId.SOU_7] = yield this.loadAsset(`${root}images/sou-7.png`);
                    this.assets.tiles[Mahjong.TileId.SOU_8] = yield this.loadAsset(`${root}images/sou-8.png`);
                    this.assets.tiles[Mahjong.TileId.SOU_9] = yield this.loadAsset(`${root}images/sou-9.png`);
                    this.assets.tiles[Mahjong.TileId.EAST] = yield this.loadAsset(`${root}images/east.png`);
                    this.assets.tiles[Mahjong.TileId.SOUTH] = yield this.loadAsset(`${root}images/south.png`);
                    this.assets.tiles[Mahjong.TileId.WEST] = yield this.loadAsset(`${root}images/west.png`);
                    this.assets.tiles[Mahjong.TileId.NORTH] = yield this.loadAsset(`${root}images/north.png`);
                    this.assets.back = yield this.loadAsset(`${root}images/back.png`);
                    this.assets.backdown = yield this.loadAsset(`${root}images/back-down.png`);
                    this.assets.backside = yield this.loadAsset(`${root}images/back-side.png`);
                    this.assets.side = yield this.loadAsset(`${root}images/side.png`);
                });
            }
        }
        Client.MahjongGame = MahjongGame;
    })(Client = Mahjong.Client || (Mahjong.Client = {}));
})(Mahjong || (Mahjong = {}));
