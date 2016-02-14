module Minesweeper {
    import GameMessage = Play.GameMessage;

    export enum MessageId {
        CMSG_REVEAL_REQUEST = 1,
        SMSG_REVEAL = 2,
        CMSG_FLAG_REQUEST = 3,
        SMSG_FLAG = 4,
        CMSG_MASS_REVEAL_REQUEST = 5,
        SMSG_GAME_OVER = 6,
    }


    export interface GameConfiguration {
        width: number;
        height: number;
        mines: number;
    }

    export interface GameOverMessage extends GameMessage {

    }

    export interface RevealMessage extends GameMessage {
        playerId: string;
        fieldId: number;
        adjacentMines: number;
        hasMine: boolean;
    }
    export interface FlagMessage {
        playerId: string;
        fieldId: number;
        flag: boolean;
    }


    export interface MassRevealRequestMessage extends GameMessage {
        fieldId: number;
    }

    export interface FlagRequestMessage extends GameMessage {
        fieldId: number;
        flag: boolean;
    }

    export interface RevealRequestMessage extends GameMessage {
        fieldId: number;
        doubt: boolean;
    }

}