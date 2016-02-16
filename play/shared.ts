module Play {
    "use strict";

    "use strict";
    export enum ServiceType {
        Lobby = 1,
        Game = 2,
        Chat = 3,
    }

    export enum LobbyMessageId {
        CMSG_JOIN_REQUEST = 1,
        SMSG_JOIN = 2,
        SMSG_GAME_START = 3

    }



    export interface IMessage {
        service: ServiceType;
        id: number;
    }


    export interface JoinRequestMessage extends IMessage {
        name: string;
        team: number;
    }

    export interface JoinMessage extends IMessage {
        clientId: string;
        name: string;
        team: number;
        configuration: any;
    }

    export interface GameStartMessage extends IMessage {

    }
}