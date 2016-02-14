module Play {

    export interface GameMessage {
        id: number;
    }

    export class GameService extends Service {

        constructor(lobby:ServerLobby) {
            super(lobby);
        }

        on<T extends GameMessage>(id:number, handler:(client:Client, msg:T) => void) {
            this.lobby.on(ServiceType.Game, id, <any>handler);
        }


        broadcast<T extends GameMessage>(msg:T): void {
            (<any>msg).service = ServiceType.Game;
            this.lobby.broadcast(msg);
        }

        sendTo<T extends GameMessage>(client:Client, msg:T): void {
            (<any>msg).service = ServiceType.Game;
            client.connection.send(msg);
        }

    }
}