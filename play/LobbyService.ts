namespace Play {
    "use strict";

    import Client = Play.Server.Client;
    import ServerLobby = Play.Server.ServerLobby;
    import LocalServerConnection = Play.Server.LocalServerConnection;
    import LocalClientConnection = Play.Server.LocalClientConnection;


    export interface ILobbyService {
        findLobby(gameConfiguration: LobbyConfiguration): Promise<ClientLobby>;
        onClientJoined(lobby: ServerLobby, client: Client): void;
    }

    export class FirebaseLobbyService implements ILobbyService {

        public onClientJoined(lobby: ServerLobby, client: Client): void {

            let firebase = new Firebase(config.get(environment).firebaseURL);
            let lobbyRef = firebase.child("lobby").child(lobby.lobbyId);

            lobbyRef.transaction((data) => {
                if (data != undefined) {
                    data.playerCount += 1;
                }
                return data;
            }, (error, commited, snapshot) => {
                if (error != undefined) {
                    console.error(error);
                }
            }, true);
        }

        public findLobby(configuration: LobbyConfiguration): Promise<ClientLobby> {
            return new Promise<ClientLobby>((resolve, reject) => {
                let lobbiesRef = new Firebase(config.get(environment).firebaseURL).child("lobby");

                // no desired game
                if (configuration.lobbyId == undefined) {

                    // try to find relevant games
                    lobbiesRef.once("value", (snapshot) => {
                        let lobbyRef: Firebase = undefined;
                        let found = snapshot.forEach((lobbySnapshot) => {
                            let value = lobbySnapshot.val();
                            if (value.playerCount < value.maxPlayers && value.gameId == configuration.gameId && value.gameVariant == configuration.gameConfiguration.id) {
                                lobbyRef = lobbySnapshot.ref();
                                return true;
                            }
                        });
                        if (!found) {

                            let lobbyDescription = {
                                playerCount: 0,
                                maxPlayers: configuration.maxPlayers,
                                gameId: configuration.gameId,
                                createdAt: new Date(),
                                gameVariant: configuration.gameConfiguration.id,
                            };

                            let lobbyRef = lobbiesRef.push();
                            lobbyRef.set(lobbyDescription, () => {

                                let lobbyId = lobbyRef.key();

                                let clientLobby = new ClientLobby(lobbyId, configuration);
                                clientLobby.clientGUID = Guid.generate();

                                let localClient = new Client();
                                localClient.id = clientLobby.clientGUID;
                                localClient.name = "server";
                                localClient.team = 0;


                                let serverLobby = new ServerLobby(lobbyId, configuration);

                                let signalingService = new SignalingService();
                                var ref = new Firebase(config.get(environment).firebaseURL).child("lobby").child(serverLobby.lobbyId).child("sdp");
                                signalingService.createSignalingServer(serverLobby, new FirebaseSignalingChannel(ref));


                                let localServerConnection = new LocalServerConnection(localClient);
                                localServerConnection.messageHandler = (client: Client, msg: Message) => {
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
                            lobby.clientGUID = Guid.generate();

                            let signalingService = new SignalingService();
                            let ref = new Firebase(config.get(environment).firebaseURL).child("lobby").child(lobby.lobbyId).child("sdp");
                            signalingService.createSignalingClient(lobby, new FirebaseSignalingChannel(ref));

                            resolve(lobby);
                        }
                    });

                } else {
                    // let lobbyRef = lobbies.child(configuration.lobbyId);
                    throw "Not implemented";
                }
            });
        }

    }

}