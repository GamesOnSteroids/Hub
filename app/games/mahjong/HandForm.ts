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

        public getRunTiles(): Tile[] {
            return this.getRuns().map(m => m.tiles.tiles).reduce((a, b) => a.concat(b), []);
        }

        public getPons(): Meld[] {
            return this.melds.filter(m => m.type == MeldType.PON || m.type == MeldType.KAN);
        }

        public getKans(): Meld[] {
            return this.melds.filter(m => m.type == MeldType.KAN);
        }

        public isLittleThreeDragons(): boolean {
            return this.getDragonPons().length == 2 && this.remainingTiles.first().isDragon();
        }

        public getDragonPons(): Meld[] {
            return this.melds.filter(meld => meld.first().isDragon());
        }

        public getWindPons(): Meld[] {
            return this.melds.filter(meld => meld.first().isWind());
        }

        public isBigThreeDragons(): boolean {
            return this.getDragonPons().length == 3;
        }

        public isLittleFourWinds(): boolean {
            return this.getWindPons().length == 3 && this.remainingTiles.first().isWind();
        }

        public isBigFourWinds(): boolean {
            return this.getWindPons().length == 4;
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

        public hasMixedTriplePon(): boolean {
            let pons = this.getPons();
            if (pons.length >= 3) {
                for (let i = 0; i < 2; i++) {
                    let pon = pons[i];
                    let ponTile = pon.first();
                    if (ponTile.isNumber() &&
                        this.hasPonOrKanWithDifferentSuit(ponTile, Suit.MAN) &&
                        this.hasPonOrKanWithDifferentSuit(ponTile, Suit.PIN) &&
                        this.hasPonOrKanWithDifferentSuit(ponTile, Suit.SOU)) {
                        return true;
                    }
                }
                return false;
            } else {
                return false;
            }
        }

        public hasPureStraight(): boolean {
            let runs = this.getRuns();
            if (runs.length >= 3) {
                for (let i = 0; i < 2; i++) {
                    let suit = runs[i].first().suit;
                    if (this.hasRunFrom(1, suit) && this.hasRunFrom(4, suit) && this.hasRunFrom(7, suit)) {
                        return true;
                    }
                }
                return false;
            } else {
                return false;
            }
        }

        public hasTerminalOrHonorInEachMeld(): boolean {
            return this.melds.findIndex(m => !m.tiles.hasTerminalsOrHonors()) < 0;
        }

        public hasRunWithDifferentSuit(originalRun: Meld, checkedSuit: Suit): boolean {
            return this.count(originalRun.ofDifferentSuit(checkedSuit)) > 0;
        }

        public hasPonOrKanWithDifferentSuit(ponTile: Tile, checkedSuit: Suit): boolean {
            return this.count(ponTile.ofDifferentSuit(checkedSuit).createPon()) > 0 ||
                this.count(ponTile.ofDifferentSuit(checkedSuit).createKan()) > 0;
        }

        public hasRunFrom(startingValue: number, suit: Suit): boolean {
            return this.getRuns().findIndex(m => m.first().value == startingValue && m.first().suit == suit) > -1;
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