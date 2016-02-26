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

        private table: Table;
        private hand: Hand;


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
            this.table = new Table();
            this.table.currentTurn = Wind.EAST;
            {
                this.hand = new Hand();
                this.hand.wind = Wind.EAST;
                this.hand.tiles = new Tiles([
                    Tile.MAN_1,
                    Tile.MAN_1,
                    Tile.MAN_2,
                    //Tile.MAN_3,

                    Tile.MAN_3,
                    Tile.MAN_3,
                    //Tile.MAN_5,

                    Tile.SOU_1,
                    Tile.SOU_2,
                    Tile.SOU_3,

                    Tile.EAST,
                    Tile.EAST,
                    Tile.EAST,

                    Tile.PIN_1,
                    Tile.PIN_1]);
                this.table.hands.push(this.hand);
            }
            {
                let hand = new Hand();
                hand.wind = Wind.EAST;
                hand.pond.push(TileId.MAN_3);
                this.table.hands.push(hand);
            }



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

            this.drawWalls(ctx);



            for (let tile of this.table.hands[1].pond) {
                this.drawTile(ctx, tile, 20, 20);
            }


            this.drawHand(ctx, this.hand);
            //{
            //    let x = 160;
            //    let y = 20;
            //    for (let i = 0; i < 12; i++) {
            //        let image = this.assets.back;
            //        ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
            //        x += 23;
            //    }
            //}
            //{
            //    let y = 140;
            //    for (let i = 0; i < 12; i++) {
            //        let image = this.assets.side;
            //        ctx.drawImage(image, 0, 0, image.width, image.height, 40, y, image.width, image.height);
            //        y += 12;
            //    }
            //}
            //{
            //    let y = 140;
            //    for (let i = 0; i < 12; i++) {
            //        let image = this.assets.side;
            //        ctx.drawImage(image, 0, 0, image.width, image.height, 540, y, image.width, image.height);
            //        y += 12;
            //    }
            //}
        }

        private drawWall(ctx: CanvasRenderingContext2D): void {

        }

        private drawWalls(ctx: CanvasRenderingContext2D): void {

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
                    } else {
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
                    } else {
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
                    } else {
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
                    } else {
                        ctx.drawImage(image, 0, 0, image.width, image.height, x, y - 12, image.width, image.height);
                        y -= 12;
                    }
                }
            }
        }

        private drawHand(ctx: CanvasRenderingContext2D, hand: Hand): void {

            let moves = this.table.getAvailableMoves(TileId.MAN_3, this.hand);

            let x = 160;
            let y = 400;
            for (let tile of hand.tiles.tiles) {
                let drawn = false;
                for (let move of moves) {
                    if (move.type == MoveType.CHI) {
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

        private drawTile(ctx: CanvasRenderingContext2D, tile: TileId, x: number, y: number): void {
            let image = this.assets.tiles[tile];
            ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
        }

        private async load(): Promise<any> {
            this.assets = {};

            let root = "app/games/mahjong/assets/";

            this.assets.tiles = [];
            this.assets.tiles[TileId.PIN_1] = await this.loadAsset(`${root}images/pin-1.png`);
            this.assets.tiles[TileId.PIN_2] = await this.loadAsset(`${root}images/pin-2.png`);
            this.assets.tiles[TileId.PIN_3] = await this.loadAsset(`${root}images/pin-3.png`);
            this.assets.tiles[TileId.PIN_4] = await this.loadAsset(`${root}images/pin-4.png`);
            this.assets.tiles[TileId.PIN_5] = await this.loadAsset(`${root}images/pin-5.png`);
            this.assets.tiles[TileId.PIN_6] = await this.loadAsset(`${root}images/pin-6.png`);
            this.assets.tiles[TileId.PIN_7] = await this.loadAsset(`${root}images/pin-7.png`);
            this.assets.tiles[TileId.PIN_8] = await this.loadAsset(`${root}images/pin-8.png`);
            this.assets.tiles[TileId.PIN_9] = await this.loadAsset(`${root}images/pin-9.png`);
            this.assets.tiles[TileId.MAN_1] = await this.loadAsset(`${root}images/man-1.png`);
            this.assets.tiles[TileId.MAN_2] = await this.loadAsset(`${root}images/man-2.png`);
            this.assets.tiles[TileId.MAN_3] = await this.loadAsset(`${root}images/man-3.png`);
            this.assets.tiles[TileId.MAN_4] = await this.loadAsset(`${root}images/man-4.png`);
            this.assets.tiles[TileId.MAN_5] = await this.loadAsset(`${root}images/man-5.png`);
            this.assets.tiles[TileId.MAN_6] = await this.loadAsset(`${root}images/man-6.png`);
            this.assets.tiles[TileId.MAN_7] = await this.loadAsset(`${root}images/man-7.png`);
            this.assets.tiles[TileId.MAN_8] = await this.loadAsset(`${root}images/man-8.png`);
            this.assets.tiles[TileId.MAN_9] = await this.loadAsset(`${root}images/man-9.png`);
            this.assets.tiles[TileId.SOU_1] = await this.loadAsset(`${root}images/sou-1.png`);
            this.assets.tiles[TileId.SOU_2] = await this.loadAsset(`${root}images/sou-2.png`);
            this.assets.tiles[TileId.SOU_3] = await this.loadAsset(`${root}images/sou-3.png`);
            this.assets.tiles[TileId.SOU_4] = await this.loadAsset(`${root}images/sou-4.png`);
            this.assets.tiles[TileId.SOU_5] = await this.loadAsset(`${root}images/sou-5.png`);
            this.assets.tiles[TileId.SOU_6] = await this.loadAsset(`${root}images/sou-6.png`);
            this.assets.tiles[TileId.SOU_7] = await this.loadAsset(`${root}images/sou-7.png`);
            this.assets.tiles[TileId.SOU_8] = await this.loadAsset(`${root}images/sou-8.png`);
            this.assets.tiles[TileId.SOU_9] = await this.loadAsset(`${root}images/sou-9.png`);
            this.assets.tiles[TileId.EAST] = await this.loadAsset(`${root}images/east.png`);
            this.assets.tiles[TileId.SOUTH] = await this.loadAsset(`${root}images/south.png`);
            this.assets.tiles[TileId.WEST] = await this.loadAsset(`${root}images/west.png`);
            this.assets.tiles[TileId.NORTH] = await this.loadAsset(`${root}images/north.png`);

            this.assets.back = await this.loadAsset(`${root}images/back.png`);
            this.assets.backdown = await this.loadAsset(`${root}images/back-down.png`);
            this.assets.backside = await this.loadAsset(`${root}images/back-side.png`);
            this.assets.side = await this.loadAsset(`${root}images/side.png`);


        }

    }

}
