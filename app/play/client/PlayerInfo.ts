namespace Play.Client {
    "use strict";

    export class PlayerInfo<T> implements IPlayerInfo<T> {
        public id: string;
        public name: string;
        public team: number;
        public isReady: boolean;
        public gameData: T;
    }
}