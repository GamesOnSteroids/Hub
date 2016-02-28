namespace Tetrominoes.Client {
    "use strict";


    import EventDispatcher = Play.Client.EventDispatcher;
    import Camera = Play.Client.Camera;
    import Game = Play.Client.Game;
    import ClientLobby = Play.Client.ClientLobby;


    const TILE_SIZE = 32;


    export class TetrominoesGame extends Game {

        private camera: Camera;
        private assets: any;

        private playfield: Playfield;

        constructor(lobby: ClientLobby) {
            super(lobby);


            this.load();

            this.playfield = new Playfield(this.configuration.width, this.configuration.height);

            this.on(MessageId.SMSG_CREATE_TETROMINO, this.onCreateTetromino.bind(this));
            this.on(MessageId.SMSG_DESTROY_TETROMINO, this.onDestroyTetromino.bind(this));
            this.on(MessageId.SMSG_UPDATE_BOARD, this.onUpdateBoard.bind(this));
            this.on(MessageId.SMSG_MOVE, this.onMove.bind(this));

            // this.on(MessageId.SMSG_FLAG, this.onFlag.bind(this));
            // this.on(MessageId.SMSG_SCORE, this.onScore.bind(this));


        }

        public initialize(): void {
            super.initialize();

            this.canvas.width = this.configuration.width * TILE_SIZE;
            this.canvas.height = this.configuration.height * TILE_SIZE;
            (this.context as any).imageSmoothingEnabled = false;


            this.canvas.style.cursor = "pointer";

            this.camera = new Camera(this.canvas);
            this.camera.translateX = 0;
            this.camera.translateY = 0;


            this.emitChange();


        }

        private onMove(message: MoveMessage): void {
            let player = this.players.find( p => p.id == message.playerId);
            let tetromino = this.playfield.tetrominoes.find(t => t.owner.id == player.id);
            if (message.type == MoveType.Left) {
                tetromino.x--;
            } else if (message.type == MoveType.Right) {
                tetromino.x++;
            } else if (message.type == MoveType.RotateClockwise) {
                tetromino.orientation = (tetromino.orientation + 1) % 4;
            }
        }
        protected onKeyDown(e: KeyboardEvent): void {
            if (e.keyCode == 37) { // left
                this.send(new MoveRequestMessage(MoveType.Left));
            } else if (e.keyCode == 39) { // right
                this.send(new MoveRequestMessage(MoveType.Right));
            } else if (e.keyCode == 40) { // down

            } else if (e.keyCode == 38) { // up
                this.send(new MoveRequestMessage(MoveType.RotateClockwise));
            }
        }

        private onUpdateBoard(message: UpdateBoardMessage): void {

            for (let i = 0; i < this.playfield.width * this.playfield.height; i++) {
                let cell = this.playfield.board[i];
                if (message.cells[i].playerId != null) {
                    cell.owner = this.players.find(p => p.id == message.cells[i].playerId);
                }
                cell.type = message.cells[i].type;
            }
        }

        private onDestroyTetromino(message: DestroyTetrominoMessage): void {
            let player = this.players.find(p => p.id == message.playerId);
            let tetromino = this.playfield.tetrominoes.find(t => t.owner.id == player.id);
            this.playfield.tetrominoes.splice(this.playfield.tetrominoes.indexOf(tetromino), 1);

        }

        private onCreateTetromino(message: CreateTetrominoMessage): void {
            let player = this.players.find(p => p.id == message.playerId);

            this.playfield.tetrominoes.push(new Tetromino(message.type, player, message.x, 0, 0));
        }

        protected update(delta: number): void {
            this.camera.update(delta);


            for (let tetromino of this.playfield.tetrominoes) {
                tetromino.timer += this.configuration.gravity * delta;
                if (tetromino.timer > 1) {
                    tetromino.timer -= 1;

                    tetromino.y++;
                    //console.log(performance.now(), "TetrominoesGame.fall", tetromino.y);
                }
            }

            // for each tetrominoe
            //   move one down
        }


        protected draw(delta: number): void {
            let ctx = this.context;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            //ctx.fillStyle = "#000000";
            //ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            ctx.setTransform(this.camera.scaleX, 0, 0, this.camera.scaleY, this.camera.translateX, this.camera.translateY);


            ctx.globalAlpha = 0.5;
            for (let tetromino of this.playfield.tetrominoes) {
                this.drawTetromino(ctx, tetromino);
            }


            ctx.globalAlpha = 1;


            for (let y = 0; y < this.playfield.height; y++) {
                for (let x = 0; x < this.playfield.width; x++) {
                    let cell = this.playfield.board[x + y * this.playfield.width];
                    if (cell.type == CellType.Full) {
                        let image = this.assets.tiles[cell.owner.team];
                        ctx.drawImage(image, 0, 0, image.width, image.height, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    }
                }
            }

        }

        private drawTetromino(ctx: CanvasRenderingContext2D, tetromino: Tetromino): void {
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

        private load(): void {
            let root = "app/games/tetrominoes/assets/";

            this.assets = {};
            this.assets.tiles = [];
            for (let i = 0; i < 4; i++) {
                this.assets.tiles[i] = new Image();
                this.assets.tiles[i].src = `${root}images/${i}.png`;
            }
        }

    }

}