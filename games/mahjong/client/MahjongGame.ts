namespace Mahjong.Client {
    "use strict";

    import EventDispatcher = Play.Client.EventDispatcher;
    import Camera = Play.Client.Camera;
    import Game = Play.Client.Game;
    import Mouse = Play.Client.Mouse;
    import Sprite = Play.Client.Sprite;
    import ClientLobby = Play.Client.ClientLobby;


    const TILE_SIZE = 30;

    enum TileType {
        Suite,
        Dragon,
        Wind,
    }
    enum SuiteType {
        Pin,
        Man,
        Sou
    }

    class Tile {
        public suite: SuiteType;
        public number: number;
    }

    enum SetType {
        Chi,
        Pon,
        Kan
    }

    class Set {
        tiles: Tile[];

        // todo: closed kan
    }

    class Hand {
        public tiles: Tile[];
        public discards: Set[];
        public pond: Tile[];
    }

    export class MahjongGame extends Game {

        private camera: Camera;
        private assets: any;

        constructor(lobby: ClientLobby) {
            super(lobby);


            this.load();

            // this.on(MessageId.SMSG_REVEAL, this.onReveal.bind(this));
            // this.on(MessageId.SMSG_FLAG, this.onFlag.bind(this));
            // this.on(MessageId.SMSG_SCORE, this.onScore.bind(this));

        }

        public initialize() {
            super.initialize();


            this.canvas.width = 800;
            this.canvas.height = 800;
            (this.context as any).imageSmoothingEnabled = false;


            this.canvas.style.cursor = "pointer";

            this.camera = new Camera(this.canvas);
            this.camera.translateX = 0;
            this.camera.translateY = 0;

            this.emitChange();


        }

        protected onMouseDown(e: MouseEvent) {

            if (Mouse.button == 2) {

            }
        }

        protected onMouseUp(e: MouseEvent) {
            if (Mouse.button == 1 || Mouse.button == 3) {
                // let position = this.camera.unproject(e.offsetX, e.offsetY);

            }
        }

        protected update(delta: number): void {
            this.camera.update(delta);

        }


        protected draw(delta: number): void {
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

        private drawWall(ctx: CanvasRenderingContext2D) {
            let x = 120;
            let y = 80;
            for (let i = 0; i < 17; i++) {
                let image = this.assets.backlying;
                ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
                ctx.drawImage(image, 0, 0, image.width, image.height, x, y - 12, image.width, image.height);
                x += 23;

            }
        }

        private drawHand(ctx: CanvasRenderingContext2D, hand: Hand): void {

            let x = 160;
            let y = 400;
            for (let tile of hand.tiles) {
                this.drawTile(ctx, tile, x, y);
                x += 23;
            }
        }

        private drawTile(ctx: CanvasRenderingContext2D, tile: Tile, x: number, y: number): void {
            let image = this.assets.pin1;
            ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
        }

        private load(): void {
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

}
