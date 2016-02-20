module Anagrams {
    "use strict";

    import GameMessage = Play.GameMessage;


    export enum MessageId {
        CMSG_WORD_GUESS = 1,
        SMSG_WORD = 2,
        SMSG_INVALID_WORD = 3,
        SMSG_LETTERS = 4
    }

    export interface LettersMessage extends GameMessage {
        letters: string;
    }
    export interface WordGuessMessage extends GameMessage {
        word: string;
    }

    export interface InvalidWordMessage extends GameMessage {
    }

    export interface WordMessage extends GameMessage {
        word: string;
        playerId: string;
    }


}