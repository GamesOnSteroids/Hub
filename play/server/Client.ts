module Play.Server {
    "use strict";

    export interface IConnection {
        send(msg: Message): void;
    }

    export class LocalClientConnection implements IConnection {

        public messageHandler: (msg: Message) => void;

        public send(msg: Message): void {
            this.messageHandler(msg);
        }
    }

    export class LocalServerConnection implements IConnection {

        public messageHandler: (client: Client, msg: Message) => void;

        private client: Client;

        constructor(client: Client) {
            this.client = client;
        }

        public send(msg: any): void {
            this.messageHandler(this.client, msg);
        }
    }

    export class Peer2PeerConnection implements IConnection {

        public peerConnection: RTCPeerConnection;
        public dataChannel: RTCDataChannel;
        public messageHandler: (msg: Message) => void;

        public send(msg: Message): void {
            this.dataChannel.send(JSON.stringify(msg));
        }
    }


    export class Client implements IPlayerInfo {
        public id: string;
        public name: string;
        public team: number;
        public isReady: boolean;
        public connection: IConnection;
        public gameData: any;
        public isConnected: boolean = false;


        public send(msg: Message): void {
            this.connection.send(msg);
        }
    }
}