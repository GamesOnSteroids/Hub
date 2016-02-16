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

        public gameStarted:()=>void;

        constructor(configuration:any) {
            ClientLobby.current = this;

            this.configuration = configuration;


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
            console.log("game start");

            if (this.gameStarted != null) {
                this.gameStarted();
            }
        }

        onJoin(message:JoinMessage) {
            this.configuration = message.configuration;

            let c = new Client();
            c.id = message.clientId;
            c.name = message.name;
            c.team = message.team;

            this.clients.push(c);

            if (c.id == this.clientGUID) {
                this.localClient = c;
            }
        }
    }


}