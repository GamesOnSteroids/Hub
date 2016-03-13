var Tetrominoes;
(function (Tetrominoes) {
    var Client;
    (function (Client) {
        "use strict";
        var Action = Play.Client.Action;
        var Camera = Play.Client.Camera;
        var Game = Play.Client.Game;
        const TILE_SIZE = 32;
        class TetrominoesGame extends Game {
            constructor(lobby) {
                super(lobby);
                this.load();
                this.playfield = new Tetrominoes.Playfield(this.variant.width, this.variant.height, this.variant.gravity);
                this.on(Tetrominoes.MessageId.SMSG_CREATE_TETROMINO, this.onCreateTetromino.bind(this));
                this.on(Tetrominoes.MessageId.SMSG_DESTROY_TETROMINO, this.onDestroyTetromino.bind(this));
                this.on(Tetrominoes.MessageId.SMSG_UPDATE_BOARD, this.onUpdateBoard.bind(this));
                this.on(Tetrominoes.MessageId.SMSG_MOVE, this.onMove.bind(this));
                this.on(Tetrominoes.MessageId.SMSG_SCORE, this.onScore.bind(this));
                this.on(Tetrominoes.MessageId.SMSG_LEVEL_UP, this.onLevelUp.bind(this));
                for (let player of this.players) {
                    player.gameData = {
                        lines: 0,
                        score: 0,
                    };
                }
            }
            initialize() {
                super.initialize();
                this.canvas.width = this.variant.width * TILE_SIZE;
                this.canvas.height = this.variant.height * TILE_SIZE;
                this.context.imageSmoothingEnabled = false;
                this.canvas.style.cursor = "pointer";
                this.camera = new Camera(this.canvas);
                this.camera.translateX = 0;
                this.camera.translateY = 0;
                this.emitChange();
            }
            onScore(message) {
                let player = this.players.find(p => p.id == message.playerId);
                player.gameData.score += message.score;
                this.emitChange();
            }
            onLevelUp(message) {
                this.playfield.level++;
                this.playfield.gravity = message.gravity;
                this.emitChange();
            }
            onMove(message) {
                let player = this.players.find(p => p.id == message.playerId);
                let tetromino = this.playfield.tetrominoes.find(t => t.owner.id == player.id);
                if (message.type == Tetrominoes.MoveType.Left) {
                    tetromino.x--;
                }
                else if (message.type == Tetrominoes.MoveType.Right) {
                    tetromino.x++;
                }
                else if (message.type == Tetrominoes.MoveType.RotateClockwise) {
                    tetromino.orientation = (tetromino.orientation + 1) % 4;
                }
                else if (message.type == Tetrominoes.MoveType.Drop) {
                    tetromino.gravity = Tetrominoes.DROP_GRAVITY;
                }
            }
            onAction(action) {
                if (action == Action.LEFT) {
                    this.send(new Tetrominoes.MoveRequestMessage(Tetrominoes.MoveType.Left));
                }
                else if (action == Action.RIGHT) {
                    this.send(new Tetrominoes.MoveRequestMessage(Tetrominoes.MoveType.Right));
                }
                else if (action == Action.DOWN) {
                    this.send(new Tetrominoes.MoveRequestMessage(Tetrominoes.MoveType.Drop));
                }
                else if (action == Action.CLICK || action == Action.UP) {
                    this.send(new Tetrominoes.MoveRequestMessage(Tetrominoes.MoveType.RotateClockwise));
                }
            }
            onUpdateBoard(message) {
                for (let i = 0; i < this.playfield.width * this.playfield.height; i++) {
                    let cell = this.playfield.board[i];
                    if (message.cells[i].playerId != null) {
                        cell.owner = this.players.find(p => p.id == message.cells[i].playerId);
                    }
                    cell.type = message.cells[i].type;
                }
            }
            onDestroyTetromino(message) {
                console.log("TetrominoesGame.onDestroyTetromino", message.playerId);
                let player = this.players.find(p => p.id == message.playerId);
                let index = this.playfield.tetrominoes.findIndex(t => t.owner.id == player.id);
                this.playfield.tetrominoes.splice(index, 1);
            }
            onCreateTetromino(message) {
                console.log("TetrominoesGame.onCreateTetromino", message.playerId);
                let player = this.players.find(p => p.id == message.playerId);
                this.playfield.tetrominoes.push(new Tetrominoes.Tetromino(message.type, player, message.x, 0, 0, this.playfield.gravity));
            }
            update(delta) {
                this.camera.update(delta);
                for (let tetromino of this.playfield.tetrominoes) {
                    tetromino.timer += tetromino.gravity * delta;
                    if (tetromino.timer > 1) {
                        tetromino.timer -= 1;
                        tetromino.y++;
                    }
                }
            }
            draw(delta) {
                let ctx = this.context;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.setTransform(this.camera.scaleX, 0, 0, this.camera.scaleY, this.camera.translateX, this.camera.translateY);
                ctx.globalAlpha = 0.5;
                for (let tetromino of this.playfield.tetrominoes) {
                    this.drawTetromino(ctx, tetromino);
                }
                ctx.globalAlpha = 1;
                for (let y = 0; y < this.playfield.height; y++) {
                    for (let x = 0; x < this.playfield.width; x++) {
                        let cell = this.playfield.board[x + y * this.playfield.width];
                        if (cell.type == Tetrominoes.CellType.Full) {
                            let image = this.assets.tiles[cell.owner.team];
                            ctx.drawImage(image, 0, 0, image.width, image.height, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                        }
                    }
                }
            }
            drawTetromino(ctx, tetromino) {
                let image = this.assets.tiles[tetromino.owner.team];
                let shape = tetromino.getShape();
                for (let y = 0; y < shape.length; y++) {
                    for (let x = 0; x < shape[y].length; x++) {
                        if (shape[y][x]) {
                            ctx.drawImage(image, 0, 0, image.width, image.height, (tetromino.x + x) * TILE_SIZE, (tetromino.y + y) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                        }
                    }
                }
            }
            load() {
                let root = "app/games/tetrominoes/assets/";
                this.assets = {};
                this.assets.tiles = [];
                for (let i = 0; i < 4; i++) {
                    this.assets.tiles[i] = new Image();
                    this.assets.tiles[i].src = `${root}images/${i}.png`;
                }
            }
        }
        Client.TetrominoesGame = TetrominoesGame;
    })(Client = Tetrominoes.Client || (Tetrominoes.Client = {}));
})(Tetrominoes || (Tetrominoes = {}));
