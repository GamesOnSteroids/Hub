module Chess.Server {
    "use strict";

    import GameService = Play.Server.GameService;
    import ServerLobby = Play.Server.ServerLobby;
    import MessageId = Chess.MessageId;
    import CreatePieceMessage = Chess.CreatePieceMessage;
    import Client = Play.Server.Client;


    abstract class ChessPiece {
        constructor(public type:PieceType, public id:number, public x:number, public y:number, public owner:Client) {

        }
    }

    class Queen extends ChessPiece {
        constructor(id:number, x:number, y:number, owner:Client) {
            super(PieceType.Queen, id, x, y, owner);
        }
    }

    class ChessBoard {
        pieces:ChessPiece[] = [];

        //TODO: make abstract
        initialize(service:ChessService) {
        }
    }

    class TwoPlayerChessBoard extends ChessBoard {
        initialize(service:ChessService) {
            this.pieces.push(new Queen(this.pieces.length, 0, 0, service.players[0]));
            this.pieces.push(new Queen(this.pieces.length, 4, 4, service.players[0]));
        }
    }

    class FourPlayerChessBoard extends ChessBoard {

    }

    export class ChessService extends GameService {
        private chessBoard:ChessBoard;

        constructor(lobby:ServerLobby) {
            super(lobby);

            this.chessBoard = new TwoPlayerChessBoard();

            this.on(MessageId.CMSG_MOVE_PIECE_REQUEST, this.onMovePieceRequest.bind(this));
        }

        onMovePieceRequest(player:Client, message:MovePieceRequestMessage) {
            let piece = this.chessBoard.pieces.find(p=>p.id == message.pieceId);
            if (piece != null) {

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