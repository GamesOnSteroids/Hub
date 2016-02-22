var Anagrams;
(function (Anagrams) {
    "use strict";
    var GameMessage = Play.GameMessage;
    (function (MessageId) {
        MessageId[MessageId["CMSG_WORD_GUESS"] = 1] = "CMSG_WORD_GUESS";
        MessageId[MessageId["SMSG_WORD"] = 2] = "SMSG_WORD";
        MessageId[MessageId["SMSG_INVALID_WORD"] = 3] = "SMSG_INVALID_WORD";
        MessageId[MessageId["SMSG_LETTERS"] = 4] = "SMSG_LETTERS";
    })(Anagrams.MessageId || (Anagrams.MessageId = {}));
    var MessageId = Anagrams.MessageId;
    class LettersMessage extends GameMessage {
        constructor(letters) {
            super(MessageId.SMSG_LETTERS);
            this.letters = letters;
        }
    }
    Anagrams.LettersMessage = LettersMessage;
    class WordGuessMessage extends GameMessage {
        constructor(word) {
            super(MessageId.CMSG_WORD_GUESS);
            this.word = word;
        }
    }
    Anagrams.WordGuessMessage = WordGuessMessage;
    class InvalidWordMessage extends GameMessage {
    }
    Anagrams.InvalidWordMessage = InvalidWordMessage;
    class WordMessage extends GameMessage {
        constructor(word, playerId) {
            super(MessageId.SMSG_WORD);
            this.word = word;
            this.playerId = playerId;
        }
    }
    Anagrams.WordMessage = WordMessage;
})(Anagrams || (Anagrams = {}));
//# sourceMappingURL=Messages.js.map