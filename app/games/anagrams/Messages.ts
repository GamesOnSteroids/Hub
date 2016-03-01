namespace Anagrams {
    "use strict";

    import IGameVariant = Play.IGameVariant;
    import GameMessage = Play.GameMessage;

    export interface IAnagramsVariant extends IGameVariant{

    }

    export enum MessageId {
        CMSG_WORD_GUESS = 1,
        SMSG_WORD = 2,
        SMSG_INVALID_WORD = 3,
        SMSG_LETTERS = 4
    }

    export class LettersMessage extends GameMessage {
        constructor(public letters: string) {
            super(MessageId.SMSG_LETTERS);
        }
    }
    export class WordGuessMessage extends GameMessage {
        constructor(public word: string) {
            super(MessageId.CMSG_WORD_GUESS);
        }
    }

    export class InvalidWordMessage extends GameMessage {
    }

    export class WordMessage extends GameMessage {
        constructor(public word: string,
                    public playerId: string) {
            super(MessageId.SMSG_WORD);
        }
    }
}
