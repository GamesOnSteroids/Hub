var Minesweeper;
(function (Minesweeper) {
    "use strict";
    var GameMessage = Play.GameMessage;
    (function (MessageId) {
        MessageId[MessageId["CMSG_REVEAL_REQUEST"] = 1] = "CMSG_REVEAL_REQUEST";
        MessageId[MessageId["SMSG_REVEAL"] = 2] = "SMSG_REVEAL";
        MessageId[MessageId["CMSG_FLAG_REQUEST"] = 3] = "CMSG_FLAG_REQUEST";
        MessageId[MessageId["SMSG_FLAG"] = 4] = "SMSG_FLAG";
        MessageId[MessageId["CMSG_MASS_REVEAL_REQUEST"] = 5] = "CMSG_MASS_REVEAL_REQUEST";
        MessageId[MessageId["SMSG_SCORE"] = 6] = "SMSG_SCORE";
    })(Minesweeper.MessageId || (Minesweeper.MessageId = {}));
    var MessageId = Minesweeper.MessageId;
    class ScoreMessage extends GameMessage {
        constructor(playerId, score) {
            super(MessageId.SMSG_SCORE);
            this.playerId = playerId;
            this.score = score;
        }
    }
    Minesweeper.ScoreMessage = ScoreMessage;
    class GameConfiguration {
    }
    Minesweeper.GameConfiguration = GameConfiguration;
    class RevealMessage extends GameMessage {
        constructor(playerId, fieldId, adjacentMines, hasMine) {
            super(MessageId.SMSG_REVEAL);
            this.playerId = playerId;
            this.fieldId = fieldId;
            this.adjacentMines = adjacentMines;
            this.hasMine = hasMine;
        }
    }
    Minesweeper.RevealMessage = RevealMessage;
    class FlagMessage extends GameMessage {
        constructor(playerId, fieldId, flag) {
            super(MessageId.SMSG_FLAG);
            this.playerId = playerId;
            this.fieldId = fieldId;
            this.flag = flag;
        }
    }
    Minesweeper.FlagMessage = FlagMessage;
    class MassRevealRequestMessage extends GameMessage {
        constructor(fieldId) {
            super(MessageId.CMSG_MASS_REVEAL_REQUEST);
            this.fieldId = fieldId;
        }
    }
    Minesweeper.MassRevealRequestMessage = MassRevealRequestMessage;
    class FlagRequestMessage extends GameMessage {
        constructor(fieldId, flag) {
            super(MessageId.CMSG_FLAG_REQUEST);
            this.fieldId = fieldId;
            this.flag = flag;
        }
    }
    Minesweeper.FlagRequestMessage = FlagRequestMessage;
    class RevealRequestMessage extends GameMessage {
        constructor(fieldId, doubt) {
            super(MessageId.CMSG_REVEAL_REQUEST);
            this.fieldId = fieldId;
            this.doubt = doubt;
        }
    }
    Minesweeper.RevealRequestMessage = RevealRequestMessage;
})(Minesweeper || (Minesweeper = {}));
