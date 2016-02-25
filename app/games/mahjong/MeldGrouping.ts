namespace Mahjong {
    "use strict";

    export class MeldGrouping {

        public setCount: number;
        public runCount: number;
        public pairCount: number;

        constructor(public melds: Meld[], public remainingTiles: Tiles) {}

        //popMeld(meld: Meld) {}

        public toString(): string {
            return "Melds: [" + this.melds.map(m => m.toString()).join(", ") + "], Remaining tiles: " + this.remainingTiles.toString();
        }
    }

}