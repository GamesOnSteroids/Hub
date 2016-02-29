var Tetrominoes;
(function (Tetrominoes) {
    var Server;
    (function (Server) {
        "use strict";
        var GameService = Play.Server.GameService;
        class TetrominoesService extends GameService {
            constructor(lobby) {
                super(lobby);
                this.on(Tetrominoes.MessageId.CMSG_MOVE_REQUEST, this.onMoveRequest.bind(this));
                this.playfield = new Tetrominoes.Playfield(this.configuration.width, this.configuration.height, this.configuration.gravity);
                for (let player of this.players) {
                    player.gameData = {
                        lines: 0
                    };
                }
            }
            start() {
                window.requestAnimationFrame(this.tick);
            }
            onMoveRequest(player, message) {
                console.log("TetrominoesService.onMoveRequest", player.id, message.type);
                let tetromino = this.playfield.tetrominoes.find(t => t.owner.id == player.id);
                if (tetromino == null) {
                    return;
                }
                let moveType = message.type;
                if (moveType == Tetrominoes.MoveType.Left) {
                    if (!this.playfield.collides(tetromino.x - 1, tetromino.y, tetromino.orientation, tetromino.type)) {
                        tetromino.x--;
                        this.lobby.broadcast(new Tetrominoes.MoveMessage(player.id, moveType));
                    }
                }
                else if (moveType == Tetrominoes.MoveType.Right) {
                    if (!this.playfield.collides(tetromino.x + 1, tetromino.y, tetromino.orientation, tetromino.type)) {
                        tetromino.x++;
                        this.lobby.broadcast(new Tetrominoes.MoveMessage(player.id, moveType));
                    }
                }
                else if (moveType == Tetrominoes.MoveType.RotateClockwise) {
                    if (!this.playfield.collides(tetromino.x, tetromino.y, (tetromino.orientation + 1) % 4, tetromino.type)) {
                        tetromino.orientation = (tetromino.orientation + 1) % 4;
                        this.lobby.broadcast(new Tetrominoes.MoveMessage(player.id, moveType));
                    }
                }
                else if (moveType == Tetrominoes.MoveType.Drop) {
                    tetromino.gravity = Tetrominoes.DROP_GRAVITY;
                    this.lobby.broadcast(new Tetrominoes.MoveMessage(player.id, moveType));
                }
            }
            generateTetromino(player) {
                let type = Math.floor(Math.random() * 7);
                let x = 0;
                if (this.players.length > 1) {
                    x = this.players.indexOf(player) * Math.round(this.playfield.width / (this.players.length - 1));
                    x = Math.max(0, Math.min(x, x - Tetrominoes.Tetromino.SHAPES.get(type)[0][0].length));
                }
                let tetromino = new Tetrominoes.Tetromino(type, player, x, 0, 0, this.playfield.gravity);
                return tetromino;
            }
            updateBoard() {
                let board = this.playfield.board;
                let cells = [];
                for (let cell of board) {
                    if (cell.owner != null) {
                        cells.push({ playerId: cell.owner.id, type: cell.type });
                    }
                    else {
                        cells.push({ type: cell.type });
                    }
                }
                this.lobby.broadcast(new Tetrominoes.UpdateBoardMessage(cells));
            }
            update(delta) {
                for (let player of this.players) {
                    let tetromino = this.playfield.tetrominoes.find(t => t.owner.id == player.id);
                    if (tetromino == null) {
                        let tetromino = this.generateTetromino(player);
                        this.playfield.tetrominoes.push(tetromino);
                        console.log("TetrominoesService.createTetromino", tetromino.owner.id);
                        this.lobby.broadcast(new Tetrominoes.CreateTetrominoMessage(tetromino.owner.id, tetromino.type, tetromino.x));
                    }
                }
                let boardUpdated = false;
                let collidingPlayers = [];
                let i = this.playfield.tetrominoes.length;
                while (i-- != 0) {
                    let tetromino = this.playfield.tetrominoes[i];
                    tetromino.timer += tetromino.gravity * delta;
                    while (tetromino.timer > 1) {
                        tetromino.timer -= 1;
                        let collision = this.playfield.collides(tetromino.x, tetromino.y + 1, tetromino.orientation, tetromino.type);
                        if (collision) {
                            let player = tetromino.owner;
                            collidingPlayers.push(player);
                            this.playfield.tetrominoes.splice(i, 1);
                            console.log("TetrominoesService.destroyTetromino", player.id);
                            this.lobby.broadcast(new Tetrominoes.DestroyTetrominoMessage(player.id));
                            let shape = tetromino.getShape();
                            for (let y = 0; y < shape.length; y++) {
                                for (let x = 0; x < shape[y].length; x++) {
                                    if (shape[y][x]) {
                                        this.playfield.set(tetromino.x + x, tetromino.y + y, player, Tetrominoes.CellType.Full);
                                    }
                                }
                            }
                            if (tetromino.y == 0) {
                                this.lobby.gameOver();
                            }
                            boardUpdated = true;
                            break;
                        }
                        else {
                            tetromino.y++;
                        }
                    }
                }
                let lines = 0;
                if (boardUpdated) {
                    for (let y = 0; y < this.playfield.height; y++) {
                        let lineComplete = true;
                        for (let x = 0; x < this.playfield.width; x++) {
                            let cell = this.playfield.board[x + y * this.playfield.width];
                            if (cell.type == Tetrominoes.CellType.Empty) {
                                lineComplete = false;
                                break;
                            }
                        }
                        if (lineComplete) {
                            lines++;
                            for (let x = 0; x < this.playfield.width; x++) {
                                for (let _y = y; _y > 0; _y--) {
                                    let cell1 = this.playfield.board[x + _y * this.playfield.width];
                                    let cell2 = this.playfield.board[x + (_y - 1) * this.playfield.width];
                                    cell1.type = cell2.type;
                                    cell1.owner = cell2.owner;
                                }
                                {
                                    let cell = this.playfield.board[x + 0 * this.playfield.width];
                                    cell.type = Tetrominoes.CellType.Empty;
                                    cell.owner = null;
                                }
                            }
                        }
                    }
                }
                if (lines > 0) {
                    let baseScore = 40;
                    if (lines == 2) {
                        baseScore = 100;
                    }
                    else if (lines == 3) {
                        baseScore = 300;
                    }
                    else if (lines == 4) {
                        baseScore = 1200;
                    }
                    let score = baseScore * this.playfield.level;
                    for (let player of collidingPlayers) {
                        this.lobby.broadcast(new Tetrominoes.ScoreMessage(player.id, score));
                    }
                    this.playfield.lines += lines;
                    let level = Math.ceil(this.playfield.lines / 4);
                    if (level != this.playfield.level) {
                        this.playfield.level = level;
                        this.playfield.gravity = level / 512;
                        this.lobby.broadcast(new Tetrominoes.LevelUpMessage(this.playfield.gravity));
                    }
                }
                if (boardUpdated) {
                    this.updateBoard();
                }
            }
        }
        Server.TetrominoesService = TetrominoesService;
    })(Server = Tetrominoes.Server || (Tetrominoes.Server = {}));
})(Tetrominoes || (Tetrominoes = {}));
