module Play {

    export class ClientLobby {
        static current:ClientLobby;

        public game:Game;
        protected messageHandlers:Array<Array<(msg:IMessage)=>void>>;

        public clientGUID:string;
        public localClient:Client;
        public clients:Client[] = [];

        public configuration:any;

        public serverConnection:IConnection;

        public gameStarted = false;
        public gameStartedCallback:()=>void;

        public lobbyId: string;

        constructor(lobbyId:string) {
            this.lobbyId = lobbyId;

            this.messageHandlers = [];
            this.messageHandlers[ServiceType.Lobby] = [];
            this.messageHandlers[ServiceType.Game] = [];

            this.on(ServiceType.Lobby, LobbyMessageId.SMSG_GAME_START, this.onGameStart.bind(this));
            this.on(ServiceType.Lobby, LobbyMessageId.SMSG_JOIN, this.onJoin.bind(this));
        }

        sendToServer<T extends IMessage>(msg:T) {
            this.serverConnection.send(msg);
        }

        on(service:ServiceType, messageId:number, callback:(msg:IMessage) => void) {
            this.messageHandlers[service][messageId] = callback;
        }


        public onMessage(msg:IMessage) {
            let handler = this.messageHandlers[msg.service][msg.id];
            if (handler != null) {
                handler(msg);
            }
        }

        onGameStart(message:GameStartMessage) {
            console.log("ClientLobby.onGameStart");

            this.gameStarted = true;
            if (this.gameStartedCallback != null) {
                this.gameStartedCallback();
            }
        }

        onJoin(message:JoinMessage) {
            console.log("ClientLobby.onJoin");

            let c = new Client();
            c.id = message.clientId;
            c.name = message.name;
            c.team = message.team;

            this.clients.push(c);

            if (message.isYou) {
                this.configuration = message.configuration;
                this.localClient = c;
            }
        }
    }


}