var Play;
(function (Play) {
    var Server;
    (function (Server) {
        "use strict";
        class LocalClientConnection {
            send(msg) {
                this.messageHandler(msg);
            }
            disconnect() {
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
            disconnect() {
            }
        }
        Server.LocalServerConnection = LocalServerConnection;
        class Peer2PeerConnection {
            send(msg) {
                this.dataChannel.send(JSON.stringify(msg));
            }
            disconnect() {
                this.dataChannel.close();
                this.peerConnection.close();
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
