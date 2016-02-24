var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
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