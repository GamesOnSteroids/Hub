var Mahjong;
(function (Mahjong) {
    "use strict";
    class HandForm {
        constructor(melds, remainingTiles) {
            this.melds = melds;
            this.remainingTiles = remainingTiles;
        }
        equals(other) {
            return this.remainingTiles.equals(other.remainingTiles) && this.meldsEqual(other.melds);
        }
        meldsEqual(otherMelds) {
            for (let meld of this.melds) {
                if (this.count(meld) != otherMelds.filter(m => m.equals(meld)).length) {
                    return false;
                }
            }
            return otherMelds.length == this.melds.length;
        }
        getRuns() {
            return this.melds.filter(m => m.type == Mahjong.MeldType.CHI);
        }
        countDoubleRuns() {
            let doubleRuns = [];
            for (let meld of this.getRuns()) {
                if (this.count(meld) == 2 && doubleRuns.findIndex(m => m.equals(meld)) < 0) {
                    doubleRuns.push(meld);
                }
            }
            return doubleRuns.length;
        }
        hasMixedTripleRun() {
            let runs = this.getRuns();
            if (runs.length >= 3) {
                for (let i = 0; i < 2; i++) {
                    let run = runs[i];
                    if (this.hasRunWithDifferentSuit(run, Mahjong.Suit.MAN) &&
                        this.hasRunWithDifferentSuit(run, Mahjong.Suit.PIN) &&
                        this.hasRunWithDifferentSuit(run, Mahjong.Suit.SOU)) {
                        return true;
                    }
                }
                return false;
            }
            else {
                return false;
            }
        }
        hasRunWithDifferentSuit(originalRun, checkedSuit) {
            return this.count(originalRun.ofDifferentSuit(checkedSuit)) > 0;
        }
        count(meld) {
            return this.melds.filter(m => m.equals(meld)).length;
        }
        firstRemainingTile() {
            return this.remainingTiles.first();
        }
        wasOpenWait(tile) {
            let runs = this.melds.filter(m => m.type == Mahjong.MeldType.CHI);
            return runs.findIndex(run => run.wasOpenWait(tile)) >= 0;
        }
        isAllRuns() {
            return this.melds.findIndex(m => m.type != Mahjong.MeldType.CHI) < 0;
        }
        isAllPons() {
            return this.melds.findIndex(m => m.type == Mahjong.MeldType.CHI) < 0;
        }
        isAllKans() {
            return this.melds.findIndex(m => m.type != Mahjong.MeldType.KAN) < 0;
        }
        getMeldCount() {
            return this.melds.length;
        }
        remainingTilesFormPair() {
            let tiles = this.remainingTiles.tiles;
            return tiles.length == 2 && tiles[0].equals(tiles[1]);
        }
        withNewMeldFromRemainingTiles(meld) {
            for (let tile of meld.tiles.tiles) {
                if (!this.remainingTiles.contains(tile)) {
                    throw new Error("Meld " + meld.toString + " does not contain remaining tile " + tile.toString());
                }
            }
            return new HandForm(this.melds.concat(meld), this.remainingTiles.withoutTiles(meld.tiles.tiles));
        }
        withNewMelds(melds) {
            return new HandForm(this.melds.slice().concat(melds), this.remainingTiles);
        }
        toString() {
            return "Melds: [" + this.melds.map(m => m.toString()).join(", ") + "], Remaining tiles: " + this.remainingTiles.toString();
        }
    }
    Mahjong.HandForm = HandForm;
})(Mahjong || (Mahjong = {}));
