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
        public lobbyId:string;

        constructor(lobbyId:string, configuration:any) {

            this.lobbyId = lobbyId;
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
            console.log("ServerLobby.onJoinRequest");

            client.name = msg.name;
            client.team = msg.team;

            for (let other of this.clients) {
                if (other.id == client.id) {
                    client.connection.send(<JoinMessage>{
                        service: ServiceType.Lobby,
                        id: LobbyMessageId.SMSG_JOIN,
                        name: other.name,
                        clientId: other.id,
                        team: other.team,
                        isYou: true,
                        configuration: this.configuration
                    });
                } else {
                    client.connection.send(<JoinMessage>{
                        service: ServiceType.Lobby,
                        id: LobbyMessageId.SMSG_JOIN,
                        name: other.name,
                        clientId: other.id,
                        team: other.team,
                        isReady: other.isReady
                    }); // send other players to connecting player

                    other.connection.send(<JoinMessage> {
                        service: ServiceType.Lobby,
                        id: LobbyMessageId.SMSG_JOIN,
                        name: client.name,
                        clientId: client.id,
                        team: client.team
                    }); // send connecting player to other players
                }
            }

            if (this.clients.length == this.configuration.maxPlayers) {
                //TODO: for debug only
                this.broadcast(<GameStartMessage>{
                    service: ServiceType.Lobby,
                    id: LobbyMessageId.SMSG_GAME_START
                });
            }

            //TODO: inject this
            new FirebaseLobbyService().onClientJoined(this, client);
        }
    }
}