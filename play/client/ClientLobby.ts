module Play.Client {
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
        static current:ClientLobby;

        public game:Game;
        protected messageHandlers:Array<Array<(msg:IMessage)=>void>>;

        public clientGUID:string;
        public localPlayer:PlayerInfo;
        public players:PlayerInfo[] = [];

        public configuration: LobbyConfiguration;

        public messageLog: ChatLog[] = [];

        public serverConnection:IConnection;


        public state:LobbyState = LobbyState.IN_LOBBY;
        public changeListener = new EventDispatcher<ClientLobby>();

        public lobbyId:string;

        constructor(lobbyId:string, configuration: LobbyConfiguration) {
            this.lobbyId = lobbyId;
            this.configuration = configuration;

            this.messageHandlers = [];
            this.messageHandlers[ServiceType.Lobby] = [];
            this.messageHandlers[ServiceType.Game] = [];

            this.on<GameStartMessage>(ServiceType.Lobby, LobbyMessageId.SMSG_GAME_START, this.onGameStart.bind(this));
            this.on<PlayerJoinedMessage>(ServiceType.Lobby, LobbyMessageId.SMSG_PLAYER_JOINED, this.onJoin.bind(this));
            this.on<GameOverMessage>(ServiceType.Lobby, LobbyMessageId.SMSG_GAME_OVER, this.onGameOver.bind(this));
            this.on<PlayerReadyMessage>(ServiceType.Lobby, LobbyMessageId.SMSG_PLAYER_READY, this.onPlayerReady.bind(this));
            this.on<PlayerChatMessage>(ServiceType.Lobby, LobbyMessageId.SMSG_PLAYER_CHAT, this.onPlayerChat.bind(this));


        }

        sendToServer<T extends IMessage>(msg:T) {
            this.serverConnection.send(msg);
        }

        on<T extends IMessage>(service:ServiceType, messageId:number, callback:(msg:T) => void) {
            this.messageHandlers[service][messageId] = callback;
        }


        onMessage(msg:IMessage) {
            let handler = this.messageHandlers[msg.service][msg.id];
            if (handler != null) {
                handler(msg);
            }
        }


        private emitChange(completed?: ()=>void): void {
            this.changeListener.dispatch(this, completed);
        }

        public sendChat(message: string): void {
            this.sendToServer<ChatMessage>({
                id: LobbyMessageId.CMSG_CHAT,
                service: ServiceType.Lobby,
                text: message
            })
        }

        public backToLobby(): void {
            this.state = LobbyState.IN_LOBBY;
            this.emitChange(() => {
                this.ready();
            });
        }

        join(): void {
            this.sendToServer<JoinRequestMessage>({
                service: ServiceType.Lobby,
                id: <number>LobbyMessageId.CMSG_JOIN_REQUEST,
                name: localStorage.getItem("nickname"),
                team: 1
            });
            this.ready();
        }

        ready() {
            console.log("ClientLobby.ready");
            // preload assets
            this.sendToServer<ReadyMessage>({service:ServiceType.Lobby, id: LobbyMessageId.CMSG_READY});
        }

        onPlayerChat(message: PlayerChatMessage) {
            let player = this.players.find(p=>p.id == message.playerId);
            this.messageLog.push(new ChatLog(new Date(), player.name, message.text));
            this.emitChange();
        }

        onPlayerReady(message: PlayerReadyMessage) {
            console.log("ClientLobby.onPlayerReady");
            let player = this.players.find(p=>p.id == message.playerId);
            player.isReady = true;
        }

        onGameOver(message:GameOverMessage) {
            console.log("ClientLobby.onGameOver");
            this.messageHandlers[ServiceType.Game] = [];
            this.state = LobbyState.GAME_OVER;
            this.emitChange();
        }

        onGameStart(message:GameStartMessage) {
            console.log("ClientLobby.onGameStart");


            this.game = new this.configuration.gameClass(this);

            this.state = LobbyState.GAME_RUNNING;
            this.emitChange();
        }

        onJoin(message:PlayerJoinedMessage) {
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