var Chess;
(function (Chess) {
    "use strict";
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
    (function (Direction4) {
        Direction4[Direction4["Left"] = 1] = "Left";
        Direction4[Direction4["Right"] = 2] = "Right";
        Direction4[Direction4["Up"] = 3] = "Up";
        Direction4[Direction4["Down"] = 4] = "Down";
    })(Chess.Direction4 || (Chess.Direction4 = {}));
    var Direction4 = Chess.Direction4;
    (function (MessageId) {
        MessageId[MessageId["SMSG_CREATE_PIECE"] = 1] = "SMSG_CREATE_PIECE";
        MessageId[MessageId["CMSG_MOVE_PIECE_REQUEST"] = 2] = "CMSG_MOVE_PIECE_REQUEST";
        MessageId[MessageId["SMSG_MOVE_PIECE"] = 3] = "SMSG_MOVE_PIECE";
        MessageId[MessageId["SMSG_DESTROY_PIECE"] = 4] = "SMSG_DESTROY_PIECE";
    })(Chess.MessageId || (Chess.MessageId = {}));
    var MessageId = Chess.MessageId;
})(Chess || (Chess = {}));
//# sourceMappingURL=Messages.js.map