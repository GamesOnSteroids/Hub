module Play {
    "use strict";

    export enum ServiceType {
        Lobby = 1,
        Game = 2,
        Chat = 3,
    }

    export enum LobbyMessageId {
        CMSG_JOIN_REQUEST = 1,
        SMSG_PLAYER_JOINED = 2,
        SMSG_GAME_START = 3,
        SMSG_GAME_OVER = 4,
        CMSG_READY = 5,
        SMSG_PLAYER_READY = 6,
    }


    export interface IMessage {
        service: ServiceType;
        id: number;
    }

    export interface GameOverMessage extends IMessage {

    }


    export interface ReadyMessage extends IMessage {

    }

    export interface PlayerReadyMessage extends IMessage {
        playerId: string;
    }

    export interface JoinRequestMessage extends IMessage {
        name: string;
        team: number;
    }

    export interface PlayerJoinedMessage extends IMessage {
        playerId: string;
        name: string;
        team: number;
        configuration?:any;
        isYou?: boolean;
    }

    export interface GameStartMessage extends IMessage {

    }
}