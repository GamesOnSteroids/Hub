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


    abstract class ChessPiece {
        public timer:number = 0;
        public movementProgress:number = 0;
        public drawX:number;
        public drawY:number;
        public goal:{x: number, y: number} = null;

        constructor(public type:PieceType, public id:number, public x:number, public y:number, public owner:PlayerInfo) {
            this.drawX = x;
            this.drawY = y;
        }

        abstract getValidMoves(board:ChessBoard):IMove[];
    }
    //class Pawn extends ChessPiece {
    //    constructor(public direction:Direction4, x:number, y:number, owner:PlayerInfo) {
    //        super(PieceType.Pawn, x, y, owner);
    //    }
    //
    //    getValidMoves():{x: number, y: number}[] {
    //        return null;
    //    }
    //}

    enum MoveConstraints {
        Move,
        Fly,
        Attack,
    }

    interface IMove {
        x: number;
        y: number;
        constraints: MoveConstraints
    }
    class Queen extends ChessPiece {
        constructor(id:number, x:number, y:number, owner:PlayerInfo) {
            super(PieceType.Queen, id, x, y, owner);
        }

        addIfValid(result:IMove[], board:ChessBoard, x:number, y:number):boolean {
            if (!board.isValidPosition(x, y)) {
                return false;
            }
            let anotherPiece = board.pieces.find(p=>p.x == x && p.y == y);
            if (anotherPiece != null) {
                if (anotherPiece.owner.team == this.owner.team) {
                    return false;
                } else {
                    result.push({x: x, y: y, constraints: MoveConstraints.Attack});
                    return false;
                }
            }
            result.push({x: x, y: y, constraints: MoveConstraints.Move});
            return true;
        }

        getValidMoves(board:ChessBoard):IMove[] {
            let result:IMove[] = [];
            for (let x = this.x + 1; x < board.width; x++) {
                if (!this.addIfValid(result, board, x, this.y)) {
                    break;
                }
            }
            for (let y = this.y + 1; y < board.height; y++) {
                if (!this.addIfValid(result, board, this.x, y)) {
                    break;
                }
            }
            for (let x = this.x - 1; x >= 0; x--) {
                if (!this.addIfValid(result, board, x, this.y)) {
                    break;
                }
            }
            for (let y = this.y - 1; y >= 0; y--) {
                if (!this.addIfValid(result, board, this.x, y)) {
                    break;
                }
            }
            for (let i = 1; i < board.width; i++) {
                if (!this.addIfValid(result, board, this.x + i, this.y + i)) {
                    break;
                }
            }
            for (let i = 1; i < board.width; i++) {
                if (!this.addIfValid(result, board, this.x + i, this.y - i)) {
                    break;
                }
            }
            for (let i = 1; i < board.width; i++) {
                if (!this.addIfValid(result, board, this.x - i, this.y + i)) {
                    break;
                }
            }
            for (let i = 1; i < board.width; i++) {
                if (!this.addIfValid(result, board, this.x - i, this.y - i)) {
                    break;
                }
            }

            return result;
        }
    }

    class ChessBoard {
        public pieces:ChessPiece[] = [];
        public width:number = 8;
        public height:number = 8;

        isValidPosition(x:number, y:number):boolean {
            if (x < 0 || y < 0 || x >= 8 || y >= 8) {
                return false;
            }

            return true;
        }

        getValidMoves(piece:ChessPiece):IMove[] {
            let validMoves = piece.getValidMoves(this);
            return validMoves;
        }

        isMoveValid(piece:ChessPiece, x:number, y:number) {
            //this.getValidMoves(piece);
        }
    }

    export class ChessGame extends Game {

        private camera:Camera;

        private assets:any = {};

        private chessBoard:ChessBoard;

        constructor(lobby:ClientLobby) {
            super(lobby);

            this.load();

            this.on(MessageId.SMSG_CREATE_PIECE, this.onCreatePiece.bind(this));
            this.on(MessageId.SMSG_MOVE_PIECE, this.onMovePiece.bind(this));
            this.on(MessageId.SMSG_DESTROY_PIECE, this.onDestroyPiece.bind(this));


            this.chessBoard = new ChessBoard();
            //this.chessBoard.pieces.push(new Queen(1, 1, this.localPlayer));
            //let fakePlayer = new PlayerInfo();
            //fakePlayer.id = "321321";
            //fakePlayer.team = 1;
            //this.chessBoard.pieces.push(new Queen(4, 3, fakePlayer));
            //this.chessBoard.pieces.push(new Queen(6, 7, this.localPlayer));
            //this.chessBoard.pieces.push(new Queen(6, 3, this.localPlayer));
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

            this.assets[PieceType.Queen] = [];
            this.assets[PieceType.Queen][0] = new Image();
            this.assets[PieceType.Queen][0].src = root + "images/queen-white.png";
            this.assets[PieceType.Queen][1] = new Image();
            this.assets[PieceType.Queen][1].src = root + "images/queen-black.png";
        }

        onMovePiece(message:MovePieceMessage) {
            console.log("ChessGame.onMovePiece", message);
            let piece = this.chessBoard.pieces.find(p=>p.id == message.pieceId);
            piece.goal = {x: message.to.x, y: message.to.y};

        }

        onDestroyPiece(message:DestroyPieceMessage) {
            console.log("ChessGame.onDestroyPiece", message);
        }

        onCreatePiece(message:CreatePieceMessage) {
            let player = this.players.find(p=>p.id == message.playerId);
            if (message.type == PieceType.Queen) {
                this.chessBoard.pieces.push(new Queen(message.pieceId, message.x, message.y, player));
            } else {
                throw "Unknown piece"; //TODO: debug only
            }
        }

        lerp(v0:number, v1:number, t:number) {
            return (1 - t) * v0 + t * v1;
        }

        length(x0:number, y0:number, x1:number, y1:number) {
            return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
        }

        update(delta:number) {
            this.camera.update(delta);

            let speed = 1 / (1000 * 0.5);

            for (let piece of this.chessBoard.pieces) {
                if (piece.goal != null) {
                    let length = this.length(piece.x, piece.y, piece.goal.x, piece.goal.y);
                    piece.movementProgress += (delta * speed) / length;
                    if (piece.movementProgress > 1) {
                        piece.movementProgress = 1;
                    }

                    piece.drawX = this.lerp(piece.x, piece.goal.x, piece.movementProgress);
                    piece.drawY = this.lerp(piece.y, piece.goal.y, piece.movementProgress);

                    if (piece.movementProgress == 1) {
                        piece.x = piece.goal.x;
                        piece.y = piece.goal.y;
                        piece.goal = null;
                        piece.movementProgress = 0;
                    }
                }
            }
        }

        selectedPiece:ChessPiece = null;

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
                if (this.selectedPiece != null) {
                    console.log("MoveTo", PieceType[this.selectedPiece.type], x, y);
                    //if (this.chessBoard.isMoveValid(this.selectedPiece, x, y)) {
                    this.movePiece(this.selectedPiece, x, y);
                    this.selectedPiece = null;
                    //}
                }
                if (Mouse.button == 1) {
                    let piece = this.chessBoard.pieces.find(p=>p.x == x && p.y == y);
                    if (piece != null) {
                        if (piece.owner.id == this.localPlayer.id) {
                            console.log("Select", PieceType[piece.type], x, y);
                            this.selectedPiece = piece;
                        }
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
                let validMoves = this.chessBoard.getValidMoves(this.selectedPiece);
                for (let validMove of validMoves) {
                    if (validMove.constraints == MoveConstraints.Attack) {
                        ctx.fillStyle = "#FF3B30";
                    } else {
                        ctx.fillStyle = "#4CD964";
                    }
                    ctx.fillRect(validMove.x * TILE_WIDTH, validMove.y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
                }
            }

            ctx.globalAlpha = 1;
            for (let piece of this.chessBoard.pieces.sort((a, b) => b.y - a.y)) {
                this.drawPiece(ctx, piece);
            }
        }

        drawPiece(ctx:CanvasRenderingContext2D, piece: ChessPiece):void {
            let image = this.assets[piece.type][piece.owner.team];

            let x = piece.drawX;
            let y = piece.drawY;

            ctx.drawImage(image,
                0, 0, image.width, image.height,
                x * TILE_WIDTH - image.width / 2 + TILE_WIDTH / 2,
                y * TILE_HEIGHT + TILE_HEIGHT - image.width - TILE_HEIGHT / 4,
                image.width, image.height);
        }
    }

}