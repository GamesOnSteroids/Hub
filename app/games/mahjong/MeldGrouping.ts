namespace Mahjong {
    "use strict";

    export class MeldGrouping {

        public setCount: number;
        public runCount: number;
        public pairCount: number;

        constructor(public melds: Meld[], public remainingTiles: Tiles) {}

        public equals(other: MeldGrouping): boolean {
            return this.remainingTiles.equals(other.remainingTiles) && this.meldsEqual(other.melds);
        }

        public meldsEqual(otherMelds: Meld[]): boolean {
            for (let meld of this.melds) {
                if (otherMelds.findIndex(m => m.equals(meld)) < 0) {
                    return false;
                }
            }
            return otherMelds.length == this.melds.length;
        }

        public withNewMeldFromRemainingTiles(meld: Meld): MeldGrouping {
            for (let tile of meld.tiles.tiles) {
                if (!this.remainingTiles.contains(tile)) {
                    throw new Error("Meld " + meld.toString + " does not contain remaining tile " + tile.toString());
                }
            }
            return new MeldGrouping(this.melds.concat(meld), this.remainingTiles.withoutTiles(meld.tiles.tiles));
        }

        public toString(): string {
            return "Melds: [" + this.melds.map(m => m.toString()).join(", ") + "], Remaining tiles: " + this.remainingTiles.toString();
        }
    }

}