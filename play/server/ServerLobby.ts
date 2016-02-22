module Play.Server {
    "use strict";

    export enum LobbyState {
        IN_LOBBY,
        GAME_RUNNING,
        GAME_OVER
    }


    class ChatService extends Service {

    }


    export class ServerLobby {

        public clients: Client[] = [];

        public configuration: LobbyConfiguration;
        public lobbyId: string;
        public state: LobbyState = LobbyState.IN_LOBBY;
        public gameService: GameService;

        private messageHandlers = new Map<ServiceType, Map<number, (client: Client, msg: Message) => void>>([
            [ServiceType.Lobby, new Map<number, (client: Client, msg: Message) => void>()],
            [ServiceType.Game, new Map<number, (client: Client, msg: Message) => void>()]
        ]);

        constructor(lobbyId: string, configuration: LobbyConfiguration) {

            this.lobbyId = lobbyId;
            this.configuration = configuration;

            this.on<JoinRequestMessage>(ServiceType.Lobby, LobbyMessageId.CMSG_JOIN_REQUEST, this.onJoinRequest.bind(this));
            this.on<ReadyMessage>(ServiceType.Lobby, LobbyMessageId.CMSG_READY, this.onReady.bind(this));
            this.on<ChatMessage>(ServiceType.Lobby, LobbyMessageId.CMSG_CHAT, this.onChat.bind(this));

        }


        public on<T extends Message>(service: ServiceType, messageId: number, callback: (client: Client, msg: T) => void): void {
            this.messageHandlers.get(service).set(messageId, callback);
        }


        public onMessage(client: Client, msg: Message): void {
            let handler = this.messageHandlers.get(msg.service).get(msg.id);
            if (handler != undefined) {
                handler(client, msg);
            }
        }

        /**
         * Broadcast message to all connected clients
         * @param msg Message to send
         */
        public broadcast(msg: Message): void {
            for (let client of this.clients) {
                client.connection.send(msg);
            }
        }


        public gameOver(): void {
            for (let client of this.clients) {
                client.isReady = false;
            }
            this.broadcast(new GameOverMessage());

            this.state = LobbyState.IN_LOBBY;
            this.messageHandlers.get(ServiceType.Game).clear();
        }


        public startGame(): void {
            this.gameService = new this.configuration.serviceClass(this);
            this.state = LobbyState.GAME_RUNNING;
            this.broadcast(new GameStartMessage());
            this.gameService.start();
        }


        private onChat(client: Client, msg: ChatMessage): void {
            this.broadcast(new PlayerChatMessage(client.id, msg.text));
        }

        private onReady(client: Client, msg: ReadyMessage): void {
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

        private onJoinRequest(client: Client, msg: JoinRequestMessage): void {
            console.log("ServerLobby.onJoinRequest", msg);
            // todo: if the game is already running, disconnect client

            client.name = msg.name;
            client.team = this.clients.indexOf(client);

            client.isConnected = true;

            for (let other of this.clients) {
                if (other.id == client.id) {
                    client.connection.send(new PlayerJoinedMessage(other.id, other.name, other.team, this.configuration.gameConfiguration, true));
                } else {
                    if (other.isConnected) {
                        // send other players to connecting player
                        client.connection.send(new PlayerJoinedMessage(other.id, other.name, other.team));

                        // send connecting player to other players
                        other.connection.send(new PlayerJoinedMessage(client.id, client.name, client.team));
                    }
                }
            }


            // todo: inject this
            new FirebaseLobbyService().onClientJoined(this, client);
        }
    }
}