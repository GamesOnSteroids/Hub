namespace Mahjong {
    "use strict";

    export class HandForm {

        constructor(public melds: Meld[], public remainingTiles: Tiles) {}

        public equals(other: HandForm): boolean {
            return this.remainingTiles.equals(other.remainingTiles) && this.meldsEqual(other.melds);
        }

        public meldsEqual(otherMelds: Meld[]): boolean {
            for (let meld of this.melds) {
                if (this.count(meld) != otherMelds.filter(m => m.equals(meld)).length) {
                    return false;
                }
            }
            return otherMelds.length == this.melds.length;
        }

        public getRuns(): Meld[] {
            return this.melds.filter(m => m.type == MeldType.CHI);
        }

        public countDoubleRuns(): number {
            let doubleRuns: Meld[] = [];
            for (let meld of this.getRuns()) {
                if (this.count(meld) == 2 && doubleRuns.findIndex(m => m.equals(meld)) < 0) {
                    doubleRuns.push(meld);
                }
            }
            return doubleRuns.length;
        }

        public hasMixedTripleRun(): boolean {
            let runs = this.getRuns();
            if (runs.length >= 3) {
                for (let i = 0; i < 2; i++) {
                    let run = runs[i];
                    if (this.hasRunWithDifferentSuit(run, Suit.MAN) &&
                        this.hasRunWithDifferentSuit(run, Suit.PIN) &&
                        this.hasRunWithDifferentSuit(run, Suit.SOU)) {
                        return true;
                    }
                }
                return false;
            } else {
                return false;
            }
        }

        public hasRunWithDifferentSuit(originalRun: Meld, checkedSuit: Suit): boolean {
            return this.count(originalRun.ofDifferentSuit(checkedSuit)) > 0;
        }

        public count(meld: Meld): number {
            return this.melds.filter(m => m.equals(meld)).length;
        }

        public firstRemainingTile(): Tile {
            return this.remainingTiles.first();
        }

        public wasOpenWait(tile: Tile): boolean {
            let runs = this.melds.filter(m => m.type == MeldType.CHI);
            return runs.findIndex(run => run.wasOpenWait(tile)) >= 0;
        }

        public isAllRuns(): boolean {
            return this.melds.findIndex(m => m.type != MeldType.CHI) < 0;
        }

        public isAllPons(): boolean {
            return this.melds.findIndex(m => m.type == MeldType.CHI) < 0;
        }

        public isAllKans(): boolean {
            return this.melds.findIndex(m => m.type != MeldType.KAN) < 0;
        }

        public getMeldCount(): number {
            return this.melds.length;
        }

        public remainingTilesFormPair(): boolean {
            let tiles = this.remainingTiles.tiles;
            return tiles.length == 2 && tiles[0].equals(tiles[1]);
        }

        public withNewMeldFromRemainingTiles(meld: Meld): HandForm {
            for (let tile of meld.tiles.tiles) {
                if (!this.remainingTiles.contains(tile)) {
                    throw new Error("Meld " + meld.toString + " does not contain remaining tile " + tile.toString());
                }
            }
            return new HandForm(this.melds.concat(meld), this.remainingTiles.withoutTiles(meld.tiles.tiles));
        }

        public withNewMelds(melds: Meld[]): HandForm  {
            return new HandForm(this.melds.slice().concat(melds), this.remainingTiles);
        }

        public toString(): string {
            return "Melds: [" + this.melds.map(m => m.toString()).join(", ") + "], Remaining tiles: " + this.remainingTiles.toString();
        }
    }

}