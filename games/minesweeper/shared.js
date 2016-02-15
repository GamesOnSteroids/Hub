var Minesweeper;
(function (Minesweeper) {
    (function (MessageId) {
        MessageId[MessageId["CMSG_REVEAL_REQUEST"] = 1] = "CMSG_REVEAL_REQUEST";
        MessageId[MessageId["SMSG_REVEAL"] = 2] = "SMSG_REVEAL";
        MessageId[MessageId["CMSG_FLAG_REQUEST"] = 3] = "CMSG_FLAG_REQUEST";
        MessageId[MessageId["SMSG_FLAG"] = 4] = "SMSG_FLAG";
        MessageId[MessageId["CMSG_MASS_REVEAL_REQUEST"] = 5] = "CMSG_MASS_REVEAL_REQUEST";
        MessageId[MessageId["SMSG_GAME_OVER"] = 6] = "SMSG_GAME_OVER";
    })(Minesweeper.MessageId || (Minesweeper.MessageId = {}));
    var MessageId = Minesweeper.MessageId;
})(Minesweeper || (Minesweeper = {}));
//# sourceMappingURL=shared.js.map