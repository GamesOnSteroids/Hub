namespace Chess.Client {
    "use strict";

    import Camera = Play.Client.Camera;
    import Game = Play.Client.Game;
    import Mouse = Play.Client.Mouse;
    import ClientLobby = Play.Client.ClientLobby;


    const TILE_WIDTH: number = 48;
    const TILE_HEIGHT: number = 48;


    export class ChessGame extends Game<IChessVariant, IChessPlayer> {

        private camera: Camera;

        private assets: any = {};

        private chessBoard: ChessBoard;
        private selectedPiece: ChessPiece = null;


        constructor(lobby: ClientLobby) {
            super(lobby);

            this.load();

            this.on(MessageId.SMSG_CREATE_PIECE, this.onCreatePiece.bind(this));
            this.on(MessageId.SMSG_MOVE_PIECE, this.onMovePiece.bind(this));
            this.on(MessageId.SMSG_DESTROY_PIECE, this.onDestroyPiece.bind(this));
            this.on(MessageId.SMSG_SCORE, this.onScore.bind(this));


            for (let player of this.players) {
                player.gameData = {
                    pieces: 0,
                    score: 0,
                    isAlive: true,
                };
            }
            if (this.variant.boardType == "4player") {
                this.chessBoard = new FourPlayerChessBoard();
            } else {
                this.chessBoard = new TwoPlayerChessBoard();
            }
        }

        public initialize(): void {
            super.initialize();

            this.canvas.width = this.chessBoard.size * TILE_WIDTH + TILE_WIDTH * 0;
            this.canvas.height = this.chessBoard.size * TILE_HEIGHT + TILE_HEIGHT * 1;

            this.canvas.style.cursor = "pointer";

            this.camera = new Camera(this.canvas);
            this.camera.translateX = TILE_WIDTH * 0;
            this.camera.translateY = TILE_HEIGHT * 1;


            this.emitChange();
        }

        protected update(delta: number): void {
            this.camera.update(delta);

            for (let piece of this.chessBoard.pieces) {
                if (piece.goal != null) {
                    let length = MathUtils.length(piece.start.x, piece.start.y, piece.goal.x, piece.goal.y);
                    piece.movementProgress += (delta * MOVEMENT_SPEED) / length;
                    if (piece.movementProgress > 1) {
                        piece.movementProgress = 1;
                    }
                    piece.x = Math.round(MathUtils.lerp(piece.start.x, piece.goal.x, piece.movementProgress));
                    piece.y = Math.round(MathUtils.lerp(piece.start.y, piece.goal.y, piece.movementProgress));

                    if (piece.movementProgress == 1) {
                        piece.x = piece.goal.x;
                        piece.y = piece.goal.y;
                        piece.goal = null;
                        piece.start = null;
                        piece.movementProgress = 0;
                        piece.timer = LOCK_TIMER;
                        this.playSound(this.assets.movepiece[MathUtils.random(0, this.assets.movepiece.length)]);

                        if (piece.owner != this.localPlayer) {
                            this.checkForCheck(piece);
                        }
                    }
                }
                if (piece.timer > 0) {
                    piece.timer -= delta * (1 / 1000);
                }
            }

        }

        private checkForCheck(piece: ChessPiece): void {
            let validMoves = piece.getValidMoves(this.chessBoard);
            for (let validMove of validMoves) {
                if (validMove.constraints == MoveType.Capture) {
                    let capturePiece = this.chessBoard.pieces.find(p => p.x == validMove.x && p.y == validMove.y);
                    if (capturePiece.type == PieceType.King) {
                        this.playSound(this.assets.check);
                    }
                }
            }
        }

        private rotate2D(x: number, y: number): {x: number, y: number} {
            let localPlayerId = this.localPlayer.team;
            if (this.players.length == 2) {
                if (localPlayerId == 1) {
                    return {x: x, y: this.chessBoard.size - 1 - y};
                } else {
                    return {x: x, y: y};
                }
            } else {
                if (localPlayerId == 1) {
                    return {x: x, y: this.chessBoard.size - 1 - y};
                } else if (localPlayerId == 2) {
                    return {x: y, y: x};
                } else if (localPlayerId == 3) {
                    return {x: this.chessBoard.size - 1 - y, y: this.chessBoard.size - 1 - x};
                } else {
                    return {x: x, y: y};
                }
            }
        }

        protected draw(delta: number): void {
            let ctx = this.context;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            ctx.setTransform(this.camera.scaleX, 0, 0, this.camera.scaleY, this.camera.translateX, this.camera.translateY);

            ctx.globalAlpha = 1;
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, this.chessBoard.size * TILE_WIDTH, this.chessBoard.size * TILE_HEIGHT);

            for (let y = 0; y < this.chessBoard.size; y++) {
                for (let x = 0; x < this.chessBoard.size; x++) {
                    if (this.chessBoard.isValidPosition(x, y)) {

                        let tile: HTMLImageElement;
                        if ((x % 2) == (y % 2)) {
                            tile = this.assets.white;
                        } else {
                            tile = this.assets.black;
                        }
                        ctx.drawImage(tile,
                            0, 0, this.assets.white.width, this.assets.white.height,
                            x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);

                    }
                }
            }
            if (this.selectedPiece != null) {
                ctx.fillStyle = "#FFCC00";
                let p = this.rotate2D(this.selectedPiece.x, this.selectedPiece.y);
                ctx.fillRect(p.x * TILE_WIDTH, p.y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);

                ctx.globalAlpha = 0.6;
                let validMoves = this.selectedPiece.getValidMoves(this.chessBoard);
                for (let validMove of validMoves) {
                    if (validMove.constraints == MoveType.Capture) {
                        ctx.fillStyle = "#FF3B30";
                    } else {
                        ctx.fillStyle = "#8CA4E9";
                    }
                    let p = this.rotate2D(validMove.x, validMove.y);
                    ctx.fillRect(p.x * TILE_WIDTH, p.y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
                }
            }


            const sortPieces = (a: ChessPiece, b: ChessPiece) => {
                let p1 = this.getPieceOffset(a);
                let p2 = this.getPieceOffset(b);
                return p1.y - p2.y;
            };

            for (let piece of this.chessBoard.pieces.sort(sortPieces)) {
                this.drawPiece(ctx, piece);
            }
        }

        protected onMouseDown(e: MouseEvent): void {

            let position = this.camera.unproject(e.offsetX, e.offsetY);
            let x = Math.floor(position.x / TILE_WIDTH);
            let y = Math.floor(position.y / TILE_HEIGHT);

            let p = this.rotate2D(x, y);
            x = p.x;
            y = p.y;
            if (Mouse.button == 1) {
                let piece = this.chessBoard.pieces.find(p => p.x == x && p.y == y);
                if (piece != null && piece.timer <= 0 && piece.movementProgress == 0 && piece.owner.id == this.localPlayer.id) {
                    this.selectedPiece = piece;
                } else if (this.selectedPiece != null) {
                    let validMoves = this.selectedPiece.getValidMoves(this.chessBoard);
                    if (validMoves.find(m => m.x == x && m.y == y) != null) {
                        this.movePiece(this.selectedPiece, x, y);
                        this.selectedPiece = null;
                    }

                }
            } else if (Mouse.button == 2) {
                this.selectedPiece = null;
            }
        }

        private onScore(msg: ScoreMessage): void {
            let player = this.players.find(p => p.id == msg.playerId);
            player.gameData.score += msg.score;
            this.emitChange();
        }

        private load(): void {
            let root = "app/games/chess/assets/";

            this.assets.movepiece = [];
            this.assets.movepiece[0] = new Audio(root + "sounds/movepiece1.wav");
            this.assets.movepiece[1] = new Audio(root + "sounds/movepiece2.wav");
            this.assets.movepiece[2] = new Audio(root + "sounds/movepiece3.wav");
            this.assets.movepiece[3] = new Audio(root + "sounds/movepiece4.wav");
            this.assets.movepiece[4] = new Audio(root + "sounds/movepiece5.wav");
            this.assets.piecetaken = new Audio(root + "sounds/chess_piecetaken.wav");
            this.assets.illegalmove = new Audio(root + "sounds/illegalmove.wav");
            this.assets.check = new Audio(root + "sounds/check.wav");
            this.assets.checkmatelose = new Audio(root + "sounds/checkmatelose.wav");
            this.assets.checkmatewin = new Audio(root + "sounds/checkmatewin.wav");

            this.assets.white = new Image();
            this.assets.white.src = `${root}images/white.png`;
            this.assets.black = new Image();
            this.assets.black.src = `${root}images/black.png`;
            for (let pieceType = 1; pieceType <= 6; pieceType++) {
                this.assets[pieceType] = [];
                for (let team = 0; team < 4; team++) {
                    this.assets[pieceType][team] = new Image();
                    this.assets[pieceType][team].src = `${root}images/${pieceType}-${team}.png`;
                }
            }
        }

        private onMovePiece(message: MovePieceMessage): void {
            console.log("ChessGame.onMovePiece", message);
            let piece = this.chessBoard.pieces.find(p => p.id == message.pieceId);
            piece.goTo(message.x, message.y);

        }

        private onDestroyPiece(message: DestroyPieceMessage): void {
            console.log("ChessGame.onDestroyPiece", message);
            let piece = this.chessBoard.pieces.find(p => p.id == message.pieceId);
            if (this.selectedPiece == piece) {
                this.selectedPiece = null;
            }
            this.chessBoard.pieces.splice(this.chessBoard.pieces.indexOf(piece), 1);
            piece.owner.gameData.pieces--;

            this.playSound(this.assets.piecetaken);
            if (piece.type == PieceType.King) {
                if (piece.owner == this.localPlayer) {
                    this.playSound(this.assets.checkmatelose);
                } else {
                    this.playSound(this.assets.checkmatewin);
                }
            }

            this.emitChange();
        }

        private onCreatePiece(message: CreatePieceMessage): void {
            console.log("ChessGame.onCreatePiece", message.pieceId, PieceType[message.pieceType], message.x, message.y);
            let player = this.players.find(p => p.id == message.playerId);
            player.gameData.pieces++;
            if (message.pieceType == PieceType.Queen) {
                let queen = new Queen(message.pieceId, message.x, message.y, player);
                this.chessBoard.pieces.push(queen);
                if (queen.owner != this.localPlayer) {
                    this.checkForCheck(queen); // promotion
                }
            } else if (message.pieceType == PieceType.King) {
                this.chessBoard.pieces.push(new King(message.pieceId, message.x, message.y, player));
            } else if (message.pieceType == PieceType.Knight) {
                this.chessBoard.pieces.push(new Knight(message.pieceId, message.x, message.y, player));
            } else if (message.pieceType == PieceType.Bishop) {
                this.chessBoard.pieces.push(new Bishop(message.pieceId, message.x, message.y, player));
            } else if (message.pieceType == PieceType.Rook) {
                this.chessBoard.pieces.push(new Rook(message.pieceId, message.x, message.y, player));
            } else if (message.pieceType == PieceType.Pawn) {
                this.chessBoard.pieces.push(new Pawn(message.pieceId, message.x, message.y, message.direction, player));
            }
            this.emitChange();
        }

        private movePiece(piece: ChessPiece, x: number, y: number): void {
            console.log("ChessGame.movePiece", PieceType[piece.type], x, y);

            this.send(new MovePieceRequestMessage(piece.id, x, y));
        }

        private drawPiece(ctx: CanvasRenderingContext2D, piece: ChessPiece): void {

            let p = this.getPieceOffset(piece);

            let image = this.assets[piece.type][piece.owner.team];

            // reflection
            ctx.globalAlpha = 0.3;
            ctx.save();
            ctx.scale(1, -1);
            ctx.drawImage(image, 0, 0, image.width, image.height, p.x - image.width / 2 + TILE_WIDTH / 2, -p.y - image.height - TILE_WIDTH / 5, image.width, image.height);
            ctx.restore();

            ctx.globalAlpha = 1;
            ctx.drawImage(
                image,
                0, 0, image.width, image.height,
                p.x - image.width / 2 + TILE_WIDTH / 2,
                p.y - image.height + TILE_WIDTH / 1.3,
                image.width, image.height);

            if (piece.timer > 0) {
                ctx.globalAlpha = 0.8;
                ctx.fillStyle = "#FF3B30";
                ctx.beginPath();
                let progress = (piece.timer * Math.PI * 2) / LOCK_TIMER;
                ctx.moveTo(p.x + TILE_WIDTH / 2, p.y + TILE_HEIGHT / 2);
                ctx.arc(
                    p.x + TILE_WIDTH / 2,
                    p.y + TILE_HEIGHT / 2,
                    TILE_WIDTH / 3,
                    0, progress);
                ctx.fill();
            }
        }

        private getPieceOffset(piece: ChessPiece): {x: number, y: number} {
            if (piece.goal != null) {
                let start = this.rotate2D(piece.start.x, piece.start.y);
                let goal = this.rotate2D(piece.goal.x, piece.goal.y);
                return {
                    x: MathUtils.lerp(start.x, goal.x, piece.movementProgress) * TILE_WIDTH,
                    y: MathUtils.lerp(start.y, goal.y, piece.movementProgress) * TILE_HEIGHT
                };
            } else {
                let p = this.rotate2D(piece.x, piece.y);
                return {
                    x: p.x * TILE_WIDTH,
                    y: p.y * TILE_HEIGHT
                };
            }
        };
    }
}