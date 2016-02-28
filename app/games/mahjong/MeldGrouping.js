var Mahjong;
(function (Mahjong) {
    "use strict";
    class MeldGrouping {
        constructor(melds, remainingTiles) {
            this.melds = melds;
            this.remainingTiles = remainingTiles;
        }
        equals(other) {
            return this.remainingTiles.equals(other.remainingTiles) && this.meldsEqual(other.melds);
        }
        meldsEqual(otherMelds) {
            for (let meld of this.melds) {
                if (otherMelds.findIndex(m => m.equals(meld)) < 0) {
                    return false;
                }
            }
            return otherMelds.length == this.melds.length;
        }
        withNewMeldFromRemainingTiles(meld) {
            for (let tile of meld.tiles.tiles) {
                if (!this.remainingTiles.contains(tile)) {
                    throw new Error("Meld " + meld.toString + " does not contain remaining tile " + tile.toString());
                }
            }
            return new MeldGrouping(this.melds.concat(meld), this.remainingTiles.withoutTiles(meld.tiles.tiles));
        }
        toString() {
            return "Melds: [" + this.melds.map(m => m.toString()).join(", ") + "], Remaining tiles: " + this.remainingTiles.toString();
        }
    }
    Mahjong.MeldGrouping = MeldGrouping;
})(Mahjong || (Mahjong = {}));
