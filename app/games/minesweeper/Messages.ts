namespace Minesweeper {
    "use strict";

    import GameMessage = Play.GameMessage;
    import IGameVariant = Play.IGameVariant;

    export interface IMinesweeperVariant extends IGameVariant {
        width: number;
        height: number;
        mines: number;
    }

    export enum MessageId {
        CMSG_REVEAL_REQUEST = 1,
        SMSG_REVEAL = 2,
        CMSG_FLAG_REQUEST = 3,
        SMSG_FLAG = 4,
        CMSG_MASS_REVEAL_REQUEST = 5,
        SMSG_SCORE = 6,
    }

    export class ScoreMessage extends GameMessage {
        constructor(public playerId: string,
                    public score: number) {
            super(MessageId.SMSG_SCORE);
        }
    }

    export class GameConfiguration {
        public width: number;
        public height: number;
        public mines: number;
    }


    export class RevealMessage extends GameMessage {
        constructor(public playerId: string,
                    public fieldId: number,
                    public adjacentMines: number,
                    public hasMine: boolean) {
            super(MessageId.SMSG_REVEAL);
        }
    }

    export class FlagMessage extends GameMessage {
        constructor(public playerId: string,
                    public fieldId: number,
                    public flag: boolean) {
            super(MessageId.SMSG_FLAG);
        }
    }


    export class MassRevealRequestMessage extends GameMessage {
        constructor(public fieldId: number) {
            super(MessageId.CMSG_MASS_REVEAL_REQUEST);
        }
    }

    export class FlagRequestMessage extends GameMessage {
        constructor(public fieldId: number,
                    public flag: boolean) {
            super(MessageId.CMSG_FLAG_REQUEST);
        }
    }

    export class RevealRequestMessage extends GameMessage {
        constructor(public fieldId: number,
                    public doubt: boolean) {
            super(MessageId.CMSG_REVEAL_REQUEST);
        }
    }

}