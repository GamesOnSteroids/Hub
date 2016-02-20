module Chess {
    "use strict";

    import GameMessage = Play.GameMessage;


    export const LOCK_TIMER = 3;
    export const MOVEMENT_SPEED = 1 / (1000 * 0.5);


    export enum PieceType {
        Pawn = 1,
        Rook = 2,
        Knight = 3,
        Bishop = 4,
        Queen = 5,
        King = 6
    }


    export enum Direction4 {
        Left = 1,
        Right = 2,
        Up = 3,
        Down = 4
    }

    export enum MessageId {
        SMSG_CREATE_PIECE = 1,
        CMSG_MOVE_PIECE_REQUEST = 2,
        SMSG_MOVE_PIECE = 3,
        SMSG_DESTROY_PIECE = 4
    }

    export interface CreatePieceMessage extends GameMessage {
        x: number;
        y: number;
        pieceId: number;
        type: PieceType;
        playerId: string;
    }


    export interface MovePieceRequestMessage extends GameMessage {
        pieceId: number;
        to: {x: number, y: number};
    }

    export interface MovePieceMessage extends GameMessage {
        pieceId: number;
        to: {x: number, y: number};
    }

    export interface DestroyPieceMessage extends GameMessage {
        pieceId: number;
    }


}