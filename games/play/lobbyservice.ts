module Play {
    export interface ILobbyService {
        findLobby(gameConfiguration):Promise<Lobby>;
    }

    export class FirebaseLobbyService implements ILobbyService {

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
                            var serverLobby = new ServerLobby(configuration);
                            serverLobby.serverConnection = serverLobby.localClient.connection;

                            let signalingService = new FirebaseSignalingService();
                            signalingService.createSignalingServer(serverLobby);

                            resolve(serverLobby);
                        } else {
                            configuration.lobbyId = lobbyRef.key();
                            var clientLobby = new ClientLobby(configuration);

                            let signalingService = new FirebaseSignalingService();
                            signalingService.createSignalingClient(clientLobby);

                            resolve(clientLobby);
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