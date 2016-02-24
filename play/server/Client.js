var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
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