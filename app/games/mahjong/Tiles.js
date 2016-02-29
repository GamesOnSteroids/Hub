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
        getPossibleSets(tile) {
            let sets = [];
            if (this.count(tile) >= 2) {
                sets.push(new Mahjong.Meld(new Tiles([tile, tile, tile]), Mahjong.MeldType.PON));
                if (this.count(tile) >= 3) {
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
                                melds.push(Mahjong.Meld.fromTileArray([tile, nextTile, secondNextTile], Mahjong.MeldType.CHI));
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
        getPossibleGroupings() {
            this.sortTiles();
            let finalGroupings = [];
            this.findFinalMeldGroupings(new Mahjong.HandForm([], this), finalGroupings);
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
            }
            else {
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
        ofType(type) {
            return new Tiles(this.tiles.filter(t => t.type == type));
        }
        concat(otherTiles) {
            return new Tiles(this.tiles.concat(otherTiles.tiles));
        }
        ofSuit(suit) {
            return new Tiles(this.tiles.filter(t => t.suit == suit));
        }
        first() {
            return this.tiles[0];
        }
        last() {
            return this.tiles[this.tiles.length - 1];
        }
        isAllSameSuit() {
            let tile = this.first();
            for (let t of this.tiles) {
                if (t.suit != tile.suit) {
                    return false;
                }
            }
            return true;
        }
        hasHonors() {
            return this.tiles.findIndex(t => t.isHonor()) > -1;
        }
        hasTerminalsOrHonors() {
            return this.tiles.findIndex(t => t.isTerminalOrHonor()) > -1;
        }
        hasTerminals() {
            return this.tiles.findIndex(t => t.isTerminal()) > -1;
        }
        isAllTerminals() {
            return this.tiles.findIndex(t => !t.isTerminal()) < 0;
        }
        isAllHonors() {
            return this.tiles.findIndex(t => !t.isHonor()) < 0;
        }
        isAllTerminalsOrHonors() {
            return this.tiles.findIndex(t => !t.isTerminalOrHonor()) < 0;
        }
    }
    Mahjong.Tiles = Tiles;
})(Mahjong || (Mahjong = {}));
