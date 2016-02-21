module Play.Client {
    "use strict";

    export class PlayerInfo implements IPlayerInfo {
        public id:string;
        public name:string;
        public team:number;
        public isReady: boolean;
        public gameData: any;
    }
}