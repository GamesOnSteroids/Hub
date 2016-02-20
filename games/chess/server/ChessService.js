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
            }
        }
        class Queen extends ChessPiece {
            constructor(id, x, y, owner) {
                super(Chess.PieceType.Queen, id, x, y, owner);
            }
        }
        class ChessBoard {
            constructor() {
                this.pieces = [];
            }
            initialize(service) {
            }
        }
        class TwoPlayerChessBoard extends ChessBoard {
            initialize(service) {
                this.pieces.push(new Queen(this.pieces.length, 0, 0, service.players[0]));
                this.pieces.push(new Queen(this.pieces.length, 4, 4, service.players[0]));
            }
        }
        class FourPlayerChessBoard extends ChessBoard {
        }
        class ChessService extends GameService {
            constructor(lobby) {
                super(lobby);
                this.chessBoard = new TwoPlayerChessBoard();
                this.on(MessageId.CMSG_MOVE_PIECE_REQUEST, this.onMovePieceRequest.bind(this));
            }
            onMovePieceRequest(player, message) {
                let piece = this.chessBoard.pieces.find(p => p.id == message.pieceId);
                if (piece != null) {
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