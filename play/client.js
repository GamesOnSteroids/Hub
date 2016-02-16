var Play;
(function (Play) {
    "use strict";
    class LocalClientConnection {
        send(msg) {
            this.messageHandler(msg);
        }
    }
    Play.LocalClientConnection = LocalClientConnection;
    class LocalServerConnection {
        constructor(client) {
            this.client = client;
        }
        send(msg) {
            this.messageHandler(this.client, msg);
        }
    }
    Play.LocalServerConnection = LocalServerConnection;
    class Peer2PeerConnection {
        send(msg) {
            this.dataChannel.send(JSON.stringify(msg));
        }
    }
    Play.Peer2PeerConnection = Peer2PeerConnection;
    class Client {
        send(msg) {
            this.connection.send(msg);
        }
    }
    Play.Client = Client;
})(Play || (Play = {}));
//# sourceMappingURL=client.js.map