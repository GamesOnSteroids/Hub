namespace Chess.Server {
    "use strict";

    import IPlayerInfo = Play.IPlayerInfo;
    import GameService = Play.Server.GameService;
    import ServerLobby = Play.Server.ServerLobby;
    import MessageId = Chess.MessageId;
    import CreatePieceMessage = Chess.CreatePieceMessage;


    export class ChessService extends GameService<IChessVariant, IChessPlayer> {

        private static scores = new Map<PieceType, number>(
            [
                [PieceType.Pawn, 100],
                [PieceType.Rook, 500],
                [PieceType.Bishop, 300],
                [PieceType.Knight, 300],
                [PieceType.Queen, 900],
                [PieceType.King, 1000]
            ]
        );

        private chessBoard: ChessBoard;

        constructor(lobby: ServerLobby) {
            super(lobby);

            if (this.variant.boardType == "4player") {
                this.chessBoard = new FourPlayerChessBoard();
            } else {
                this.chessBoard = new TwoPlayerChessBoard();
            }

            this.on(MessageId.CMSG_MOVE_PIECE_REQUEST, this.onMovePieceRequest.bind(this));

        }

        public start(): void {
            this.chessBoard.initialize(this.players);
            for (let piece of this.chessBoard.pieces) {
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

        protected update(delta: number): void {
            for (let piece of this.chessBoard.pieces) {
                if (piece.goal != null) {

                    let length = MathUtils.length(piece.start.x, piece.start.y, piece.goal.x, piece.goal.y);
                    piece.movementProgress += (delta * MOVEMENT_SPEED) / length;
                    if (piece.movementProgress > 1) {
                        piece.movementProgress = 1;
                    }

                    piece.x = Math.round(MathUtils.lerp(piece.start.x, piece.goal.x, piece.movementProgress));
                    piece.y = Math.round(MathUtils.lerp(piece.start.y, piece.goal.y, piece.movementProgress));

                    if (piece.type != PieceType.Knight || piece.movementProgress == 1) {
                        let collision = this.chessBoard.pieces.find(p => p.x == piece.x && p.y == piece.y && p.id != piece.id);

                        if (collision != null) {
                            this.destroyPiece(collision);

                            let score = ChessService.scores.get(piece.type);
                            piece.owner.gameData.score += score;
                            this.lobby.broadcast(new ScoreMessage(piece.owner.id, score));
                        }
                    }

                    if (piece.movementProgress == 1) {
                        piece.goal = null;
                        piece.start = null;
                        piece.movementProgress = 0;
                        piece.timer = LOCK_TIMER;

                        if (piece.type == PieceType.Pawn) {
                            let pawn = piece as Pawn;
                            if (pawn.direction == Direction4.Up && pawn.y == 0 ||
                                pawn.direction == Direction4.Down && pawn.y == this.chessBoard.size - 1 ||
                                pawn.direction == Direction4.Left && pawn.x == 0 ||
                                pawn.direction == Direction4.Right && pawn.x == this.chessBoard.size - 1) {
                                this.destroyPiece(piece);

                                let promotion = new Queen(pawn.id, pawn.x, pawn.y, pawn.owner);
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

        private destroyPiece(piece: ChessPiece): void {
            this.chessBoard.pieces.splice(this.chessBoard.pieces.indexOf(piece), 1);
            this.lobby.broadcast(new DestroyPieceMessage(piece.id));
            if (piece.type == PieceType.King) {
                piece.owner.gameData.isAlive = false;
                let i = 0;
                while (i < this.chessBoard.pieces.length) {
                    let otherPiece = this.chessBoard.pieces[i];
                    if (otherPiece.owner == piece.owner) {
                        this.destroyPiece(otherPiece);
                    } else {
                        i++;
                    }
                }

                let alivePlayers = this.players.filter(p => p.gameData.isAlive).length;
                if (alivePlayers <= 1) {
                    this.gameOver();
                }
            }
        }

        private gameOver(): void {
            this.lobby.gameOver();
        }


        private onMovePieceRequest(player: IPlayerInfo<IChessPlayer>, message: MovePieceRequestMessage): void {
            let piece = this.chessBoard.pieces.find(p => p.id == message.pieceId);
            if (piece != null) {
                // todo: check if move is valid
                piece.goTo(message.x, message.y);
                this.lobby.broadcast(new MovePieceMessage(piece.id, message.x, message.y));
            }
        }

        private createPiece(piece: ChessPiece): void {
            this.lobby.broadcast(new CreatePieceMessage(piece.x, piece.y, piece.id, piece.type, piece.owner.id, (piece as Pawn).direction));
        }


    }
}
