var Chess;
(function (Chess) {
    var Server;
    (function (Server) {
        "use strict";
        var GameService = Play.Server.GameService;
        var MessageId = Chess.MessageId;
        var scores = new Map([
            [Chess.PieceType.Pawn, 100],
            [Chess.PieceType.Rook, 500],
            [Chess.PieceType.Bishop, 300],
            [Chess.PieceType.Knight, 300],
            [Chess.PieceType.Queen, 900],
            [Chess.PieceType.King, 1000]
        ]);
        class ChessService extends GameService {
            constructor(lobby) {
                super(lobby);
                if (lobby.configuration.gameConfiguration.boardType == "4player") {
                    this.chessBoard = new Chess.FourPlayerChessBoard();
                }
                else {
                    this.chessBoard = new Chess.TwoPlayerChessBoard();
                }
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
                                this.broadcast({
                                    id: MessageId.SMSG_SCORE,
                                    playerId: piece.owner.id,
                                    score: scores.get(piece.type)
                                });
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
                    piece.goTo(message.x, message.y);
                    this.broadcast({
                        id: MessageId.SMSG_MOVE_PIECE,
                        pieceId: piece.id,
                        x: message.x,
                        y: message.y
                    });
                }
            }
            createPiece(piece) {
                this.broadcast({
                    id: MessageId.SMSG_CREATE_PIECE,
                    x: piece.x,
                    y: piece.y,
                    direction: piece.direction,
                    pieceId: piece.id,
                    pieceType: piece.type,
                    playerId: piece.owner.id
                });
            }
            start() {
                this.chessBoard.initialize(this.players);
                for (let piece of this.chessBoard.pieces) {
                    this.createPiece(piece);
                }
            }
        }
        Server.ChessService = ChessService;
    })(Server = Chess.Server || (Chess.Server = {}));
})(Chess || (Chess = {}));
//# sourceMappingURL=ChessService.js.map