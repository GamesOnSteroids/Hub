namespace Mahjong {
    "use strict";

    export class Tiles {

        constructor(public tiles: Tile[]) {}

        public isEmpty(): boolean {
            return this.size() == 0;
        }

        public size(): number {
            return this.tiles.length;
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
            let runs: Tile[][] = [];
            if (tile.type == TileType.NUMBER) {
                let previous = tile.getPrevious();
                let next = tile.getNext();
                if (this.contains(previous)) {
                    if (this.contains(next)) {
                        runs.push([previous, tile, next]);
                    }
                    if (this.contains(previous.getPrevious())) {
                        runs.push([previous.getPrevious(), previous, tile]);
                    }
                }
                if (this.contains(next) && this.contains(next.getNext())) {
                    runs.push([tile, next, next.getNext()]);
                }
            }
            return runs.map(tiles => new Meld(tiles, MeldType.CHI));
        }

        public getPossibleSets(tile: Tile, includeKan: boolean = true): Meld[] {
            let sets: Meld[] = [];
            if (this.containsAtLeast(tile, 2)) {
                sets.push(new Meld([tile, tile, tile], MeldType.PON));
                if (includeKan && this.containsAtLeast(tile, 3)) {
                    sets.push(new Meld([tile, tile, tile, tile], MeldType.KAN));
                }
            }
            return sets;
        }

        public getPossibleMelds(tile: Tile, includeKan: boolean = true): Meld[] {
            return this.getPossibleRuns(tile).concat(this.getPossibleSets(tile, includeKan));
        }

        public contains(tile: Tile): boolean {
            return this.containsAtLeast(tile, 1);
        }

        public containsAtLeast(tile: Tile, minimumCount: number): boolean {
            if (tile == null) {
                return false;
            } else {
                return this.tiles.filter(t => t.id == tile.id).length >= minimumCount;
            }
        }

        public getAllMelds(): Meld[] {
            let melds: Meld[] = [];
            this.tiles.forEach((tile, i) => {
                if (this.tiles.length > i + 1) {
                    let nextTile = this.tiles[i + 1];
                    if (nextTile.id == tile.id) {
                        if (this.tiles.length > i + 2) {
                            let secondNextTile = this.tiles[i + 2];
                            if (secondNextTile.id == tile.id) {
                                melds.push(new Meld([tile, tile, tile], MeldType.PON));
                            }
                        }
                    } else if (nextTile.succedes(tile)) {
                        if (this.tiles.length > i + 2) {
                            let secondNextTile = this.tiles[i + 2];
                            if (secondNextTile.succedes(nextTile)) {
                                melds.push(new Meld([tile, nextTile, secondNextTile], MeldType.CHI));
                            }
                        }
                    }
                }
            });
            return melds;
        }

        public getPossibleGroupings(): MeldGrouping[] {
            this.sortTiles();
            return this.findFinalGroupings(new MeldGrouping([], this));
        }
        //public getPossibleGroupings(): MeldGrouping[] {
        //    this.sortTiles();
        //    let finalGroupings: MeldGrouping[] = [];
        //    this.findFinalMeldGroupings(new MeldGrouping([], this), finalGroupings);
        //    return finalGroupings;
        //}

        public toString(): string {
            return this.tiles.map(t => t.toString()).join(", ");
        }

        private findFinalGroupings(grouping: MeldGrouping): MeldGrouping[] {
            let groupings: MeldGrouping[] = [];
            for (let tile of grouping.remainingTiles.tiles) {
                let remainingHand = grouping.remainingTiles.withoutTile(tile);
                let melds = remainingHand.getPossibleMelds(tile);

                if (grouping.remainingTiles.getAllMelds().length == 0) {
                    console.log("current grouping: " + grouping.toString());
                    return [grouping];
                }
                //if (melds.length > 1) {
                for (let meld of melds) {
                    let newMelds = grouping.melds.slice();
                    newMelds.push(meld);
                    for (let group of this.findFinalGroupings(new MeldGrouping(newMelds, grouping.remainingTiles.withoutTiles(meld.tiles)))) {
                        groupings.push(group);
                    }
                }
                //}
            }
            return groupings;
        }

        //private findFinalMeldGroupings(grouping: MeldGrouping, finalGroupings: MeldGrouping[]): boolean {
        //    let remainingMelds = grouping.remainingTiles.getAllMelds();
        //    if (remainingMelds.length == 0) {
        //        console.log("found grouping without remaining melds: " + grouping.toString());
        //        finalGroupings.push(grouping);
        //        return true;
        //    } else {
        //        let hasFinalChild = false;
        //        for (let meld of remainingMelds) {
        //            let melds = grouping.melds.slice();
        //            melds.push(meld);
        //            let childGrouping = new MeldGrouping(melds, grouping.remainingTiles.withoutTiles(meld.tiles));
        //            if (this.findFinalMeldGroupings(childGrouping, finalGroupings)) {
        //                hasFinalChild = true;
        //            }
        //        }
        //        return hasFinalChild;
        //    }
        //}

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