namespace Play.Server {
    "use strict";

    export interface IConnection {
        send(msg: Message): void;
        disconnect(): void;
        onDisconnect: () => void;
    }

    export class LocalClientConnection implements IConnection {

        public messageHandler: (msg: Message) => void;
        public onDisconnect: () => void;

        public send(msg: Message): void {
            this.messageHandler(msg);
        }

        public disconnect(): void {

        }
    }

    export class LocalServerConnection implements IConnection {

        public messageHandler: (client: Client<any>, msg: Message) => void;

        private client: Client<any>;
        public onDisconnect: () => void;

        constructor(client: Client<any>) {
            this.client = client;
        }

        public send(msg: any): void {
            this.messageHandler(this.client, msg);
        }

        public disconnect(): void {

        }
    }

    export class Peer2PeerConnection implements IConnection {

        public peerConnection: RTCPeerConnection;
        public dataChannel: RTCDataChannel;
        public messageHandler: (msg: Message) => void;
        public onDisconnect: () => void;

        public send(msg: Message): void {
            this.dataChannel.send(JSON.stringify(msg));
        }

        public disconnect(): void {
            this.dataChannel.close();
            this.peerConnection.close();
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