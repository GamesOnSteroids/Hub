namespace Play {
    "use strict";

    export interface IPlayerInfo<T> {
        id: string;
        team: number;
        gameData: T;
    }
}
