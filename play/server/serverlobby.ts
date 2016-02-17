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
        public state: LobbyState = LobbyState.IN_LOBBY;
        public gameService: GameService;

        constructor(lobbyId:string, configuration:any) {

            this.lobbyId = lobbyId;
            this.configuration = configuration;


            this.messageHandlers = [];
            this.messageHandlers[ServiceType.Lobby] = [];
            this.messageHandlers[ServiceType.Game] = [];


            this.on<JoinRequestMessage>(ServiceType.Lobby, LobbyMessageId.CMSG_JOIN_REQUEST, this.onJoinRequest.bind(this));
            this.on<ReadyMessage>(ServiceType.Lobby, LobbyMessageId.CMSG_READY, this.onReady.bind(this));
        }


        on<T extends IMessage>(service:ServiceType, messageId:number, callback:(client:Client, msg:T) => void) {
            this.messageHandlers[service][messageId] = callback;
        }


        public onMessage(client:Client, msg:IMessage) {
            let handler = this.messageHandlers[msg.service][msg.id];
            if (handler != null) {
                handler(client, msg);
            }
        }

        broadcast<T extends IMessage>(msg:T):void {
            for (let client of this.clients) {
                client.connection.send(msg);
            }
        }


        gameOver() {
            for (let client of this.clients) {
                client.isReady = false;
            }
            this.broadcast<GameOverMessage>({service: ServiceType.Lobby, id: LobbyMessageId.SMSG_GAME_OVER});

            this.state = LobbyState.IN_LOBBY;
            this.messageHandlers[ServiceType.Game] = [];
        }


        startGame() {
            this.gameService = new Minesweeper.Service.MinesweeperService(this);
            this.state = LobbyState.GAME_RUNNING;
            this.broadcast(<GameStartMessage>{
                service: ServiceType.Lobby,
                id: LobbyMessageId.SMSG_GAME_START
            });
        }



        onReady(client: Client, msg:ReadyMessage) {
            console.log("ServerLobby.onReady");
            if (this.state != LobbyState.IN_LOBBY) {
                return;
            }
            client.isReady = true;

            let readyCount = 0;
            for (let c of this.clients) {
                if (c.isReady) {
                    readyCount++;
                }
            }

            if (readyCount == this.configuration.maxPlayers) {
                this.startGame();
            }
        }

        onJoinRequest(client:Client, msg:JoinRequestMessage) {
            console.log("ServerLobby.onJoinRequest");
//TODO: if the game is already running, disconnect client

            client.name = msg.name;
            client.team = this.clients.indexOf(client);

            for (let other of this.clients) {
                if (other.id == client.id) {
                    client.connection.send(<PlayerJoinedMessage>{
                        service: ServiceType.Lobby,
                        id: LobbyMessageId.SMSG_PLAYER_JOINED,
                        name: other.name,
                        playerId: other.id,
                        team: other.team,
                        isYou: true,
                        configuration: this.configuration
                    });
                } else {
                    client.connection.send(<PlayerJoinedMessage>{
                        service: ServiceType.Lobby,
                        id: LobbyMessageId.SMSG_PLAYER_JOINED,
                        name: other.name,
                        playerId: other.id,
                        team: other.team,
                        isReady: other.isReady
                    }); // send other players to connecting player

                    other.connection.send(<PlayerJoinedMessage> {
                        service: ServiceType.Lobby,
                        id: LobbyMessageId.SMSG_PLAYER_JOINED,
                        name: client.name,
                        playerId: client.id,
                        team: client.team
                    }); // send connecting player to other players
                }
            }


            //TODO: inject this
            new FirebaseLobbyService().onClientJoined(this, client);
        }
    }
}