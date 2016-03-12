namespace Play.Server {
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

        public messageHandler: (client: Client<any>, msg: Message) => void;

        private client: Client<any>;

        constructor(client: Client<any>) {
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


    export class Client<T> implements IPlayerInfo<T> {
        public id: string;
        public name: string;
        public team: number;
        public isReady: boolean;
        public connection: IConnection;
        public gameData: T;
        public isConnected: boolean = false;


        public send(msg: Message): void {
            this.connection.send(msg);
        }
    }
}