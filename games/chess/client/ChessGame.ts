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

        private chessBoard:ChessBoard;
        selectedPiece:ChessPiece = null;


        constructor(lobby:ClientLobby) {
            super(lobby);

            this.load();

            this.on(MessageId.SMSG_CREATE_PIECE, this.onCreatePiece.bind(this));
            this.on(MessageId.SMSG_MOVE_PIECE, this.onMovePiece.bind(this));
            this.on(MessageId.SMSG_DESTROY_PIECE, this.onDestroyPiece.bind(this));


            this.chessBoard = new ChessBoard();
        }

        initialize() {
            super.initialize();

            this.canvas.width = 8 * TILE_WIDTH + TILE_WIDTH * 2;
            this.canvas.height = 8 * TILE_HEIGHT + TILE_HEIGHT * 2;

            this.canvas.style.cursor = "pointer";

            this.camera = new Camera(this.canvas);
            this.camera.translateX = TILE_WIDTH;
            this.camera.translateY = TILE_HEIGHT;


            this.emitChange();
        }

        load() {
            let root = "games/chess/assets/";

            for (let pieceType = 1; pieceType <= 6; pieceType++) {
                this.assets[pieceType] = [];
                for (let team = 0; team < 2; team++) {
                    this.assets[pieceType][team] = new Image();
                    this.assets[pieceType][team].src = `${root}images/${pieceType}-${team}.png`;
                }
            }
        }

        onMovePiece(message:MovePieceMessage) {
            console.log("ChessGame.onMovePiece", message);
            let piece = this.chessBoard.pieces.find(p=>p.id == message.pieceId);
            piece.goal = {x: message.to.x, y: message.to.y};

        }

        onDestroyPiece(message:DestroyPieceMessage) {
            console.log("ChessGame.onDestroyPiece", message);
            let piece = this.chessBoard.pieces.find(p=>p.id == message.pieceId);
            if (this.selectedPiece == piece) {
                this.selectedPiece = null;
            }
            this.chessBoard.pieces.splice(this.chessBoard.pieces.indexOf(piece),1);
        }

        onCreatePiece(message:CreatePieceMessage) {
            console.log("ChessGame.onCreatePiece", message.pieceId, PieceType[message.type], message.x, message.y);
            let player = this.players.find(p=>p.id == message.playerId);
            if (message.type == PieceType.Queen) {
                this.chessBoard.pieces.push(new Queen(message.pieceId, message.x, message.y, player));
            } else if (message.type == PieceType.King) {
                this.chessBoard.pieces.push(new King(message.pieceId, message.x, message.y, player));
            } else if (message.type == PieceType.Knight) {
                this.chessBoard.pieces.push(new Knight(message.pieceId, message.x, message.y, player));
            } else if (message.type == PieceType.Bishop) {
                this.chessBoard.pieces.push(new Bishop(message.pieceId, message.x, message.y, player));
            } else if (message.type == PieceType.Rook) {
                this.chessBoard.pieces.push(new Rook(message.pieceId, message.x, message.y, player));
            } else if (message.type == PieceType.Pawn) {
                let direction:Direction4;
                if (player.team == 0)
                    direction = Direction4.Up;
                else if (player.team == 1)
                    direction = Direction4.Down;
                else if (player.team == 2)
                    direction = Direction4.Right;
                else if (player.team == 3)
                    direction = Direction4.Left;
                this.chessBoard.pieces.push(new Pawn(message.pieceId, message.x, message.y, direction, player));
            }
        }


        update(delta:number) {
            this.camera.update(delta);

            for (let piece of this.chessBoard.pieces) {
                if (piece.goal != null) {
                    let length = Math.length(piece.x, piece.y, piece.goal.x, piece.goal.y);
                    piece.movementProgress += (delta * MOVEMENT_SPEED) / length;
                    if (piece.movementProgress > 1) {
                        piece.movementProgress = 1;
                    }

                    piece.drawX = Math.lerp(piece.x, piece.goal.x, piece.movementProgress);
                    piece.drawY = Math.lerp(piece.y, piece.goal.y, piece.movementProgress);


                    if (piece.movementProgress == 1) {
                        piece.x = piece.goal.x;
                        piece.y = piece.goal.y;
                        piece.goal = null;
                        piece.movementProgress = 0;
                        piece.timer = LOCK_TIMER;
                    }
                }
                if (piece.timer > 0) {
                    piece.timer -= delta * (1 / 1000);
                }
            }

        }


        movePiece(piece:ChessPiece, x:number, y:number) {
            console.log("ChessGame.movePiece", PieceType[piece.type], x, y);

            this.send<MovePieceRequestMessage>({
                id: MessageId.CMSG_MOVE_PIECE_REQUEST,
                pieceId: piece.id,
                to: {x: x, y: y}
            })
        }

        onMouseDown(e:MouseEvent) {

            let position = this.camera.unproject(e.offsetX, e.offsetY);
            let x = (position.x / TILE_WIDTH) | 0;
            let y = (position.y / TILE_HEIGHT) | 0;

            if (Mouse.button == 1) {
                let piece = this.chessBoard.pieces.find(p=>p.x == x && p.y == y);
                if (piece != null && piece.timer <= 0 && piece.movementProgress == 0 && piece.owner.id == this.localPlayer.id) {

                    console.log("Select", PieceType[piece.type], x, y);
                    this.selectedPiece = piece;
                } else if (this.selectedPiece != null) {
                    console.log("MoveTo", PieceType[this.selectedPiece.type], x, y);
                    let validMoves = this.selectedPiece.getValidMoves(this.chessBoard);
                    if (validMoves.find(m=>m.x == x && m.y == y) != null) {
                        this.movePiece(this.selectedPiece, x, y);
                        this.selectedPiece = null;
                    }

                }
            } else if (Mouse.button == 2) {
                console.log("Deselect");
                this.selectedPiece = null;
            }
        }


        draw(delta:number):void {
            var ctx = this.context;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            ctx.setTransform(this.camera.scaleX, 0, 0, this.camera.scaleY, this.camera.translateX, this.camera.translateY);

            ctx.globalAlpha = 1;
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;
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
            if (this.selectedPiece != null) {
                ctx.fillStyle = "#FFCC00";
                ctx.fillRect(this.selectedPiece.x * TILE_WIDTH, this.selectedPiece.y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);


                ctx.globalAlpha = 0.6;
                let validMoves = this.selectedPiece.getValidMoves(this.chessBoard);
                for (let validMove of validMoves) {
                    if (validMove.constraints == MoveType.Capture) {
                        ctx.fillStyle = "#FF3B30";
                    } else {
                        ctx.fillStyle = "#4CD964";
                    }
                    ctx.fillRect(validMove.x * TILE_WIDTH, validMove.y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
                }
            }


            for (let piece of this.chessBoard.pieces.sort((a, b) => a.drawY - b.drawY)) {
                this.drawPiece(ctx, piece);
            }
        }

        drawPiece(ctx:CanvasRenderingContext2D, piece:ChessPiece):void {
            let image = this.assets[piece.type][piece.owner.team];

            let x = piece.drawX * TILE_WIDTH;
            let y = piece.drawY * TILE_HEIGHT;

            ctx.globalAlpha = 1;
            ctx.drawImage(image,
                0, 0, image.width, image.height,
                x - image.width / 2 + TILE_WIDTH / 2,
                y + TILE_HEIGHT - image.width - TILE_HEIGHT / 4,
                image.width, image.height);

            if (piece.timer > 0) {
                ctx.globalAlpha = 0.9;
                ctx.fillStyle = "#FF0000";
                ctx.beginPath();
                let progress = (piece.timer * Math.PI * 2) / LOCK_TIMER;
                ctx.moveTo(x + TILE_WIDTH / 2, y + TILE_HEIGHT / 2);
                ctx.arc(
                    x + TILE_WIDTH / 2,
                    y + TILE_HEIGHT / 2,
                    TILE_WIDTH / 3,
                    0, progress);
                ctx.fill();


                //ctx.closePath();
            }
        }
    }
}