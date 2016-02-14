module Play {
    import MinesweeperService = Minesweeper.Service.MinesweeperService;
    import MessageId = Minesweeper.MessageId;

    export class ServerLobby extends Lobby {

        private gameService:GameService;

        constructor(configuration) {
            super(configuration);

            this.clientGUID = guid();

            let localClient = this.localClient = new Client();

            localClient.id = this.clientGUID;
            localClient.name = "server";
            localClient.team = 0;
            let localConnection = new LocalConnection();
            localConnection.messageHandler = (msg) => { this.onMessage(localClient, msg); };
            localClient.connection = localConnection;

            this.clients.push(localClient);



            this.on(ServiceType.Lobby, LobbyMessageId.CMSG_JOIN_REQUEST, this.onJoinRequest.bind(this));

            this.gameService = new MinesweeperService(this);

        }


        onJoinRequest(client:Client, msg: JoinRequestMessage) {
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
        }



    }

}