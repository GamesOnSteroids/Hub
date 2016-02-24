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
                this.lobby.broadcast(new Anagrams.LettersMessage(letters));
            }
            start() {
                this.generateLetters();
            }
        }
        Server.AnagramsService = AnagramsService;
    })(Server = Anagrams.Server || (Anagrams.Server = {}));
})(Anagrams || (Anagrams = {}));
//# sourceMappingURL=AnagramsService.js.map