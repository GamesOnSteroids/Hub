module Play.Client {
    "use strict";
    import IConnection = Play.Server.IConnection;

    export enum LobbyState {
        IN_LOBBY,
        GAME_RUNNING,
        GAME_OVER
    }

    export class ClientLobby {
        static current:ClientLobby;

        public game:Game;
        protected messageHandlers:Array<Array<(msg:IMessage)=>void>>;

        public clientGUID:string;
        public localPlayer:PlayerInfo;
        public players:PlayerInfo[] = [];

        public configuration:any;

        public serverConnection:IConnection;


        public state:LobbyState = LobbyState.IN_LOBBY;
        public changeListener:(value:ClientLobby, completed: ()=>void)=> void;

        public lobbyId:string;

        constructor(lobbyId:string) {
            this.lobbyId = lobbyId;

            this.messageHandlers = [];
            this.messageHandlers[ServiceType.Lobby] = [];
            this.messageHandlers[ServiceType.Game] = [];

            this.on<GameStartMessage>(ServiceType.Lobby, LobbyMessageId.SMSG_GAME_START, this.onGameStart.bind(this));
            this.on<PlayerJoinedMessage>(ServiceType.Lobby, LobbyMessageId.SMSG_PLAYER_JOINED, this.onJoin.bind(this));
            this.on<GameOverMessage>(ServiceType.Lobby, LobbyMessageId.SMSG_GAME_OVER, this.onGameOver.bind(this));
            this.on<PlayerReadyMessage>(ServiceType.Lobby, LobbyMessageId.SMSG_PLAYER_READY, this.onPlayerReady.bind(this));


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


        private emitChange(completed?: ()=>void) {
            if (this.changeListener != null) {
                this.changeListener(this, completed);
            }
        }

        backToLobby() {
            this.state = LobbyState.IN_LOBBY;
            this.emitChange(() => {
                this.ready();
            });
        }

        join() {

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


            this.game = new Minesweeper.Client.MinesweeperGame(this);

            this.state = LobbyState.GAME_RUNNING;
            this.emitChange();
        }

        onJoin(message:PlayerJoinedMessage) {
            console.log("ClientLobby.onJoin");

            let player = new PlayerInfo();
            player.gameData = {};
            player.id = message.playerId;
            player.name = message.name;
            player.team = message.team;

            this.players.push(player);

            if (message.isYou) {
                this.configuration = message.configuration;
                this.localPlayer = player;
            }


            this.emitChange();
        }
    }


}