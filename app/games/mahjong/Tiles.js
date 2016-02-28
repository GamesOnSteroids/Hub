var Mahjong;
(function (Mahjong) {
    "use strict";
    class Tiles {
        constructor(tiles) {
            this.tiles = tiles;
        }
        isEmpty() {
            return this.size() == 0;
        }
        size() {
            return this.tiles.length;
        }
        getTileIds() {
            return this.tiles.map(t => t.id);
        }
        toString() {
            return this.tiles.map(t => t.toString()).join(", ");
        }
        equals(other) {
            for (let tile of this.unique().tiles) {
                if (this.count(tile) != other.count(tile)) {
                    return false;
                }
            }
            return this.tiles.length == other.tiles.length;
        }
        withoutTile(tile) {
            let index = this.tiles.findIndex(t => t.id == tile.id);
            if (index < 0) {
                throw new Error("Tiles " + this.tiles + " do not contain tile " + tile);
            }
            else {
                let newTiles = this.tiles.slice();
                newTiles.splice(index, 1);
                return new Tiles(newTiles);
            }
        }
        createClone() {
            return new Tiles(this.tiles.slice());
        }
        withoutTiles(tiles) {
            let result = this.createClone();
            tiles.forEach(t => {
                result = result.withoutTile(t);
            });
            if (result == null) {
                result = new Tiles(this.tiles.slice());
            }
            return result;
        }
        getPossibleRuns(tile) {
            let runs = [];
            if (tile.type == Mahjong.TileType.NUMBER) {
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
            return runs.map(tiles => new Mahjong.Meld(tiles, Mahjong.MeldType.CHI));
        }
        getPossibleSets(tile, includeKan) {
            let sets = [];
            if (this.count(tile) >= 2) {
                sets.push(new Mahjong.Meld(new Tiles([tile, tile, tile]), Mahjong.MeldType.PON));
                if (includeKan && this.count(tile) >= 3) {
                    sets.push(new Mahjong.Meld(new Tiles([tile, tile, tile, tile]), Mahjong.MeldType.KAN));
                }
            }
            return sets;
        }
        contains(tile) {
            for (let t of this.tiles) {
                if (t.id == tile.id) {
                    return true;
                }
            }
            return false;
        }
        count(tile) {
            if (tile == null) {
                return 0;
            }
            else {
                return this.tiles.filter(t => t.id == tile.id).length;
            }
        }
        getUniqueMelds() {
            let melds = [];
            let uniqueTiles = this.unique().tiles;
            uniqueTiles.forEach((tile, i) => {
                if (this.count(tile) > 2) {
                    melds.push(new Mahjong.Meld(new Tiles([tile, tile, tile]), Mahjong.MeldType.PON));
                }
                if (tile.type == Mahjong.TileType.NUMBER && uniqueTiles.length > i + 1) {
                    let nextTile = uniqueTiles[i + 1];
                    if (nextTile.isAfter(tile)) {
                        if (uniqueTiles.length > i + 2) {
                            let secondNextTile = uniqueTiles[i + 2];
                            if (secondNextTile.isAfter(nextTile)) {
                                melds.push(new Mahjong.Meld(new Tiles([tile, nextTile, secondNextTile]), Mahjong.MeldType.CHI));
                            }
                        }
                    }
                }
            });
            return melds;
        }
        unique() {
            let results = [];
            for (let tile of this.tiles) {
                if (results.findIndex(t => t.id == tile.id) < 0) {
                    results.push(tile);
                }
            }
            return new Tiles(results);
        }
        getAmbiguousMelds(melds) {
            let ambiguous = [];
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
        getPossibleGroupings() {
            this.sortTiles();
            let finalGroupings = [];
            this.findFinalMeldGroupings(new Mahjong.MeldGrouping([], this), finalGroupings);
            return this.uniqueGroupings(finalGroupings);
        }
        uniqueGroupings(groupings) {
            let result = [];
            for (let grouping of groupings) {
                if (result.findIndex(pg => pg.equals(grouping)) < 0) {
                    result.push(grouping);
                }
            }
            return result;
        }
        findFinalMeldGroupings(grouping, finalGroupings) {
            let remainingMelds = grouping.remainingTiles.getUniqueMelds();
            if (remainingMelds.length == 0) {
                finalGroupings.push(grouping);
                return true;
            }
            else {
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
        sortTiles() {
            this.tiles = this.tiles.sort((a, b) => {
                if (a.type != b.type) {
                    return a.type - b.type;
                }
                else if (a.suit != b.suit) {
                    return a.suit - b.suit;
                }
                else {
                    return a.id - b.id;
                }
            });
        }
    }
    Mahjong.Tiles = Tiles;
})(Mahjong || (Mahjong = {}));
