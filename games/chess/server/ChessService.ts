module Chess.Server {
    "use strict";

    import GameService = Play.Server.GameService;
    import ServerLobby = Play.Server.ServerLobby;
    import MessageId = Chess.MessageId;
    import CreatePieceMessage = Chess.CreatePieceMessage;
    import Client = Play.Server.Client;
    import IPlayerInfo = Play.IPlayerInfo;


    var scores = new Map<PieceType, number>(
        [
            [PieceType.Pawn, 100],
            [PieceType.Rook, 500],
            [PieceType.Bishop, 300],
            [PieceType.Knight, 300],
            [PieceType.Queen, 900],
            [PieceType.King, 1000]
        ]
    );

    export class ChessService extends GameService {
        private chessBoard:ChessBoard;

        constructor(lobby:ServerLobby) {
            super(lobby);

            if (lobby.configuration.gameConfiguration.boardType == "4player") {
                this.chessBoard = new FourPlayerChessBoard();
            } else {
                this.chessBoard = new TwoPlayerChessBoard();
            }

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

                            this.broadcast<ScoreMessage>({
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
                        piece.timer = LOCK_TIMER;

                        //TODO: if this is last row, change to queen
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
                piece.goTo(message.x,  message.y);
                this.broadcast<MovePieceMessage>({
                    id: MessageId.SMSG_MOVE_PIECE,
                    pieceId: piece.id,
                    x: message.x,
                    y: message.y
                });
            }
        }

        createPiece(piece:ChessPiece) {
            this.broadcast<CreatePieceMessage>({
                id: MessageId.SMSG_CREATE_PIECE,
                x: piece.x,
                y: piece.y,
                direction: (piece as Pawn).direction,
                pieceId: piece.id,
                pieceType: piece.type,
                playerId: piece.owner.id
            });
        }

        start():void {
            this.chessBoard.initialize(this.players);
            for (let piece of this.chessBoard.pieces) {
                this.createPiece(piece);
            }

        }

    }
}