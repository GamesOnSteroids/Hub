module Chess.Client {
    "use strict";

    import EventDispatcher = Play.Client.EventDispatcher;
    import Camera = Play.Client.Camera;
    import Game = Play.Client.Game;
    import Mouse = Play.Client.Mouse;
    import Sprite = Play.Client.Sprite;
    import ClientLobby = Play.Client.ClientLobby;


    const TILE_WIDTH = 52;
    const TILE_HEIGHT = 42;

    export class ChessGame extends Game {

        private camera:Camera;

        private assets:any = {};

        initialize() {
            super.initialize();

            this.canvas.width = 8 * TILE_WIDTH + TILE_WIDTH * 2;
            this.canvas.height = 8 * TILE_HEIGHT + TILE_HEIGHT * 2;

            this.load();

            this.canvas.style.cursor = "pointer";

            this.camera = new Camera();
            this.camera.translateX = TILE_WIDTH;
            this.camera.translateY = TILE_HEIGHT;
            this.emitChange();
        }

        load() {
            let root = "games/chess/assets/";

            this.assets.queen = [];
            this.assets.queen[0] = new Image();
            this.assets.queen[0].src = root + "images/queen-white.png";
        }

        update(delta:number) {
            this.camera.update(delta);
        }

        draw(delta:number) {
            var ctx = this.context;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            ctx.setTransform(this.camera.scaleX, 0, 0, this.camera.scaleY, this.camera.translateX, this.camera.translateY);


            ctx.strokeRect(0, 0, 8 * TILE_WIDTH, 8 * TILE_HEIGHT);

            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    if ((x % 2) == (y % 2)) {
                        ctx.fillStyle = "#000000";
                        ctx.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
                    } else {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
                    }
                }
            }

            this.drawPiece(ctx, this.assets.queen[0], 2, 2);
        }

        drawPiece(ctx:CanvasRenderingContext2D, image:HTMLImageElement, x:number, y:number) {
            ctx.drawImage(this.assets.queen[0],
                0, 0, image.width, image.height,
                x * TILE_WIDTH - image.width / 2 + TILE_WIDTH / 2,
                y * TILE_HEIGHT + TILE_HEIGHT - image.width - TILE_HEIGHT / 4,
                image.width, image.height);
        }
    }

}