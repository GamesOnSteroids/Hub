"use strict";

class LobbyService {


  static findLobby(gameConfiguration) {
    let ref = new Firebase("https://fiery-inferno-1131.firebaseio.com/");

    let lobbiesRef = ref.child("lobby");

    // no desired game
    if (gameConfiguration.lobbyId == null) {

      lobbiesRef.once("value", (snapshot) => {
        let lobbyRef = null;
        let found = snapshot.forEach( (snapshot) => {
          let value = snapshot.val();
          if (Object.keys(value.playerCount).length < value.maxPlayers) {
            lobbyRef = snapshot.ref();
            return true;
          }
        });
        let lobby;
        if (!found) {
          lobby = new ServerLobby(ref, gameConfiguration);
        } else {
          lobby = new ClientLobby(lobbyRef);
        }
        return lobby;
      });

    } else {
      let lobbyRef = lobbies.child(configuration.lobbyId);
    }
  }


}
