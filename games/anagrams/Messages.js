var Anagrams;
(function (Anagrams) {
    "use strict";
    (function (MessageId) {
        MessageId[MessageId["CMSG_WORD_GUESS"] = 1] = "CMSG_WORD_GUESS";
        MessageId[MessageId["SMSG_WORD"] = 2] = "SMSG_WORD";
        MessageId[MessageId["SMSG_INVALID_WORD"] = 3] = "SMSG_INVALID_WORD";
        MessageId[MessageId["SMSG_LETTERS"] = 4] = "SMSG_LETTERS";
    })(Anagrams.MessageId || (Anagrams.MessageId = {}));
    var MessageId = Anagrams.MessageId;
})(Anagrams || (Anagrams = {}));
//# sourceMappingURL=Messages.js.map