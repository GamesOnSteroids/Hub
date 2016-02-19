module Play {
    "use strict";

    import Client = Play.Server.Client;
    import ServerLobby = Play.Server.ServerLobby;
    import LocalServerConnection = Play.Server.LocalServerConnection;
    import LocalClientConnection = Play.Server.LocalClientConnection;


    export interface ILobbyService {
        findLobby(gameConfiguration:LobbyConfiguration):Promise<ClientLobby>;
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

        findLobby(configuration:LobbyConfiguration):Promise<ClientLobby> {
            return new Promise<ClientLobby>((resolve, reject) => {
                let lobbiesRef = new Firebase("https://fiery-inferno-1131.firebaseio.com/").child("lobby");

                // no desired game
                if (configuration.lobbyId == null) {

                    // try to find relevant games
                    lobbiesRef.once("value", (snapshot) => {
                        let lobbyRef:Firebase = null;
                        let found = snapshot.forEach((snapshot) => {
                            let value = snapshot.val();
                            if (value.playerCount < value.maxPlayers && value.gameId == configuration.gameId) {
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

                                let clientLobby = new ClientLobby(lobbyId, configuration);
                                clientLobby.clientGUID = guid();

                                let localClient = new Client();
                                localClient.id = clientLobby.clientGUID;
                                localClient.name = "server";
                                localClient.team = 0;


                                let serverLobby = new ServerLobby(lobbyId, configuration);

                                let signalingService = new SignalingService();
                                var ref = new Firebase("https://fiery-inferno-1131.firebaseio.com/").child("lobby").child(serverLobby.lobbyId).child("sdp");
                                signalingService.createSignalingServer(serverLobby, new FirebaseSignalingChannel(ref));


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
                                clientLobby.join();

                                resolve(clientLobby);
                            });
                        } else {
                            let lobbyId = lobbyRef.key();
                            let lobby = new ClientLobby(lobbyId, configuration);
                            lobby.clientGUID = guid();

                            let signalingService = new SignalingService();
                            var ref = new Firebase("https://fiery-inferno-1131.firebaseio.com/").child("lobby").child(lobby.lobbyId).child("sdp");
                            signalingService.createSignalingClient(lobby, new FirebaseSignalingChannel(ref));

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