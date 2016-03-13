namespace Mahjong {
    "use strict";

    export class Tiles {

        constructor(public tiles: Tile[]) {
        }

        public static parse(tilesStr: string): Tiles {
            let suit: Suit = null;
            let tiles: Tile[] = [];
            for (let i = 0; i < tilesStr.length; i++) {
                let c = tilesStr.charAt(i);
                let nextIsNumber = tilesStr.length > i + 1 && /[0-9]/.test(tilesStr.charAt(i + 1));
                if ((c == "M" || c == "S" || c == "P") && nextIsNumber) {
                    if (c == "M") {
                        suit = Suit.MAN;
                    } else if (c == "S") {
                        suit = Suit.SOU;
                    } else {
                        suit = Suit.PIN;
                    }
                } else {
                    if (/[0-9]/.test(c) && suit != null) {
                        tiles.push(Tile.findByValue(parseInt(c, 10), suit));
                    } else {
                        suit = null;
                        switch (c) {
                            case "E": tiles.push(Tile.EAST); break;
                            case "S": tiles.push(Tile.SOUTH); break;
                            case "W": tiles.push(Tile.WEST); break;
                            case "N": tiles.push(Tile.NORTH); break;
                            case "R": tiles.push(Tile.RED); break;
                            case "G": tiles.push(Tile.GREEN); break;
                            case " ": tiles.push(Tile.WHITE); break;
                            default: throw new Error("Unknown tile code - " + c);
                        }
                    }
                }
            }
            return new Tiles(tiles);
        }

        public isEmpty(): boolean {
            return this.size() == 0;
        }

        public size(): number {
            return this.tiles.length;
        }

        public getTileIds(): TileId[] {
            return this.tiles.map(t => t.id);
        }

        public toString(): string {
            return this.tiles.map(t => t.toString()).join(", ");
        }

        public equals(other: Tiles): boolean {
            for (let tile of this.unique().tiles) {
                if (this.count(tile) != other.count(tile)) {
                    return false;
                }
            }
            return this.tiles.length == other.tiles.length;
        }

        public withoutTile(tile: Tile): Tiles {
            let index = this.tiles.findIndex(t => t.id == tile.id);
            if (index < 0) {
                throw new Error("Tiles " + this.tiles + " do not contain tile " + tile);
            } else {
                let newTiles = this.tiles.slice();
                newTiles.splice(index, 1);
                return new Tiles(newTiles);
            }
        }

        public createClone(): Tiles {
            return new Tiles(this.tiles.slice());
        }

        public withoutTiles(tiles: Tile[]): Tiles {
            let result: Tiles = this.createClone();
            tiles.forEach(t => {
                result = result.withoutTile(t);
            });
            if (result == null) {
                result = new Tiles(this.tiles.slice());
            }
            return result;
        }

        public getPossibleRuns(tile: Tile): Meld[] {
            let runs: Tiles[] = [];
            if (tile.type == TileType.NUMBER) {
                let previous = tile.getPrevious();
                let next = tile.getNext();
                if (this.contains(previous)) {
                    if (this.contains(next)) {
                        runs.push(new Tiles([previous, tile, next]));
                    }
                    if (this.contains(previous.getPrevious())) {
                        runs.push(new Tiles([previous.getPrevious(), previous, tile]));
                    }
                }
                if (this.contains(next) && this.contains(next.getNext())) {
                    runs.push(new Tiles([tile, next, next.getNext()]));
                }
            }
            return runs.map(tiles => new Meld(tiles, MeldType.CHI));
        }

        public getPossibleSets(tile: Tile): Meld[] {
            let sets: Meld[] = [];
            if (this.count(tile) >= 2) {
                sets.push(new Meld(new Tiles([tile, tile, tile]), MeldType.PON));
                if (this.count(tile) >= 3) {
                    sets.push(new Meld(new Tiles([tile, tile, tile, tile]), MeldType.KAN));
                }
            }
            return sets;
        }

        public contains(tile: Tile): boolean {
            for (let t of this.tiles) {
                if (t.id == tile.id) {
                    return true;
                }
            }
            return false;
        }

        public count(tile: Tile): number {
            if (tile == null) {
                return 0;
            } else {
                return this.tiles.filter(t => t.id == tile.id).length;
            }
        }

        public countValue(tileValue: number): number {
            return this.tiles.filter(t => t.value == tileValue).length;
        }

        public getUniqueMelds(): Meld[] {
            let melds: Meld[] = [];
            let uniqueTiles = this.unique().tiles;
            uniqueTiles.forEach((tile, i) => {
                if (this.count(tile) > 2) {
                    melds.push(new Meld(new Tiles([tile, tile, tile]), MeldType.PON));
                }
                if (tile.type == TileType.NUMBER && uniqueTiles.length > i + 1) {
                    let nextTile = uniqueTiles[i + 1];
                    if (nextTile.isAfter(tile)) {
                        if (uniqueTiles.length > i + 2) {
                            let secondNextTile = uniqueTiles[i + 2];
                            if (secondNextTile.isAfter(nextTile)) {
                                melds.push(Meld.fromTileArray([tile, nextTile, secondNextTile], MeldType.CHI));
                            }
                        }
                    }
                }
            });
            return melds;
        }

        public unique(): Tiles {
            let results: Tile[] = [];
            for (let tile of this.tiles) {
                if (results.findIndex(t => t.id == tile.id) < 0) {
                    results.push(tile);
                }
            }
            return new Tiles(results);
        }

        public getAmbiguousMelds(melds: Meld[]): Meld[] {
            let ambiguous: Meld[] = [];
            if (melds.length < 2) {
                return ambiguous;
            }
            for (let i = 0; i < melds.length - 1; i++) {
                let meld = melds[i];
                if (ambiguous.findIndex(m => m.equals(meld)) < 0) {
                    let foundAmbiguous = false;
                    for (let j = i + 1; j < melds.length; j++) {
                        let otherMeld = melds[j];
                        if (meld.hasIntersection(otherMeld)) {
                            ambiguous.push(otherMeld);
                            foundAmbiguous = true;
                        }
                    }
                    if (foundAmbiguous) {
                        ambiguous.push(meld);
                    }
                }
            }
            return ambiguous;
        }

        public getPossibleGroupings(): HandForm[] {
            this.sortTiles();
            let finalGroupings: HandForm[] = [];
            this.findFinalMeldGroupings(new HandForm([], this), finalGroupings);
            return this.uniqueGroupings(finalGroupings);
        }

        private uniqueGroupings(groupings: HandForm[]): HandForm[] {
            let result: HandForm[] = [];
            for (let grouping of groupings) {
                if (result.findIndex(pg => pg.equals(grouping)) < 0) {
                    result.push(grouping);
                }
            }
            return result;
        }

        private findFinalMeldGroupings(grouping: HandForm, finalGroupings: HandForm[]): void {
            let remainingMelds = grouping.remainingTiles.getUniqueMelds();
            if (remainingMelds.length == 0) {
                finalGroupings.push(grouping);
            } else {
                let nextMelds = grouping.remainingTiles.getAmbiguousMelds(remainingMelds);
                if (nextMelds.length == 0) {
                    nextMelds = [remainingMelds[0]];
                }
                for (let meld of nextMelds) {
                    let childGrouping = grouping.withNewMeldFromRemainingTiles(meld);
                    this.findFinalMeldGroupings(childGrouping, finalGroupings);
                }
            }
        }

        private sortTiles(): void {
            this.tiles = this.tiles.sort((a, b) => {
                if (a.type != b.type) {
                    return a.type - b.type;
                } else if (a.suit != b.suit) {
                    return a.suit - b.suit;
                } else {
                    return a.id - b.id;
                }
            });
        }

        public ofType(type: TileType): Tiles {
            return new Tiles(this.tiles.filter(t => t.type == type));
        }

        public concat(otherTiles: Tiles): Tiles {
            return new Tiles(this.tiles.concat(otherTiles.tiles));
        }

        public ofSuit(suit: Suit): Tiles {
            return new Tiles(this.tiles.filter(t => t.suit == suit));
        }

        public first(): Tile {
            return this.tiles[0];
        }

        public last(): Tile {
            return this.tiles[this.tiles.length - 1];
        }

        public isAllSameSuit(): boolean {
            let tile = this.first();
            for (let t of this.tiles) {
                if (t.suit != tile.suit) {
                    return false;
                }
            }
            return true;
        }

        public hasHonors(): boolean {
            return this.tiles.findIndex(t => t.isHonor()) > -1;
        }

        public hasTerminalsOrHonors(): boolean {
            return this.tiles.findIndex(t => t.isTerminalOrHonor()) > -1;
        }

        public hasTerminals(): boolean {
            return this.tiles.findIndex(t => t.isTerminal()) > -1;
        }

        public isAllTerminals(): boolean {
            return this.tiles.findIndex(t => !t.isTerminal()) < 0;
        }

        public isAllHonors(): boolean {
            return this.tiles.findIndex(t => !t.isHonor()) < 0;
        }

        public isAllTerminalsOrHonors(): boolean {
            return this.tiles.findIndex(t => !t.isTerminalOrHonor()) < 0;
        }

    }

    //class TileMetadata {
    //
    //    publ
    //    public used: boolean = false;ic visited: boolean = false;
    //
    //    constructor(public tile: Tile) {}
    //
    //}

}