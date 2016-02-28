namespace Mahjong {
    "use strict";

    export class Hand {
        public owner: PlayerInfo[];
        public tiles: Tiles;
        public openMelds: Meld[] = [];
        public closedKans: Meld[] = [];
        public wind: Wind;
        public pond: TileId[] = [];
        public riichi: boolean;

        public hasCorrectForm(): boolean {
            let remainingMelds = 4 - this.openMelds.length - this.closedKans.length;
            throw "Not implemented";
        }

    }

}