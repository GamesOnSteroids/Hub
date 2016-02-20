var Anagrams;
(function (Anagrams) {
    var Server;
    (function (Server) {
        "use strict";
        var GameService = Play.Server.GameService;
        class AnagramsService extends GameService {
            constructor(lobby) {
                super(lobby);
                this.on(Anagrams.MessageId.CMSG_WORD_GUESS, this.onWordGuess.bind(this));
            }
            onWordGuess(player, message) {
            }
            randomChar(value) {
                return value[(Math.random() * value.length) | 0];
            }
            generateLetters() {
                let vowels = "aeiouy";
                let conosants = "bcdfghjklmnpqrtsvwx";
                let letters = "";
                letters += this.randomChar(vowels);
                letters += this.randomChar(vowels);
                letters += this.randomChar(vowels);
                letters += this.randomChar(vowels);
                letters += this.randomChar(conosants);
                letters += this.randomChar(conosants);
                letters += this.randomChar(conosants);
                letters += this.randomChar(conosants);
                letters += this.randomChar(conosants);
                this.broadcast({
                    id: Anagrams.MessageId.SMSG_LETTERS,
                    letters: letters
                });
            }
            start() {
                this.generateLetters();
            }
        }
        Server.AnagramsService = AnagramsService;
    })(Server = Anagrams.Server || (Anagrams.Server = {}));
})(Anagrams || (Anagrams = {}));
//# sourceMappingURL=AnagramsService.js.map