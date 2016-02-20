module Anagrams.Server {
    "use strict";

    import GameService = Play.Server.GameService;
    import ServerLobby = Play.Server.ServerLobby;
    import Client = Play.Server.Client;


    export class AnagramsService extends GameService {

        constructor(lobby:ServerLobby) {
            super(lobby);

            this.on(MessageId.CMSG_WORD_GUESS, this.onWordGuess.bind(this));
        }

        onWordGuess(player:Client, message:WordGuessMessage) {

        }

        randomChar(value: string): string {
            return value[(Math.random() * value.length) | 0];
        }

        generateLetters(): void {
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

            this.broadcast<LettersMessage>({
                id: MessageId.SMSG_LETTERS,
                letters: letters
            })
        }

        start():void {
            this.generateLetters();
        }

    }
}