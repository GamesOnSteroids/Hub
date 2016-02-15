module Play {
    import MinesweeperService = Minesweeper.Service.MinesweeperService;

    export interface ILobbyService {
        findLobby(gameConfiguration):Promise<Lobby>;
    }

    export abstract class LobbyService implements ILobbyService {
        abstract findLobby(gameConfiguration):Promise<Lobby>;

        public lobby: Lobby;


        onJoin(client:Client, message:JoinMessage) {

            let c = new Client();
            c.id = message.clientId;
            c.name = message.name;
            c.team = message.team;

            this.lobby.clients.push(c);

            if (c.id == this.lobby.clientGUID) {
                this.lobby.localClient = c;
            }
        }

        onJoinRequest(client:Client, msg: JoinRequestMessage) {
            client.name = msg.name;
            client.team = msg.team;

            for (let other of this.lobby.clients) {
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
            this.lobby.broadcast(<GameStartMessage>{
                service: ServiceType.Lobby,
                id: LobbyMessageId.SMSG_GAME_START,
                configuration: this.lobby.configuration
            });
        }

    }

    export class FirebaseLobbyService extends LobbyService{

        findLobby(configuration):Promise<Lobby> {
            return new Promise<Lobby>((resolve, reject) => {
                let firebase = new Firebase("https://fiery-inferno-1131.firebaseio.com/");
                let lobbiesRef = firebase.child("lobby");

                // no desired game
                if (configuration.lobbyId == null) {

                    lobbiesRef.once("value", (snapshot) => {
                        let lobbyRef:Firebase = null;
                        let found = snapshot.forEach((snapshot) => {
                            let value = snapshot.val();
                            if (Object.keys(value.playerCount).length < value.maxPlayers) {
                                lobbyRef = snapshot.ref();
                                return true;
                            }
                        });
                        if (!found) {

                            let lobbyDescription = {
                                playerCount: 1,
                                maxPlayers: configuration.maxPlayers,
                                gameId: configuration.gameId,
                                createdAt: new Date(),
                            };

                            let lobbyRef = lobbiesRef.push();
                            lobbyRef.set(lobbyDescription);

                            configuration.lobbyId = lobbyRef.key();
                            let lobby = this.lobby = new Lobby(configuration);
                            lobby.clientGUID = guid();


                            lobby.on(ServiceType.Lobby, LobbyMessageId.CMSG_JOIN_REQUEST, this.onJoinRequest.bind(this));

                            let localClient = lobby.localClient = new Client();
                            localClient.id = lobby.clientGUID;
                            localClient.name = "server";
                            localClient.team = 0;

                            let localConnection = new LocalConnection();
                            localConnection.messageHandler = (msg) => { lobby.onMessage(localClient, msg); };

                            localClient.connection = localConnection;
                            lobby.serverConnection = localConnection;

                            lobby.clients.push(localClient);

                            let gameService = new MinesweeperService(lobby);

                            let signalingService = new FirebaseSignalingService();
                            signalingService.createSignalingServer(lobby);

                            resolve(lobby);
                        } else {
                            configuration.lobbyId = lobbyRef.key();
                            let lobby = this.lobby =  new Lobby(configuration);
                            lobby.clientGUID = guid();
                            lobby.on(ServiceType.Lobby, LobbyMessageId.SMSG_JOIN, this.onJoin.bind(this));

                            let signalingService = new FirebaseSignalingService();
                            signalingService.createSignalingClient(lobby);

                            resolve(lobby);
                        }
                    });

                } else {
                    //let lobbyRef = lobbies.child(configuration.lobbyId);
                    throw "Not implemented";
                }
            });
        }

    }

}