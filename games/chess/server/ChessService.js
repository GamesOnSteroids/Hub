var Chess;
(function (Chess) {
    var Server;
    (function (Server) {
        "use strict";
        var GameService = Play.Server.GameService;
        var MessageId = Chess.MessageId;
        var CreatePieceMessage = Chess.CreatePieceMessage;
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
            start() {
                this.chessBoard.initialize(this.players);
                for (let piece of this.chessBoard.pieces) {
                    this.createPiece(piece);
                }
            }
            update(delta) {
                for (let piece of this.chessBoard.pieces) {
                    if (piece.goal != undefined) {
                        let length = Math.length(piece.start.x, piece.start.y, piece.goal.x, piece.goal.y);
                        piece.movementProgress += (delta * Chess.MOVEMENT_SPEED) / length;
                        if (piece.movementProgress > 1) {
                            piece.movementProgress = 1;
                        }
                        piece.x = Math.round(Math.lerp(piece.start.x, piece.goal.x, piece.movementProgress));
                        piece.y = Math.round(Math.lerp(piece.start.y, piece.goal.y, piece.movementProgress));
                        if (piece.type != Chess.PieceType.Knight || piece.movementProgress == 1) {
                            let collision = this.chessBoard.pieces.find(p => p.x == piece.x && p.y == piece.y && p.id != piece.id);
                            if (collision != undefined) {
                                this.destroyPiece(collision);
                                let score = ChessService.scores.get(piece.type);
                                this.lobby.broadcast(new Chess.ScoreMessage(piece.owner.id, score));
                            }
                        }
                        if (piece.movementProgress == 1) {
                            piece.goal = undefined;
                            piece.start = undefined;
                            piece.movementProgress = 0;
                            piece.timer = Chess.LOCK_TIMER;
                        }
                    }
                    if (piece.timer > 0) {
                        piece.timer -= delta * (1 / 1000);
                    }
                }
            }
            destroyPiece(piece) {
                this.chessBoard.pieces.splice(this.chessBoard.pieces.indexOf(piece), 1);
                this.lobby.broadcast(new Chess.DestroyPieceMessage(piece.id));
                if (piece.type == Chess.PieceType.King) {
                    this.gameOver();
                }
            }
            gameOver() {
                this.lobby.gameOver();
            }
            onMovePieceRequest(player, message) {
                let piece = this.chessBoard.pieces.find(p => p.id == message.pieceId);
                if (piece != undefined) {
                    piece.goTo(message.x, message.y);
                    this.lobby.broadcast(new Chess.MovePieceMessage(piece.id, message.x, message.y));
                }
            }
            createPiece(piece) {
                this.lobby.broadcast(new CreatePieceMessage(piece.x, piece.y, piece.id, piece.type, piece.owner.id, piece.direction));
            }
        }
        ChessService.scores = new Map([
            [Chess.PieceType.Pawn, 100],
            [Chess.PieceType.Rook, 500],
            [Chess.PieceType.Bishop, 300],
            [Chess.PieceType.Knight, 300],
            [Chess.PieceType.Queen, 900],
            [Chess.PieceType.King, 1000]
        ]);
        Server.ChessService = ChessService;
    })(Server = Chess.Server || (Chess.Server = {}));
})(Chess || (Chess = {}));
//# sourceMappingURL=ChessService.js.map