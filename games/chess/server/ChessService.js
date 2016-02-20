var Chess;
(function (Chess) {
    var Server;
    (function (Server) {
        "use strict";
        var GameService = Play.Server.GameService;
        var MessageId = Chess.MessageId;
        class ChessPiece {
            constructor(type, id, x, y, owner) {
                this.type = type;
                this.id = id;
                this.x = x;
                this.y = y;
                this.owner = owner;
                this.movementProgress = 0;
                this.timer = 0;
            }
        }
        class Queen extends ChessPiece {
            constructor(id, x, y, owner) {
                super(Chess.PieceType.Queen, id, x, y, owner);
            }
        }
        class King extends ChessPiece {
            constructor(id, x, y, owner) {
                super(Chess.PieceType.King, id, x, y, owner);
            }
        }
        class Knight extends ChessPiece {
            constructor(id, x, y, owner) {
                super(Chess.PieceType.Knight, id, x, y, owner);
            }
        }
        Server.Knight = Knight;
        class Bishop extends ChessPiece {
            constructor(id, x, y, owner) {
                super(Chess.PieceType.Bishop, id, x, y, owner);
            }
        }
        Server.Bishop = Bishop;
        class Rook extends ChessPiece {
            constructor(id, x, y, owner) {
                super(Chess.PieceType.Rook, id, x, y, owner);
            }
        }
        Server.Rook = Rook;
        class Pawn extends ChessPiece {
            constructor(id, x, y, direction, owner) {
                super(Chess.PieceType.Pawn, id, x, y, owner);
                this.direction = direction;
            }
        }
        Server.Pawn = Pawn;
        class ChessBoard {
            constructor() {
                this.pieces = [];
            }
            initialize(service) {
            }
        }
        class TwoPlayerChessBoard extends ChessBoard {
            constructor() {
                super();
            }
            initialize(service) {
                for (let i = 0; i < 8; i++) {
                    this.pieces.push(new Pawn(this.pieces.length, i, 6, Chess.Direction4.Up, service.players[0]));
                    this.pieces.push(new Pawn(this.pieces.length, i, 1, Chess.Direction4.Up, service.players[1]));
                }
                for (let i = 0; i < 2; i++) {
                    let row;
                    if (i == 0) {
                        row = 7;
                    }
                    else {
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
            }
        }
        class ChessService extends GameService {
            constructor(lobby) {
                super(lobby);
                this.chessBoard = new TwoPlayerChessBoard();
                this.on(MessageId.CMSG_MOVE_PIECE_REQUEST, this.onMovePieceRequest.bind(this));
                window.requestAnimationFrame(this.tick);
            }
            destroyPiece(piece) {
                this.chessBoard.pieces.splice(this.chessBoard.pieces.indexOf(piece), 1);
                this.broadcast({
                    id: MessageId.SMSG_DESTROY_PIECE,
                    pieceId: piece.id
                });
                if (piece.type == Chess.PieceType.King) {
                    this.gameOver();
                }
            }
            gameOver() {
                this.lobby.gameOver();
            }
            update(delta) {
                for (let piece of this.chessBoard.pieces) {
                    if (piece.goal != null) {
                        if (piece.start == null) {
                            piece.start = { x: piece.x, y: piece.y };
                        }
                        let length = Math.length(piece.start.x, piece.start.y, piece.goal.x, piece.goal.y);
                        piece.movementProgress += (delta * Chess.MOVEMENT_SPEED) / length;
                        if (piece.movementProgress > 1) {
                            piece.movementProgress = 1;
                        }
                        piece.x = Math.round(Math.lerp(piece.start.x, piece.goal.x, piece.movementProgress));
                        piece.y = Math.round(Math.lerp(piece.start.y, piece.goal.y, piece.movementProgress));
                        if (piece.type != Chess.PieceType.Knight || piece.movementProgress == 1) {
                            let collision = this.chessBoard.pieces.find(p => p.x == piece.x && p.y == piece.y && p.id != piece.id);
                            if (collision != null) {
                                this.destroyPiece(collision);
                            }
                        }
                        if (piece.movementProgress == 1) {
                            piece.goal = null;
                            piece.start = null;
                            piece.movementProgress = 0;
                            piece.timer = Chess.LOCK_TIMER;
                        }
                    }
                    if (piece.timer > 0) {
                        piece.timer -= delta * (1 / 1000);
                    }
                }
            }
            onMovePieceRequest(player, message) {
                let piece = this.chessBoard.pieces.find(p => p.id == message.pieceId);
                if (piece != null) {
                    piece.goal = { x: message.to.x, y: message.to.y };
                    this.broadcast({
                        id: MessageId.SMSG_MOVE_PIECE,
                        pieceId: piece.id,
                        to: { x: message.to.x, y: message.to.y }
                    });
                }
            }
            createPiece(piece) {
                this.broadcast({
                    id: MessageId.SMSG_CREATE_PIECE,
                    x: piece.x,
                    y: piece.y,
                    pieceId: piece.id,
                    type: piece.type,
                    playerId: piece.owner.id
                });
            }
            start() {
                this.chessBoard.initialize(this);
                for (let piece of this.chessBoard.pieces) {
                    this.createPiece(piece);
                }
            }
        }
        Server.ChessService = ChessService;
    })(Server = Chess.Server || (Chess.Server = {}));
})(Chess || (Chess = {}));
//# sourceMappingURL=ChessService.js.map