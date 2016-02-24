namespace Mahjong {
    "use strict";

    export class Hand {
        public owner: PlayerInfo[];
        public tiles: TileId[];
        public openMelds: Meld[];
        public wind: Wind;
        public pond: TileId[];
    }



}