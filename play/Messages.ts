module Play {
    "use strict";

    export class LobbyConfiguration {
        // lobbyId
        public lobbyId: string;
        public gameId: string;

        public appClass: any;
        public gameClass: any;
        public serviceClass: any;

        public maxPlayers: number;

        public gameConfiguration: any;
    }

    export interface GameMessage {
        id: number;
    }

    export enum ServiceType {
        Lobby = 1,
        Game = 2
    }

    export enum LobbyMessageId {
        CMSG_JOIN_REQUEST = 1,
        SMSG_PLAYER_JOINED = 2,
        SMSG_GAME_START = 3,
        SMSG_GAME_OVER = 4,
        CMSG_READY = 5,
        SMSG_PLAYER_READY = 6,
        CMSG_CHAT = 7,
        SMSG_PLAYER_CHAT = 8
    }


    export interface IMessage {
        service: ServiceType;
        id: number;
    }

    export interface ChatMessage extends IMessage {
        text: string
    }
    export interface PlayerChatMessage extends IMessage {
        playerId: string;
        text: string;
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