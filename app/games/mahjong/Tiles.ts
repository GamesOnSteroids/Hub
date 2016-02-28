namespace Mahjong {
    "use strict";

    export class Tiles {

        constructor(public tiles: Tile[]) {
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

        public getPossibleSets(tile: Tile, includeKan?: boolean): Meld[] {
            let sets: Meld[] = [];
            if (this.count(tile) >= 2) {
                sets.push(new Meld(new Tiles([tile, tile, tile]), MeldType.PON));
                if (includeKan && this.count(tile) >= 3) {
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
                                melds.push(new Meld(new Tiles([tile, nextTile, secondNextTile]), MeldType.CHI));
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
            for (let tile of this.unique().tiles) {
                let requiredCount = melds.map(m => m.count(tile)).reduce((a, b) => a + b, 0);
                if (requiredCount > this.count(tile)) {
                    for (let meld of melds.filter(m => m.contains(tile))) {
                        if (ambiguous.findIndex(m => m.equals(meld)) < 0) {
                            ambiguous.push(meld);
                        }
                    }
                }
            }
            return ambiguous;
        }

        public getPossibleGroupings(): MeldGrouping[] {
            this.sortTiles();
            let finalGroupings: MeldGrouping[] = [];
            this.findFinalMeldGroupings(new MeldGrouping([], this), finalGroupings);
            return this.uniqueGroupings(finalGroupings);
        }

        private uniqueGroupings(groupings: MeldGrouping[]): MeldGrouping[] {
            let result: MeldGrouping[] = [];
            for (let grouping of groupings) {
                if (result.findIndex(pg => pg.equals(grouping)) < 0) {
                    result.push(grouping);
                }
            }
            return result;
        }

        private findFinalMeldGroupings(grouping: MeldGrouping, finalGroupings: MeldGrouping[]): boolean {
            let remainingMelds = grouping.remainingTiles.getUniqueMelds();
            if (remainingMelds.length == 0) {
                finalGroupings.push(grouping);
                return true;
            } else {
                let hasFinalChild = false;
                let nextMelds = grouping.remainingTiles.getAmbiguousMelds(remainingMelds);
                if (nextMelds.length == 0) {
                    nextMelds = [remainingMelds[0]];
                }
                for (let meld of nextMelds) {
                    let childGrouping = grouping.withNewMeldFromRemainingTiles(meld);
                    if (this.findFinalMeldGroupings(childGrouping, finalGroupings)) {
                        hasFinalChild = true;
                    }
                }
                return hasFinalChild;
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

        //private ofType(type: TileType): Tiles {
        //    return new Tiles(this.tiles.filter(t => t.type == type));
        //}
        //
        //private concat(otherTiles: Tiles): Tiles {
        //    return new Tiles(this.tiles.concat(otherTiles.tiles));
        //}
        //
        //private ofSuit(suit: Suit): Tiles {
        //    return new Tiles(this.tiles.filter(t => t.suit == suit));
        //}

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