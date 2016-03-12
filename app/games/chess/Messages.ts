namespace Chess {
    "use strict";

    import GameMessage = Play.GameMessage;
    import IGameVariant = Play.IGameVariant;


    export const LOCK_TIMER = 0;
    export const MOVEMENT_SPEED = 1 / (1000 * 0.5);

    export interface IChessVariant extends IGameVariant {
        boardType: string;
    }

    export interface IChessPlayer {
        score: number;
        pieces: number;
        isAlive: boolean;
    }

    export enum PieceType {
        Pawn = 1,
        Rook = 2,
        Knight = 3,
        Bishop = 4,
        Queen = 5,
        King = 6
    }


    export enum MessageId {
        SMSG_CREATE_PIECE = 1,
        CMSG_MOVE_PIECE_REQUEST = 2,
        SMSG_MOVE_PIECE = 3,
        SMSG_DESTROY_PIECE = 4,
        SMSG_SCORE = 5,
    }

    export class ScoreMessage extends GameMessage {
        constructor(public playerId: string,
                    public score: number) {
            super(MessageId.SMSG_SCORE);
        }
    }

    export class CreatePieceMessage extends GameMessage {
        constructor(public x: number,
                    public y: number,
                    public pieceId: number,
                    public pieceType: PieceType,
                    public playerId: string,
                    public direction: number) {
            super(MessageId.SMSG_CREATE_PIECE);
        }
    }


    export class MovePieceRequestMessage extends GameMessage {
        constructor(public pieceId: number,
                    public x: number,
                    public y: number) {
            super(MessageId.CMSG_MOVE_PIECE_REQUEST);
        }
    }

    export class MovePieceMessage extends GameMessage {
        constructor(public pieceId: number,
                    public x: number,
                    public y: number) {
            super(MessageId.SMSG_MOVE_PIECE);
        }
    }

    export class DestroyPieceMessage extends GameMessage {
        constructor(public pieceId: number) {
            super(MessageId.SMSG_DESTROY_PIECE);
        }
    }


}