namespace Tetrominoes.Server {
    "use strict";

    // import Client = Play.Server.Client;
    import GameService = Play.Server.GameService;
    import ServerLobby = Play.Server.ServerLobby;
    // import IPlayerInfo = Play.IPlayerInfo;

    export class TetrominoesService extends GameService { //  extends GameService<TetrominoesConfiguration, TetrominoesPlayerInfo> {

        private playfield: Playfield;

        constructor(lobby: ServerLobby) {
            super(lobby);

            this.on(MessageId.CMSG_MOVE_REQUEST, this.onMoveRequest.bind(this));

            // let configuration = this.lobby.configuration.gameConfiguration;

            this.playfield = new Playfield(this.configuration.width, this.configuration.height, this.configuration.gravity);
            for (let player of this.players) {
                player.gameData = {
                    lines: 0
                };
            }

        }

        public start(): void {
            window.requestAnimationFrame(this.tick);
        }


        private onMoveRequest(player: PlayerInfo, message: MoveRequestMessage): void {
            console.log("TetrominoesService.onMoveRequest", player.id, message.type);
            let tetromino: Tetromino = this.playfield.tetrominoes.find(t => t.owner.id == player.id);
            if (tetromino == null) { // Can not move without active tetromino
                return;
            }
            let moveType = message.type;
            if (moveType == MoveType.Left) {
                if (!this.playfield.collides(tetromino.x - 1, tetromino.y, tetromino.orientation, tetromino.type)) {
                    tetromino.x--;
                    this.lobby.broadcast(new MoveMessage(player.id, moveType));

                }
            } else if (moveType == MoveType.Right) {
                if (!this.playfield.collides(tetromino.x + 1, tetromino.y, tetromino.orientation, tetromino.type)) {
                    tetromino.x++;
                    this.lobby.broadcast(new MoveMessage(player.id, moveType));

                }
            } else if (moveType == MoveType.RotateClockwise) {
                if (!this.playfield.collides(tetromino.x, tetromino.y, (tetromino.orientation + 1) % 4, tetromino.type)) {
                    tetromino.orientation = (tetromino.orientation + 1) % 4;
                    this.lobby.broadcast(new MoveMessage(player.id, moveType));
                }
            } else if (moveType == MoveType.Drop) {
                tetromino.gravity = Tetrominoes.DROP_GRAVITY;
                this.lobby.broadcast(new MoveMessage(player.id, moveType));
            }
        }

        private generateTetromino(player: PlayerInfo): Tetromino {
            // TODO: if this is first tile dont create S, Z, O

            let type = <TetrominoType>Math.floor(Math.random() * 7);
            let x = 0;
            if (this.players.length > 1) {
                x = this.players.indexOf(player) * Math.round(this.playfield.width / (this.players.length - 1));
                x = Math.max(0, Math.min(x, x - Tetromino.SHAPES.get(type)[0][0].length));
            }
            let tetromino = new Tetromino(type, player, x, 0, 0, this.playfield.gravity);

            return tetromino;
        }

        private updateBoard(): void {
            let board = this.playfield.board;
            let cells: {playerId?: string, type: CellType}[] = [];
            for (let cell of board) {
                if (cell.owner != null) {
                    cells.push({playerId: cell.owner.id, type: cell.type});
                } else {
                    cells.push({type: cell.type});
                }
            }
            this.lobby.broadcast(new UpdateBoardMessage(cells));
        }

        protected update(delta: number): void {


            for (let player of this.players) {
                let tetromino = this.playfield.tetrominoes.find(t => t.owner.id == player.id);
                if (tetromino == null) {
                    let tetromino = this.generateTetromino(player);
                    this.playfield.tetrominoes.push(tetromino);
                    console.log("TetrominoesService.createTetromino", tetromino.owner.id);
                    this.lobby.broadcast(new CreateTetrominoMessage(tetromino.owner.id, tetromino.type, tetromino.x));
                }
            }

            let boardUpdated = false;
            let i = this.playfield.tetrominoes.length;
            while (i-- != 0) {
                let tetromino = this.playfield.tetrominoes[i];
                tetromino.timer += tetromino.gravity * delta;
                while (tetromino.timer > 1) {
                    tetromino.timer -= 1;


                    let collision = this.playfield.collides(tetromino.x, tetromino.y + 1 , tetromino.orientation, tetromino.type);

                    if (collision) {
                        let player = tetromino.owner;

                        this.playfield.tetrominoes.splice(i, 1);
                        console.log("TetrominoesService.destroyTetromino", player.id);
                        this.lobby.broadcast(new DestroyTetrominoMessage(player.id));

                        let shape = tetromino.getShape();
                        for (let y = 0; y < shape.length; y++) {
                            for (let x = 0; x < shape[y].length; x++) {
                                if (shape[y][x]) {
                                    this.playfield.set(tetromino.x + x, tetromino.y + y, player, CellType.Full);
                                }
                            }
                        }
                        if (tetromino.y == 0) {
                            this.lobby.gameOver();
                        }

                        boardUpdated = true;
                        break; // If this tetromino was deleted no need to update timer
                    } else {
                        tetromino.y++;
                    }

//                    console.log(performance.now(), "TetrominoesService.fall", tetromino.y, this.playfield.tetrominoes.length);
                }
            }

            if (boardUpdated) {
                for (let y = 0; y < this.playfield.height; y++) {
                    let lineComplete = true;
                    for (let x = 0; x < this.playfield.width; x++) {
                        let cell = this.playfield.board[x + y * this.playfield.width];
                        if (cell.type == CellType.Empty) {
                            lineComplete = false;
                            break;
                        }
                    }
                    if (lineComplete) {
                        for (let x = 0; x < this.playfield.width; x++) {
                            {
                                let cell = this.playfield.board[x + y * this.playfield.width];
                                this.lobby.broadcast(new ScoreMessage(cell.owner.id, 100));
                            }
                            for (let _y = y; _y > 0; _y--) {
                                let cell1 = this.playfield.board[x + _y * this.playfield.width];
                                let cell2 = this.playfield.board[x + (_y - 1) * this.playfield.width];
                                cell1.type = cell2.type;
                                cell1.owner = cell2.owner;
                            }
                            {
                                let cell = this.playfield.board[x + 0 * this.playfield.width];
                                cell.type = CellType.Empty;
                                cell.owner = null;
                            }
                        }

                    }
                }
            }

            // test if there is full line
            // if yes, remove line,

            if (boardUpdated) {
                this.updateBoard();
            }

        }

    }
}