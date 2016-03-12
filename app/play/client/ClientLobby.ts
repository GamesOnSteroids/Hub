namespace Play.Client {
    "use strict";

    import IConnection = Play.Server.IConnection;


    export enum LobbyState {
        IN_LOBBY,
        GAME_RUNNING,
        GAME_OVER
    }

    export class ChatLog {
        public author: string;
        public date: Date;
        public text: string;

        constructor(date: Date, author: string, text: string) {
            this.date = date;
            this.author = author;
            this.text = text;
        }
    }

    export class ClientLobby {
        public static current: ClientLobby;

        public game: Game<IGameVariant, any>;

        public clientGUID: string;
        public localPlayer: PlayerInfo<any>;
        public players: PlayerInfo<any>[] = [];

        public configuration: LobbyConfiguration;

        public messageLog: ChatLog[] = [];

        public serverConnection: IConnection;

        public state: LobbyState = LobbyState.IN_LOBBY;
        public changeListener = new EventDispatcher<ClientLobby>();

        public lobbyId: string;

        private messageHandlers = new Map<ServiceType, Map<number, (msg: Message) => void>>([
            [ServiceType.Lobby, new Map<number, (msg: Message) => void>()],
            [ServiceType.Game, new Map<number, (msg: Message) => void>()]
        ]);

        constructor(lobbyId: string, configuration: LobbyConfiguration) {
            this.lobbyId = lobbyId;
            this.configuration = configuration;

            this.on<GameStartMessage>(ServiceType.Lobby, LobbyMessageId.SMSG_GAME_START, this.onGameStart.bind(this));
            this.on<PlayerJoinedMessage>(ServiceType.Lobby, LobbyMessageId.SMSG_PLAYER_JOINED, this.onJoin.bind(this));
            this.on<GameOverMessage>(ServiceType.Lobby, LobbyMessageId.SMSG_GAME_OVER, this.onGameOver.bind(this));
            this.on<PlayerReadyMessage>(ServiceType.Lobby, LobbyMessageId.SMSG_PLAYER_READY, this.onPlayerReady.bind(this));
            this.on<PlayerChatMessage>(ServiceType.Lobby, LobbyMessageId.SMSG_PLAYER_CHAT, this.onPlayerChat.bind(this));


        }

        public sendToServer<T extends Message>(msg: T): void {
            this.serverConnection.send(msg);
        }

        public on<T extends Message>(service: ServiceType, messageId: number, callback: (msg: T) => void): void {
            this.messageHandlers.get(service).set(messageId, callback);
        }


        public onMessage(msg: Message): void {
            let handler = this.messageHandlers.get(msg.service).get(msg.id);
            if (handler != null) {
                handler(msg);
            }
        }

        public sendChat(message: string): void {
            this.sendToServer(new ChatMessage(message));
        }
        public backToLobby(): void {
            this.state = LobbyState.IN_LOBBY;
            this.emitChange(() => {
                this.ready();
            });
        }

        public join(): void {
            this.sendToServer<JoinRequestMessage>({
                service: ServiceType.Lobby,
                id: <number>LobbyMessageId.CMSG_JOIN_REQUEST,
                name: localStorage.getItem("nickname"),
                team: 1,
            });
            this.ready();
        }

        public ready(): void {
            console.log("ClientLobby.ready");
            // preload assets
            this.sendToServer<ReadyMessage>({service: ServiceType.Lobby, id: LobbyMessageId.CMSG_READY});
        }

        private emitChange(completed?: () => void): void {
            this.changeListener.dispatch(this, completed);
        }

        private onPlayerChat(message: PlayerChatMessage): void {
            let player = this.players.find(p => p.id == message.playerId);
            this.messageLog.push(new ChatLog(new Date(), player.name, message.text));
            this.emitChange();
        }

        private onPlayerReady(message: PlayerReadyMessage): void {
            console.log("ClientLobby.onPlayerReady");
            let player = this.players.find(p => p.id == message.playerId);
            player.isReady = true;
            this.emitChange();
        }

        private onGameOver(message: GameOverMessage): void {
            console.log("ClientLobby.onGameOver");
            for (let player of this.players) {
                player.isReady = false;
            }
            this.messageHandlers.get(ServiceType.Game).clear();
            this.state = LobbyState.GAME_OVER;
            this.emitChange();
        }

        private onGameStart(message: GameStartMessage): void {
            console.log("ClientLobby.onGameStart");


            this.game = new (ClassUtils.resolveClass<Game<IGameVariant, any>>(this.configuration.gameConfiguration.gameClass))(this);

            this.state = LobbyState.GAME_RUNNING;
            this.emitChange();
        }

        private onJoin(message: PlayerJoinedMessage): void {
            console.log("ClientLobby.onJoin", message);

            let player = new PlayerInfo();
            player.gameData = {};
            player.id = message.playerId;
            player.name = message.name;
            player.team = message.team;

            this.players.push(player);

            if (message.isYou) {
                this.configuration.gameConfiguration = message.configuration;
                this.localPlayer = player;
            }

            this.emitChange();
        }
    }
}
