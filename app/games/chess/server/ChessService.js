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
                if (this.variant.boardType == "4player") {
                    this.chessBoard = new Chess.FourPlayerChessBoard();
                }
                else {
                    this.chessBoard = new Chess.TwoPlayerChessBoard();
                }
                this.on(MessageId.CMSG_MOVE_PIECE_REQUEST, this.onMovePieceRequest.bind(this));
            }
            start() {
                this.chessBoard.initialize(this.players);
                for (let piece of this.chessBoard.pieces) {
                    piece.timer = Chess.LOCK_TIMER;
                    this.createPiece(piece);
                }
                for (let player of this.players) {
                    player.gameData = {
                        pieces: 0,
                        score: 0,
                        isAlive: true,
                    };
                }
                window.requestAnimationFrame(this.tick);
            }
            update(delta) {
                for (let piece of this.chessBoard.pieces) {
                    if (piece.goal != null) {
                        let length = MathUtils.length(piece.start.x, piece.start.y, piece.goal.x, piece.goal.y);
                        piece.movementProgress += (delta * Chess.MOVEMENT_SPEED) / length;
                        if (piece.movementProgress > 1) {
                            piece.movementProgress = 1;
                        }
                        piece.x = Math.round(MathUtils.lerp(piece.start.x, piece.goal.x, piece.movementProgress));
                        piece.y = Math.round(MathUtils.lerp(piece.start.y, piece.goal.y, piece.movementProgress));
                        if (piece.type != Chess.PieceType.Knight || piece.movementProgress == 1) {
                            let collision = this.chessBoard.pieces.find(p => p.x == piece.x && p.y == piece.y && p.id != piece.id);
                            if (collision != null) {
                                this.destroyPiece(collision);
                                let score = ChessService.scores.get(piece.type);
                                piece.owner.gameData.score += score;
                                this.lobby.broadcast(new Chess.ScoreMessage(piece.owner.id, score));
                            }
                        }
                        if (piece.movementProgress == 1) {
                            piece.goal = null;
                            piece.start = null;
                            piece.movementProgress = 0;
                            piece.timer = Chess.LOCK_TIMER;
                            if (piece.type == Chess.PieceType.Pawn) {
                                let pawn = piece;
                                if (pawn.direction == Direction4.Up && pawn.y == 0 ||
                                    pawn.direction == Direction4.Down && pawn.y == this.chessBoard.size - 1 ||
                                    pawn.direction == Direction4.Left && pawn.x == 0 ||
                                    pawn.direction == Direction4.Right && pawn.x == this.chessBoard.size - 1) {
                                    this.destroyPiece(piece);
                                    let promotion = new Chess.Queen(pawn.id, pawn.x, pawn.y, pawn.owner);
                                    promotion.timer = Chess.LOCK_TIMER;
                                    this.chessBoard.pieces.push(promotion);
                                    this.createPiece(promotion);
                                }
                            }
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
                    piece.owner.gameData.isAlive = false;
                    let i = 0;
                    while (i < this.chessBoard.pieces.length) {
                        let otherPiece = this.chessBoard.pieces[i];
                        if (otherPiece.owner == piece.owner) {
                            this.destroyPiece(otherPiece);
                        }
                        else {
                            i++;
                        }
                    }
                    let alivePlayers = this.players.filter(p => p.gameData.isAlive).length;
                    if (alivePlayers <= 1) {
                        this.gameOver();
                    }
                }
            }
            gameOver() {
                this.lobby.gameOver();
            }
            onMovePieceRequest(player, message) {
                let piece = this.chessBoard.pieces.find(p => p.id == message.pieceId);
                if (piece != null) {
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
