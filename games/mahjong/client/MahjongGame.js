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
                this.load();
            }
            initialize() {
                super.initialize();
                this.canvas.width = 800;
                this.canvas.height = 800;
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
                let ctx = this.context;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.setTransform(this.camera.scaleX, 0, 0, this.camera.scaleY, this.camera.translateX, this.camera.translateY);
                this.drawWall(ctx);
                let hand = new Hand();
                hand.tiles = [];
                for (let i = 0; i < 12; i++) {
                    let tile = new Tile();
                    hand.tiles.push(tile);
                }
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
                        let image = this.assets.right;
                        ctx.drawImage(image, 0, 0, image.width, image.height, 40, y, image.width, image.height);
                        y += 12;
                    }
                }
                {
                    let y = 140;
                    for (let i = 0; i < 12; i++) {
                        let image = this.assets.left;
                        ctx.drawImage(image, 0, 0, image.width, image.height, 540, y, image.width, image.height);
                        y += 12;
                    }
                }
            }
            drawWall(ctx) {
                let x = 120;
                let y = 80;
                for (let i = 0; i < 17; i++) {
                    let image = this.assets.backlying;
                    ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
                    ctx.drawImage(image, 0, 0, image.width, image.height, x, y - 12, image.width, image.height);
                    x += 23;
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
                let image = this.assets.pin1;
                ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
            }
            load() {
                this.assets = {};
                let root = "games/mahjong/assets/";
                this.assets.pin1 = new Image();
                this.assets.pin1.src = root + "images/1-1.png";
                this.assets.back = new Image();
                this.assets.back.src = root + "images/back.png";
                this.assets.left = new Image();
                this.assets.left.src = root + "images/left.png";
                this.assets.right = new Image();
                this.assets.right.src = root + "images/right.png";
                this.assets.backlying = new Image();
                this.assets.backlying.src = root + "images/back-lying.png";
            }
        }
        Client.MahjongGame = MahjongGame;
    })(Client = Mahjong.Client || (Mahjong.Client = {}));
})(Mahjong || (Mahjong = {}));
//# sourceMappingURL=MahjongGame.js.map