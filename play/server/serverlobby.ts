module Play {
    "use strict";


    export class Service {
        public lobby:ServerLobby;

        constructor(lobby:ServerLobby) {
            this.lobby = lobby;
        }
    }

    class ChatService extends Service {

    }



    export class ServerLobby {

        protected messageHandlers:Array<Array<(client:Client, msg:IMessage)=>void>>;

        public clients:Client[] = [];

        public configuration:any;

        constructor(configuration:any) {

            this.configuration = configuration;


            this.messageHandlers = [];
            this.messageHandlers[ServiceType.Lobby] = [];
            this.messageHandlers[ServiceType.Game] = [];


            this.on(ServiceType.Lobby, LobbyMessageId.CMSG_JOIN_REQUEST, this.onJoinRequest.bind(this));
        }


        on(service:ServiceType, messageId:number, callback:(client:Client, msg:IMessage) => void) {
            this.messageHandlers[service][messageId] = callback;
        }


        public onMessage(client:Client, msg:IMessage) {
            let handler = this.messageHandlers[msg.service][msg.id];
            if (handler != null) {
                handler(client, msg);
            }
        }

        broadcast(msg:IMessage):void {
            for (let client of this.clients) {
                client.connection.send(msg);
            }
        }


        onJoinRequest(client:Client, msg:JoinRequestMessage) {
            client.name = msg.name;
            client.team = msg.team;

            for (let other of this.clients) {
                client.connection.send(<JoinMessage>{
                    service: ServiceType.Lobby,
                    id: LobbyMessageId.SMSG_JOIN,
                    name: other.name,
                    clientId: other.id,
                    team: other.team
                }); // send other players to connecting player
                if (other.id != client.id) {
                    other.connection.send(<JoinMessage> {
                        service: ServiceType.Lobby,
                        id: LobbyMessageId.SMSG_JOIN,
                        name: client.name,
                        clientId: client.id,
                        team: client.team
                    }); // send connecting player to other players
                }
            }
            //TODO: for debug only
            this.broadcast(<GameStartMessage>{
                service: ServiceType.Lobby,
                id: LobbyMessageId.SMSG_GAME_START,
                configuration: this.configuration
            });

            new LobbyService().onClientJoined(this, client);
        }
    }
}