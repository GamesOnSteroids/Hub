var Minesweeper;
(function (Minesweeper) {
    "use strict";
    (function (MessageId) {
        MessageId[MessageId["CMSG_REVEAL_REQUEST"] = 1] = "CMSG_REVEAL_REQUEST";
        MessageId[MessageId["SMSG_REVEAL"] = 2] = "SMSG_REVEAL";
        MessageId[MessageId["CMSG_FLAG_REQUEST"] = 3] = "CMSG_FLAG_REQUEST";
        MessageId[MessageId["SMSG_FLAG"] = 4] = "SMSG_FLAG";
        MessageId[MessageId["CMSG_MASS_REVEAL_REQUEST"] = 5] = "CMSG_MASS_REVEAL_REQUEST";
        MessageId[MessageId["SMSG_SCORE"] = 6] = "SMSG_SCORE";
    })(Minesweeper.MessageId || (Minesweeper.MessageId = {}));
    var MessageId = Minesweeper.MessageId;
})(Minesweeper || (Minesweeper = {}));
//# sourceMappingURL=messages.js.map