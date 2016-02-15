var Play;
(function (Play) {
    "use strict";
    class LocalConnection {
        send(msg) {
            this.messageHandler(msg);
        }
    }
    Play.LocalConnection = LocalConnection;
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