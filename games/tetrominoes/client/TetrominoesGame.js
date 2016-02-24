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
var Tetrominoes;
(function (Tetrominoes) {
    var Client;
    (function (Client) {
        "use strict";
        var Camera = Play.Client.Camera;
        var Game = Play.Client.Game;
        const TILE_SIZE = 32;
        const WIDTH = 10;
        const HEIGHT = 22;
        class Tetromino {
            constructor(type, owner, x, y, orientation) {
                this.type = type;
                this.owner = owner;
                this.x = x;
                this.y = y;
                this.orientation = orientation;
            }
        }
        var TetrominoType;
        (function (TetrominoType) {
            TetrominoType[TetrominoType["Z"] = 0] = "Z";
            TetrominoType[TetrominoType["L"] = 1] = "L";
            TetrominoType[TetrominoType["O"] = 2] = "O";
            TetrominoType[TetrominoType["S"] = 3] = "S";
            TetrominoType[TetrominoType["I"] = 4] = "I";
            TetrominoType[TetrominoType["J"] = 5] = "J";
            TetrominoType[TetrominoType["T"] = 6] = "T";
        })(TetrominoType || (TetrominoType = {}));
        class TetrominoesGame extends Game {
            constructor(lobby) {
                super(lobby);
                this.shapes = new Map([
                    [
                        TetrominoType.L,
                        [
                            [false, true, false],
                            [false, true, false],
                            [false, true, true],
                        ]
                    ],
                    [
                        TetrominoType.T,
                        [
                            [false, false, false],
                            [false, true, false],
                            [true, true, true],
                        ]
                    ]
                ]);
                this.board = new Array();
                this.load();
            }
            initialize() {
                super.initialize();
                this.canvas.width = WIDTH * TILE_SIZE;
                this.canvas.height = HEIGHT * TILE_SIZE;
                this.context.imageSmoothingEnabled = false;
                this.canvas.style.cursor = "pointer";
                this.camera = new Camera(this.canvas);
                this.camera.translateX = 0;
                this.camera.translateY = 0;
                this.emitChange();
            }
            update(delta) {
                this.camera.update(delta);
            }
            draw(delta) {
                let ctx = this.context;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.setTransform(this.camera.scaleX, 0, 0, this.camera.scaleY, this.camera.translateX, this.camera.translateY);
                {
                    let tetromino = new Tetromino(TetrominoType.L, this.localPlayer, 2, 2, Direction4.Up);
                    this.drawTetromino(ctx, tetromino);
                }
                {
                    let tetromino = new Tetromino(TetrominoType.T, this.localPlayer, 6, 6, Direction4.Right);
                    this.drawTetromino(ctx, tetromino);
                }
            }
            drawTetromino(ctx, tetromino) {
                let image = this.assets.tiles[0];
                let shape = this.shapes.get(tetromino.type);
                for (let y = 0; y < shape.length; y++) {
                    for (let x = 0; x < shape[y].length; x++) {
                        if (shape[y][x]) {
                            ctx.drawImage(image, 0, 0, image.width, image.height, (tetromino.x + x) * TILE_SIZE, (tetromino.y + y) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                        }
                    }
                }
            }
            load() {
                let root = "games/tetrominoes/assets/";
                this.assets = {};
                this.assets.tiles = [];
                for (let i = 0; i < 4; i++) {
                    this.assets.tiles[0] = new Image();
                    this.assets.tiles[0].src = `${root}images/${i}.png`;
                }
            }
        }
        Client.TetrominoesGame = TetrominoesGame;
    })(Client = Tetrominoes.Client || (Tetrominoes.Client = {}));
})(Tetrominoes || (Tetrominoes = {}));
//# sourceMappingURL=TetrominoesGame.js.map