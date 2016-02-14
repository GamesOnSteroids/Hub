module Play {

    export class ClientLobby extends Lobby {

        constructor(configuration) {
            super(configuration);

            this.clientGUID = guid();

            this.on(ServiceType.Lobby, LobbyMessageId.SMSG_JOIN, this.onJoin.bind(this));
        }


        onJoin(client:Client, message:JoinMessage) {

            let c = new Client();
            c.id = message.clientId;
            c.name = message.name;
            c.team = message.team;

            this.clients.push(c);

            if (c.id == this.clientGUID) {
                this.localClient = c;
            }
        }


    }
}