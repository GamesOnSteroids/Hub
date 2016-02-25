namespace Tetrominoes.Client {
    "use strict";


    import EventDispatcher = Play.Client.EventDispatcher;
    import Camera = Play.Client.Camera;
    import Game = Play.Client.Game;
    import ClientLobby = Play.Client.ClientLobby;


    const TILE_SIZE = 32;
    const WIDTH = 10;
    const HEIGHT = 22;

    class Tetromino {
        constructor(public type: TetrominoType, public owner: PlayerInfo, public x: number, public y: number, public orientation: Direction4) {

        }
    }

    enum TetrominoType {
        Z,
        L,
        O,
        S,
        I,
        J,
        T
    }

    export class TetrominoesGame extends Game {

        private camera: Camera;
        private assets: any;
        private shapes = new Map<TetrominoType, boolean[][]>(
            [
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
            ]
        );

        private board = new Array<Array<number>>();

        constructor(lobby: ClientLobby) {
            super(lobby);


            this.load();

            // this.on(MessageId.SMSG_REVEAL, this.onReveal.bind(this));
            // this.on(MessageId.SMSG_FLAG, this.onFlag.bind(this));
            // this.on(MessageId.SMSG_SCORE, this.onScore.bind(this));

        }

        public initialize(): void {
            super.initialize();

            this.canvas.width = WIDTH * TILE_SIZE;
            this.canvas.height = HEIGHT * TILE_SIZE;
            (this.context as any).imageSmoothingEnabled = false;


            this.canvas.style.cursor = "pointer";

            this.camera = new Camera(this.canvas);
            this.camera.translateX = 0;
            this.camera.translateY = 0;

            this.emitChange();


        }


        protected update(delta: number): void {
            this.camera.update(delta);

            // for each tetrominoe
            //   move one down
        }


        protected draw(delta: number): void {
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

        private drawTetromino(ctx: CanvasRenderingContext2D, tetromino: Tetromino): void {
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

        private load(): void {
            let root = "app/games/tetrominoes/assets/";

            this.assets = {};
            this.assets.tiles = [];
            for (let i = 0; i < 4; i++) {
                this.assets.tiles[0] = new Image();
                this.assets.tiles[0].src = `${root}images/${i}.png`;
            }
        }

    }

}