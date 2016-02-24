namespace Mahjong.Client {
    "use strict";

    import EventDispatcher = Play.Client.EventDispatcher;
    import Camera = Play.Client.Camera;
    import Game = Play.Client.Game;
    import Mouse = Play.Client.Mouse;
    import Sprite = Play.Client.Sprite;
    import ClientLobby = Play.Client.ClientLobby;


    const TILE_SIZE = 30;

    export class MahjongGame extends Game {

        private camera: Camera;
        private assets: any;
        private isLoaded = false;

        constructor(lobby: ClientLobby) {
            super(lobby);


            this.load().then(() => {
                this.isLoaded = true;
                console.log("MahjongGame.loadComplete");
            }).catch( (e) => {
                console.log("e", e);
            });

            // this.on(MessageId.SMSG_REVEAL, this.onReveal.bind(this));
            // this.on(MessageId.SMSG_FLAG, this.onFlag.bind(this));
            // this.on(MessageId.SMSG_SCORE, this.onScore.bind(this));

        }

        public initialize(): void {
            super.initialize();


            this.canvas.width = 672;
            this.canvas.height = 504;
            (this.context as any).imageSmoothingEnabled = false;


            this.canvas.style.cursor = "pointer";

            this.camera = new Camera(this.canvas);
            this.camera.translateX = 0;
            this.camera.translateY = 0;

            this.emitChange();


        }

        protected onMouseDown(e: MouseEvent): void {

            if (Mouse.button == 2) {
                // todo
            }
        }

        protected onMouseUp(e: MouseEvent): void {
            if (Mouse.button == 1 || Mouse.button == 3) {
                // let position = this.camera.unproject(e.offsetX, e.offsetY);
            }
        }

        protected update(delta: number): void {
            this.camera.update(delta);
        }


        protected draw(delta: number): void {
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

        private drawWall(ctx: CanvasRenderingContext2D): void {
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
                    } else {
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
                    } else {
                        ctx.drawImage(image, 0, 0, image.width, image.height, x, y - 12, image.width, image.height);
                        y += 12;
                    }
                }
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
            let image = this.assets.tiles[TileId.Pin2];
            ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
        }

        private async load(): Promise<any> {
            this.assets = {};

            let root = "games/mahjong/assets/";

            this.assets.tiles = [];
            this.assets.tiles[TileId.Pin1] = await this.loadAsset(`${root}images/pin-1.png`);
            this.assets.tiles[TileId.Pin2] = await this.loadAsset(`${root}images/pin-2.png`);
            this.assets.tiles[TileId.Pin3] = await this.loadAsset(`${root}images/pin-3.png`);
            this.assets.tiles[TileId.Pin4] = await this.loadAsset(`${root}images/pin-4.png`);
            this.assets.tiles[TileId.Pin5] = await this.loadAsset(`${root}images/pin-5.png`);
            this.assets.tiles[TileId.Pin6] = await this.loadAsset(`${root}images/pin-6.png`);
            this.assets.tiles[TileId.Pin7] = await this.loadAsset(`${root}images/pin-7.png`);
            this.assets.tiles[TileId.Pin8] = await this.loadAsset(`${root}images/pin-8.png`);
            this.assets.tiles[TileId.Pin9] = await this.loadAsset(`${root}images/pin-9.png`);

            this.assets.back = await this.loadAsset(`${root}images/back.png`);
            this.assets.backdown = await this.loadAsset(`${root}images/back-down.png`);
            this.assets.backside = await this.loadAsset(`${root}images/back-side.png`);


        }

    }

}
