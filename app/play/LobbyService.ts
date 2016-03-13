namespace Play {
    "use strict";

    import Client = Play.Server.Client;
    import ServerLobby = Play.Server.ServerLobby;
    import LocalServerConnection = Play.Server.LocalServerConnection;
    import LocalClientConnection = Play.Server.LocalClientConnection;


    export interface ILobbyService {
        findLobby(gameConfiguration: LobbyConfiguration): Promise<ClientLobby>;
        onClientJoined(lobby: ServerLobby, client: Client<any>): void;
    }

    export interface ILobbyDescription {
        playerCount: number;
        maxPlayers: number;
        gameId: string;
        createdAt: Date;
        gameVariant: string;
    }

    export class FirebaseLobbyService implements ILobbyService {

        public onClientJoined(lobby: ServerLobby, client: Client<any>): void {

            let firebase = new Firebase(config.get(environment).firebaseURL);
            let lobbyRef = firebase.child("lobby").child(lobby.configuration.lobbyId);

            lobbyRef.transaction((data) => {
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

        public getLobbyList(): Promise<ILobbyDescription[]> {
            return new Promise<ILobbyDescription[]>((resolve, reject) => {
                let lobbiesRef = new Firebase(config.get(environment).firebaseURL).child("lobby");
                lobbiesRef.once("value", (snapshot) => {
                    let result: ILobbyDescription[] = [];
                    snapshot.forEach((lobbySnapshot) => {
                        result.push(lobbySnapshot.val());
                    });
                    resolve(result);
                });
            });
        }

        public findLobby(configuration: LobbyConfiguration): Promise<ClientLobby> {
            return new Promise<ClientLobby>((resolve, reject) => {

                // no desired game
                if (configuration.lobbyId == null) {
                    let lobbiesRef = new Firebase(config.get(environment).firebaseURL).child("lobby");

                    // try to find relevant games
                    lobbiesRef.once("value", (snapshot) => {
                        let lobbyRef: Firebase = null;
                        let found = snapshot.forEach((lobbySnapshot) => {
                            let value = lobbySnapshot.val();
                            if (value.playerCount < value.maxPlayers && value.gameId == configuration.gameConfiguration.id && value.gameVariant == configuration.variant.id) {
                                lobbyRef = lobbySnapshot.ref();
                                return true;
                            }
                        });
                        if (!found) {

                            let lobbyDescription = {
                                playerCount: 0,
                                maxPlayers: configuration.variant.maxPlayers,
                                gameId: configuration.gameConfiguration.id,
                                createdAt: new Date(),
                                gameVariant: configuration.variant.id,
                            };

                            let lobbyRef = lobbiesRef.push();
                            lobbyRef.set(lobbyDescription, () => {
                                lobbyRef.onDisconnect().remove();

                                let lobbyId = lobbyRef.key();
                                configuration.lobbyId = lobbyId;

                                this.createLobby(configuration, resolve);
                            });
                        } else {
                            let lobbyId = lobbyRef.key();
                            configuration.lobbyId = lobbyId;
                            this.joinLobby(configuration, resolve);
                        }
                    });

                } else {
                    new Firebase(config.get(environment).firebaseURL).child(`lobby/${configuration.lobbyId}`).once("value", (snapshot) => {
                        let lobbyId = snapshot.key();
                        let description = snapshot.val();
                        configuration.lobbyId = lobbyId;
                        configuration.gameConfiguration = gamesConfiguration.find(g => g.id == description.gameId);
                        configuration.variant = configuration.gameConfiguration.variants.find(v => v.id == description.gameVariant);

                        this.joinLobby(configuration, resolve);
                    });
                }
            });
        }

        private createLobby(configuration: LobbyConfiguration, resolve: (lobby: ClientLobby) => void): void {
            let clientLobby = new ClientLobby(configuration);
            clientLobby.clientGUID = Guid.generate();

            let localClient = new Client();
            localClient.id = clientLobby.clientGUID;
            localClient.name = "server";
            localClient.team = 0;


            let serverLobby = new ServerLobby(configuration);

            let signalingService = new SignalingService();
            let ref = new Firebase(config.get(environment).firebaseURL).child("lobby").child(serverLobby.configuration.lobbyId).child("sdp");
            signalingService.createSignalingServer(serverLobby, new FirebaseSignalingChannel(ref));


            let localServerConnection = new LocalServerConnection(localClient);
            localServerConnection.messageHandler = (client: Client<any>, msg: Message) => {
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
        };

        private joinLobby(configuration: LobbyConfiguration, resolve: (lobby: ClientLobby) => void): void {
            let lobby = new ClientLobby(configuration);
            lobby.clientGUID = Guid.generate();

            let signalingService = new SignalingService();
            let ref = new Firebase(config.get(environment).firebaseURL).child("lobby").child(lobby.configuration.lobbyId).child("sdp");
            signalingService.createSignalingClient(lobby, new FirebaseSignalingChannel(ref));

            resolve(lobby);
        };

    }

}