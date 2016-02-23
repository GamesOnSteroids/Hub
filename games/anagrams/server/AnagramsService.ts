namespace Anagrams.Server {
    "use strict";

    import GameService = Play.Server.GameService;
    import ServerLobby = Play.Server.ServerLobby;
    import Client = Play.Server.Client;

    export class AnagramsService extends GameService {

        constructor(lobby:ServerLobby) {
            super(lobby);

            this.on(MessageId.CMSG_WORD_GUESS, this.onWordGuess.bind(this));
        }

        private onWordGuess(player:Client, message:WordGuessMessage): void {
            // todo: implement
        }

        private randomChar(value: string): string {
            return value[(Math.random() * value.length) | 0];
        }

        private generateLetters(): void {
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

            this.lobby.broadcast(new LettersMessage(letters));
        }

        public start(): void {
            this.generateLetters();
        }

    }
}