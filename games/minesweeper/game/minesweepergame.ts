module Minesweeper.Game {
    "use strict";
    import Camera = Play.Camera;
    import Game = Play.Game;
    import Mouse = Play.Mouse;
    import ClientLobby = Play.ClientLobby;


    const TILE_SIZE = 20;


    export class Sprite {

        public positionX: number;
        public positionY: number;
        public image: HTMLImageElement;

        public time: number;
        public index: number;
        public duration: number;
        public imageCount: number;
        public isFinished: boolean;
        public frameSize: number;

        constructor(positionX: number, positionY: number, image: HTMLImageElement, frameSize: number, duration: number)
        {
            this.positionX = positionX;
            this.positionY = positionY;
            this.frameSize = frameSize;
            this.image = image;
            this.imageCount = image.width / frameSize;
            this.duration = duration / this.imageCount;
            this.index = 0;
            this.time = 0;
        }

        public update(delta: number) {
            console.log(delta, this.time);
            this.time += delta;
            while (this.time > this.duration) {
                this.time -= this.duration;
                this.index++;

                if (this.index == this.imageCount) {
                    this.isFinished = true;
                    break;
                }
            }
        }

        public draw(ctx: CanvasRenderingContext2D, delta: number) {
            ctx.drawImage(this.image, this.index * this.frameSize, 0, this.frameSize, this.frameSize, this.positionX - this.frameSize / 2, this.positionY - this.frameSize / 2, this.frameSize, this.frameSize);
        }
    }

    export class MinesweeperGame extends Game {

        private camera:Play.Camera;
        private minefield:Minefield;
        private assets:any;
        public changeListener:(game:MinesweeperGame)=>void;

        constructor(lobby:ClientLobby) {
            super(lobby);

            for (let player of this.lobby.players) {
                player.gameData = {
                    score: 0,
                    flags: 0,
                    mines: 0
                };
            }
            this.sprites = [];
        }

        initialize() {
            super.initialize();

            let configuration = this.lobby.configuration;

            this.minefield = new Minefield(configuration.width, configuration.height);

            this.canvas.width = this.minefield.width * TILE_SIZE + TILE_SIZE * 2;
            this.canvas.height = this.minefield.height * TILE_SIZE + TILE_SIZE * 2;

            this.load();

            this.on(MessageId.SMSG_REVEAL, this.onReveal.bind(this));
            this.on(MessageId.SMSG_FLAG, this.onFlag.bind(this));
            this.on(MessageId.SMSG_SCORE, this.onScore.bind(this));

            this.canvas.style.cursor = "pointer";

            this.camera = new Camera();
            this.camera.translateX = TILE_SIZE;
            this.camera.translateY = TILE_SIZE;
            this.emitChange();

            this.assets.start.play();

        }

        flag(x:number, y:number) {

            let field = this.minefield.get(x + y * this.minefield.width);

            if (field.isRevealed) {
                return;
            }

            if (field.owner != null) {
                if (field.owner.id == this.lobby.localPlayer.id) {
                    this.send<FlagRequestMessage>({
                        id: MessageId.CMSG_FLAG_REQUEST,
                        fieldId: x + y * this.minefield.width,
                        flag: false
                    });
                }
            } else {
                this.send<FlagRequestMessage>({
                    id: MessageId.CMSG_FLAG_REQUEST,
                    fieldId: x + y * this.minefield.width,
                    flag: true
                });
            }

        }

        massReveal(x:number, y:number) {
            let fieldId = x + y * this.minefield.width;
            let field = this.minefield.get(fieldId);
            if (!field.isRevealed) {
                return;
            }

            let flags = 0;
            let unknownFields = 0;
            this.minefield.forAdjacent(fieldId, (fieldId) => {
                let field = this.minefield.get(fieldId);
                if (field.hasFlag || (field.isRevealed && field.hasMine)) {
                    flags++;
                }
                if (!field.isRevealed && !field.hasFlag ) { // are there any unrevealed unflagged fields left?
                    unknownFields++;
                }
            });

            if (flags == field.adjecentMines && unknownFields > 0) {
                this.send<MassRevealRequestMessage>({
                    id: MessageId.CMSG_MASS_REVEAL_REQUEST,
                    fieldId: x + y * this.minefield.width
                });
            } else {
                this.assets.invalidmove.play();
            }
        }

        reveal(x:number, y:number) {
            let field = this.minefield.get(x + y * this.minefield.width);

            if (field.isRevealed) {
                return;
            }
            if (field.hasFlag && field.owner.team == this.lobby.localPlayer.team) {
                return;
            }
            let doubt = field.hasFlag;

            this.send<RevealRequestMessage>({
                id: MessageId.CMSG_REVEAL_REQUEST,
                fieldId: x + y * this.minefield.width,
                doubt: doubt
            });
            //TODO: play sound
        }

        onScore(msg:ScoreMessage) {
            let player = this.lobby.players.find(p => p.id == msg.playerId);
            player.gameData.score += msg.score;
            this.emitChange();
        }

        onFlag(msg:FlagMessage) {
            let field = this.minefield.get(msg.fieldId);
            var player = this.lobby.players.find(p => p.id == msg.playerId);

            if (msg.flag)
                player.gameData.flags++;
            else
                player.gameData.flags--;

            if (msg.flag) {
                field.owner = player;
                field.hasFlag = true;
            } else {
                field.owner = null;
                field.hasFlag = false;
            }

            this.emitChange();
        }

        emitChange() {
            if (this.changeListener != null) {
                this.changeListener(this);
            }
        }

        onReveal(msg:RevealMessage) {
            let field = this.minefield.get(msg.fieldId);
            var player = this.lobby.players.find(p => p.id == msg.playerId);

            field.isRevealed = true;

            let oldOwner = field.owner;
            field.owner = player;
            field.adjecentMines = msg.adjacentMines;
            field.hasMine = msg.hasMine;
            field.hasFlag = false;
            if (oldOwner != null) {
                oldOwner.gameData.flags--;
                this.emitChange();
            }
            if (field.hasMine) {
                this.assets.boom.play();

                const boomDuration = 500;

                this.camera.shake(2, boomDuration / 2);

                let x = (msg.fieldId % this.minefield.width) | 0;
                let y = (msg.fieldId / this.minefield.width) | 0;

                this.sprites.push(new Sprite(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, this.assets.explosion, 64, boomDuration ));

            } else {
                this.assets.tilesingle.play();
            }

        }

        load() {
            this.assets = {};

            let root = "games/minesweeper/assets/";

            this.assets.hidden = new Image();
            this.assets.hidden.src = root + "images/hidden.png";
            this.assets.over = new Image();
            this.assets.over.src = root + "images/over.png";

            this.assets.reveal = [];
            this.assets.mines = [];
            this.assets.flags = [];
            for (let i = 0; i < 4; i++) {
                this.assets.reveal[i] = new Image();
                this.assets.reveal[i].src = root + `images/empty-${i}.png`;
                this.assets.mines[i] = new Image();
                this.assets.mines[i].src = root + `images/mine-${i}.png`;
                this.assets.flags[i] = new Image();
                this.assets.flags[i].src = root + `images/flag-${i}.png`;
            }

            this.assets.numbers = [];
            for (let i = 0; i < 8; i++) {
                this.assets.numbers[i] = new Image();
                this.assets.numbers[i].src = root + `images/${(i + 1)}.png`;
            }

            this.assets.explosion = new Image();
            this.assets.explosion.src = root + "images/explosion.png";

            this.assets.boom = new Audio(root + "sounds/boom.ogg");
            this.assets.tilesingle = new Audio(root + "sounds/tilesingle.ogg");
            this.assets.tilemultiple = new Audio(root + "sounds/tilemultiple.ogg");
            this.assets.start = new Audio(root + "sounds/start.ogg");
            this.assets.invalidmove = new Audio(root + "sounds/invalidmove.ogg");

        }

        private sprites: Sprite[];

        update(delta:number) {
            this.camera.update(delta);

            for (let sprite of this.sprites) {
                sprite.update(delta);
            }

            this.sprites = this.sprites.filter(s=>!s.isFinished);
        }


        draw(delta: number) {
            var ctx = this.context;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            ctx.setTransform(this.camera.scaleX, 0, 0, this.camera.scaleY, this.camera.translateX, this.camera.translateY);


            for (let y = 0; y < this.minefield.height; y++) {
                for (let x = 0; x < this.minefield.width; x++) {
                    let field = this.minefield.get(x + y * this.minefield.width);


                    //console.log(x, y, field);
                    if (field.isRevealed) {
                        ctx.drawImage(this.assets.reveal[field.owner.team], x * TILE_SIZE, y * TILE_SIZE);
                        if (field.hasMine) {
                            ctx.drawImage(this.assets.mines[field.owner.team], x * TILE_SIZE, y * TILE_SIZE);
                        } else {
                            if (field.adjecentMines > 0) {
                                ctx.drawImage(this.assets.numbers[field.adjecentMines - 1], x * TILE_SIZE, y * TILE_SIZE);
                            }
                        }
                        // neco
                    } else {

                        // if mouse over
                        let mousePosition = this.camera.unproject(Mouse.x, Mouse.y);

                        if (field.hasFlag) {
                            ctx.drawImage(this.assets.hidden, x * TILE_SIZE, y * TILE_SIZE);
                            ctx.drawImage(this.assets.flags[field.owner.team], x * TILE_SIZE, y * TILE_SIZE - TILE_SIZE / 3);
                        } else {

                            if (x == ((mousePosition.x / TILE_SIZE) | 0) && y == ((mousePosition.y / TILE_SIZE) | 0)) {
                                if (Mouse.button == 1) {
                                    ctx.drawImage(this.assets.reveal[this.lobby.localPlayer.team], x * TILE_SIZE, y * TILE_SIZE);
                                } else {
                                    ctx.drawImage(this.assets.over, x * TILE_SIZE, y * TILE_SIZE);
                                }
                            } else {
                                ctx.drawImage(this.assets.hidden, x * TILE_SIZE, y * TILE_SIZE);
                            }
                        }

                    }
                }
            }

            for (let sprite of this.sprites) {
                sprite.draw(ctx, delta);
            }
        }

        onMouseDown(e:MouseEvent) {

            if (Mouse.button == 2) {
                let position = this.camera.unproject(e.offsetX, e.offsetY);
                let x = (position.x / TILE_SIZE) | 0;
                let y = (position.y / TILE_SIZE) | 0;
                if (x >= 0 && y >= 0 && x < this.minefield.width && y < this.minefield.height) {
                    this.flag(x, y);
                }
            }
        }

        onMouseUp(e:MouseEvent) {
            if (Mouse.button == 1 || Mouse.button == 3) {
                let position = this.camera.unproject(e.offsetX, e.offsetY);

                let x = (position.x / TILE_SIZE) | 0;
                let y = (position.y / TILE_SIZE) | 0;
                if (x >= 0 && y >= 0 && x < this.minefield.width && y < this.minefield.height) {
                    if (Mouse.button == 3) {
                        this.massReveal(x, y)
                    } else {
                        this.reveal(x, y);
                    }
                }
            }
        }
    }

}