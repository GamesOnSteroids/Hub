module Chess.Server {
    "use strict";

    import GameService = Play.Server.GameService;
    import ServerLobby = Play.Server.ServerLobby;
    import MessageId = Chess.MessageId;
    import CreatePieceMessage = Chess.CreatePieceMessage;
    import Client = Play.Server.Client;


    abstract class ChessPiece {
        public goal:{x: number, y: number};
        public start:{x: number, y: number};
        public movementProgress:number = 0;
        public timer:number = 0;

        constructor(public type:PieceType, public id:number, public x:number, public y:number, public owner:Client) {

        }
    }

    class Queen extends ChessPiece {
        constructor(id:number, x:number, y:number, owner:Client) {
            super(PieceType.Queen, id, x, y, owner);
        }
    }

    class King extends ChessPiece {
        constructor(id:number, x:number, y:number, owner:Client) {
            super(PieceType.King, id, x, y, owner);
        }
    }

    export class Knight extends ChessPiece {
        constructor(id:number, x:number, y:number, owner:Client) {
            super(PieceType.Knight, id, x, y, owner);
        }
    }

    export class Bishop extends ChessPiece {
        constructor(id:number, x:number, y:number, owner:Client) {
            super(PieceType.Bishop, id, x, y, owner);
        }
    }
    export class Rook extends ChessPiece {
        constructor(id:number, x:number, y:number, owner:Client) {
            super(PieceType.Rook, id, x, y, owner);
        }
    }

    export class Pawn extends ChessPiece {
        constructor(id:number, x:number, y:number, public direction:Direction4, owner:Client) {
            super(PieceType.Pawn, id, x, y, owner);
        }
    }

    class ChessBoard {
        pieces:ChessPiece[] = [];

        //TODO: make abstract
        initialize(service:ChessService) {
        }
    }

    class TwoPlayerChessBoard extends ChessBoard {
        constructor() {
            super();
            //this.size = 8;
        }

        initialize(service:ChessService) {
            for (let i = 0; i < 8; i++) {
                this.pieces.push(new Pawn(this.pieces.length, i, 6, Direction4.Up, service.players[0]));
                this.pieces.push(new Pawn(this.pieces.length, i, 1, Direction4.Up, service.players[1]));
            }
            for (let i = 0; i < 2; i++) {
                let row: number;
                if (i == 0) {
                    row = 7;
                } else {
                    row = 0;
                }
                this.pieces.push(new Rook(this.pieces.length, 0, row, service.players[i]));
                this.pieces.push(new Knight(this.pieces.length, 1, row, service.players[i]));
                this.pieces.push(new Bishop(this.pieces.length, 2, row, service.players[i]));
                this.pieces.push(new King(this.pieces.length, 3, row, service.players[i]));
                this.pieces.push(new Queen(this.pieces.length, 4, row, service.players[i]));
                this.pieces.push(new Bishop(this.pieces.length, 5, row, service.players[i]));
                this.pieces.push(new Knight(this.pieces.length, 6, row, service.players[i]));
                this.pieces.push(new Rook(this.pieces.length, 7, row, service.players[i]));
            }
        }
    }

    class FourPlayerChessBoard extends ChessBoard {
        constructor() {
            super();
            //this.size = 14;
        }
    }

    export class ChessService extends GameService {
        private chessBoard:ChessBoard;

        constructor(lobby:ServerLobby) {
            super(lobby);

            this.chessBoard = new TwoPlayerChessBoard();

            this.on(MessageId.CMSG_MOVE_PIECE_REQUEST, this.onMovePieceRequest.bind(this));

            window.requestAnimationFrame(this.tick);
        }

        destroyPiece(piece:ChessPiece):void {
            this.chessBoard.pieces.splice(this.chessBoard.pieces.indexOf(piece), 1);
            this.broadcast<DestroyPieceMessage>({
                id: MessageId.SMSG_DESTROY_PIECE,
                pieceId: piece.id
            });
            if (piece.type == PieceType.King) {
                this.gameOver();
            }
        }

        gameOver() {
            this.lobby.gameOver();
        }

        update(delta:number) {
            for (let piece of this.chessBoard.pieces) {
                if (piece.goal != null) {
                    if (piece.start == null) {
                        piece.start = {x: piece.x, y: piece.y};
                    }
                    let length = Math.length(piece.start.x, piece.start.y, piece.goal.x, piece.goal.y);
                    piece.movementProgress += (delta * MOVEMENT_SPEED) / length;
                    if (piece.movementProgress > 1) {
                        piece.movementProgress = 1;
                    }

                    piece.x = Math.round(Math.lerp(piece.start.x, piece.goal.x, piece.movementProgress));
                    piece.y = Math.round(Math.lerp(piece.start.y, piece.goal.y, piece.movementProgress));

                    if (piece.type != PieceType.Knight || piece.movementProgress == 1) {
                        let collision = this.chessBoard.pieces.find(p=> p.x == piece.x && p.y == piece.y && p.id != piece.id);
                        if (collision != null) {
                            this.destroyPiece(collision);
                        }
                    }

                    if (piece.movementProgress == 1) {
                        piece.goal = null;
                        piece.start = null;
                        piece.movementProgress = 0;
                        piece.timer = LOCK_TIMER;
                    }
                }
                if (piece.timer > 0) {
                    piece.timer -= delta * (1 / 1000);
                }
            }
        }

        onMovePieceRequest(player:Client, message:MovePieceRequestMessage) {
            let piece = this.chessBoard.pieces.find(p=>p.id == message.pieceId);
            if (piece != null) {
                //TODO: check if move is valid
                piece.goal = {x: message.to.x, y: message.to.y};
                this.broadcast<MovePieceMessage>({
                    id: MessageId.SMSG_MOVE_PIECE,
                    pieceId: piece.id,
                    to: {x: message.to.x, y: message.to.y}
                });
            }
        }

        createPiece(piece:ChessPiece) {
            this.broadcast<CreatePieceMessage>({
                id: MessageId.SMSG_CREATE_PIECE,
                x: piece.x,
                y: piece.y,
                pieceId: piece.id,
                type: piece.type,
                playerId: piece.owner.id
            });
        }

        start():void {
            this.chessBoard.initialize(this);
            for (let piece of this.chessBoard.pieces) {
                this.createPiece(piece);
            }

        }

    }
}