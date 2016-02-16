module Play {
    "use strict";
    export interface ILobbyService {
        findLobby(gameConfiguration:any):Promise<ClientLobby>;
        onClientJoined(lobby: ServerLobby, client:Client): void;
    }

    export class FirebaseLobbyService implements ILobbyService {

        onClientJoined(lobby: ServerLobby, client:Client) {

            let firebase = new Firebase("https://fiery-inferno-1131.firebaseio.com/");
            let lobbyRef = firebase.child("lobby").child(lobby.lobbyId);

            lobbyRef.transaction( (data) => {
                if (data != null) {
                    data.playerCount += 1;
                }
                return data;
            }, (error, commited, snapshot) => {
                if (error != null) {
                    console.error(error);
                }
            }, true);
        }

        findLobby(configuration:any):Promise<ClientLobby> {
            return new Promise<ClientLobby>((resolve, reject) => {
                let firebase = new Firebase("https://fiery-inferno-1131.firebaseio.com/");
                let lobbiesRef = firebase.child("lobby");

                // no desired game
                if (configuration.lobbyId == null) {

                    lobbiesRef.once("value", (snapshot) => {
                        let lobbyRef:Firebase = null;
                        let found = snapshot.forEach((snapshot) => {
                            let value = snapshot.val();
                            if (value.playerCount < value.maxPlayers) {
                                lobbyRef = snapshot.ref();
                                return true;
                            }
                        });
                        if (!found) {

                            let lobbyDescription = {
                                playerCount: 0,
                                maxPlayers: configuration.maxPlayers,
                                gameId: configuration.gameId,
                                createdAt: new Date(),
                            };

                            let lobbyRef = lobbiesRef.push();
                            lobbyRef.set(lobbyDescription, () => {

                                let lobbyId = lobbyRef.key();

                                let clientLobby = new ClientLobby(lobbyId);
                                clientLobby.clientGUID = guid();

                                let localClient = clientLobby.localClient = new Client();
                                localClient.id = clientLobby.clientGUID;
                                localClient.name = "server";
                                localClient.team = 0;


                                let serverLobby = new ServerLobby(lobbyId, configuration);

                                let gameService = new Minesweeper.Service.MinesweeperService(serverLobby);
                                //serverLobby.gameService = gameService;

                                let signalingService = new FirebaseSignalingService();
                                signalingService.createSignalingServer(serverLobby);


                                let localServerConnection = new LocalServerConnection(localClient);
                                localServerConnection.messageHandler = (client: Client, msg:IMessage) => {
                                    serverLobby.onMessage(localClient, <any>msg);
                                };
                                clientLobby.serverConnection = localServerConnection;


                                let localClientConnection = new LocalClientConnection();
                                localClientConnection.messageHandler = (msg) => {
                                    clientLobby.onMessage(<any>msg);
                                };
                                localClient.connection = localClientConnection;



                                serverLobby.clients.push(localClient);
                                clientLobby.sendToServer<JoinRequestMessage>({
                                    service: ServiceType.Lobby,
                                    id: <number>LobbyMessageId.CMSG_JOIN_REQUEST,
                                    name: "myName",
                                    team: 1
                                });

                                resolve(clientLobby);
                            });
                        } else {
                            let lobbyId = lobbyRef.key();
                            let lobby = new ClientLobby(lobbyId);
                            lobby.clientGUID = guid();

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