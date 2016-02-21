var Play;
(function (Play) {
    var Server;
    (function (Server) {
        "use strict";
        class LocalClientConnection {
            send(msg) {
                this.messageHandler(msg);
            }
        }
        Server.LocalClientConnection = LocalClientConnection;
        class LocalServerConnection {
            constructor(client) {
                this.client = client;
            }
            send(msg) {
                this.messageHandler(this.client, msg);
            }
        }
        Server.LocalServerConnection = LocalServerConnection;
        class Peer2PeerConnection {
            send(msg) {
                this.dataChannel.send(JSON.stringify(msg));
            }
        }
        Server.Peer2PeerConnection = Peer2PeerConnection;
        class Client {
            constructor() {
                this.isConnected = false;
            }
            send(msg) {
                this.connection.send(msg);
            }
        }
        Server.Client = Client;
    })(Server = Play.Server || (Play.Server = {}));
})(Play || (Play = {}));
//# sourceMappingURL=Client.js.map