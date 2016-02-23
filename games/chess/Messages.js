var Chess;
(function (Chess) {
    "use strict";
    var GameMessage = Play.GameMessage;
    Chess.LOCK_TIMER = 3;
    Chess.MOVEMENT_SPEED = 1 / (1000 * 0.5);
    (function (PieceType) {
        PieceType[PieceType["Pawn"] = 1] = "Pawn";
        PieceType[PieceType["Rook"] = 2] = "Rook";
        PieceType[PieceType["Knight"] = 3] = "Knight";
        PieceType[PieceType["Bishop"] = 4] = "Bishop";
        PieceType[PieceType["Queen"] = 5] = "Queen";
        PieceType[PieceType["King"] = 6] = "King";
    })(Chess.PieceType || (Chess.PieceType = {}));
    var PieceType = Chess.PieceType;
    (function (MessageId) {
        MessageId[MessageId["SMSG_CREATE_PIECE"] = 1] = "SMSG_CREATE_PIECE";
        MessageId[MessageId["CMSG_MOVE_PIECE_REQUEST"] = 2] = "CMSG_MOVE_PIECE_REQUEST";
        MessageId[MessageId["SMSG_MOVE_PIECE"] = 3] = "SMSG_MOVE_PIECE";
        MessageId[MessageId["SMSG_DESTROY_PIECE"] = 4] = "SMSG_DESTROY_PIECE";
        MessageId[MessageId["SMSG_SCORE"] = 5] = "SMSG_SCORE";
    })(Chess.MessageId || (Chess.MessageId = {}));
    var MessageId = Chess.MessageId;
    class ScoreMessage extends GameMessage {
        constructor(playerId, score) {
            super(MessageId.SMSG_SCORE);
            this.playerId = playerId;
            this.score = score;
        }
    }
    Chess.ScoreMessage = ScoreMessage;
    class CreatePieceMessage extends GameMessage {
        constructor(x, y, pieceId, pieceType, playerId, direction) {
            super(MessageId.SMSG_CREATE_PIECE);
            this.x = x;
            this.y = y;
            this.pieceId = pieceId;
            this.pieceType = pieceType;
            this.playerId = playerId;
            this.direction = direction;
        }
    }
    Chess.CreatePieceMessage = CreatePieceMessage;
    class MovePieceRequestMessage extends GameMessage {
        constructor(pieceId, x, y) {
            super(MessageId.CMSG_MOVE_PIECE_REQUEST);
            this.pieceId = pieceId;
            this.x = x;
            this.y = y;
        }
    }
    Chess.MovePieceRequestMessage = MovePieceRequestMessage;
    class MovePieceMessage extends GameMessage {
        constructor(pieceId, x, y) {
            super(MessageId.SMSG_MOVE_PIECE);
            this.pieceId = pieceId;
            this.x = x;
            this.y = y;
        }
    }
    Chess.MovePieceMessage = MovePieceMessage;
    class DestroyPieceMessage extends GameMessage {
        constructor(pieceId) {
            super(MessageId.SMSG_DESTROY_PIECE);
            this.pieceId = pieceId;
        }
    }
    Chess.DestroyPieceMessage = DestroyPieceMessage;
})(Chess || (Chess = {}));
//# sourceMappingURL=Messages.js.map