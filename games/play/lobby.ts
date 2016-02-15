module Play {
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


    export class Service {
        public lobby:Lobby;

        constructor(lobby:Lobby) {
            this.lobby = lobby;
        }
    }

    class ChatService extends Service {

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
    }

    export interface GameStartMessage extends IMessage {
        configuration: any;
    }

    export class Lobby {
        static current:Lobby;

        public game:Game;
        protected messageHandlers;

        public clientGUID: string;
        public localClient:Client;
        public clients:Client[] = [];

        public configuration: any;

        public serverConnection: IConnection;


        constructor(configuration) {
            Lobby.current = this;

            this.configuration = configuration;


            this.messageHandlers = [];
            this.messageHandlers[ServiceType.Lobby] = [];
            this.messageHandlers[ServiceType.Game] = [];

            this.on(ServiceType.Lobby, LobbyMessageId.SMSG_GAME_START, this.onGameStart.bind(this));
        }

        sendToServer<T extends IMessage>(msg:T) {
            this.serverConnection.send(msg);
        }

        onGameStart(client:Client, message:GameStartMessage) {
            console.log("game start");
            this.configuration = message.configuration;

            ReactRouter.browserHistory.pushState({}, '/minesweeper');
        }


        on(service:ServiceType, messageId:number, callback:(client:Client, msg:IMessage) => void) {
            this.messageHandlers[service][messageId] = callback;
        }



        public onMessage(client:Client, msg:IMessage) {
            console.log("onMessage", msg);
            let handler = this.messageHandlers[msg.service][msg.id];
            if (handler != null) {
                handler(client, msg);
            }
        }

        broadcast(msg): void {
            for (let client of this.clients) {
                client.connection.send(msg);
            }
        }

    }
}