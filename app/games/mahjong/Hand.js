var Mahjong;
(function (Mahjong) {
    "use strict";
    class Hand {
        constructor() {
            this.openMelds = [];
            this.closedKans = [];
            this.pond = [];
        }
        createClone() {
            let hand = new Hand();
            hand.owner = this.owner;
            hand.tiles = this.tiles.createClone();
            hand.openMelds = this.openMelds.slice();
            hand.closedKans = this.closedKans.slice();
            hand.wind = this.wind;
            hand.pond = this.pond.slice();
            hand.riichi = this.riichi;
            return hand;
        }
        getAllTiles() {
            let all = this.tiles.tiles.slice();
            for (let meld of this.openMelds.concat(this.closedKans)) {
                all = all.concat(meld.tiles.tiles);
            }
            return new Mahjong.Tiles(all);
        }
        createCloneWithNewTile(tile) {
            let hand = this.createClone();
            hand.tiles.tiles.push(tile);
            return hand;
        }
        getCorrectForms() {
            let requiredMeldCount = 4 - this.openMelds.length - this.closedKans.length;
            let meldGroupings = this.tiles.getPossibleGroupings();
            let forms = [];
            for (let grouping of meldGroupings) {
                if (grouping.getMeldCount() == requiredMeldCount && grouping.remainingTilesFormPair()) {
                    forms.push(grouping.withNewMelds(this.openMelds).withNewMelds(this.closedKans));
                }
            }
            return forms;
        }
        isAllTerminalsOrHonors() {
            return this.getAllTiles().isAllTerminalsOrHonors();
        }
        isTanyao() {
            return !this.getAllTiles().hasTerminalsOrHonors();
        }
        isFullFlush() {
            let tiles = this.getAllTiles();
            return !tiles.hasHonors() && tiles.isAllSameSuit();
        }
        isAllGreen() {
            return this.getAllTiles().tiles.findIndex(t => !t.isGreen()) < 0;
        }
        isHalfFlush() {
            let tiles = this.getAllTiles();
            let numberTiles = tiles.ofType(Mahjong.TileType.NUMBER);
            return tiles.hasHonors() && !numberTiles.isEmpty() && numberTiles.isAllSameSuit();
        }
        isNineGates() {
            if (!this.isFullFlush() || !this.isClosed()) {
                return false;
            }
            let tiles = this.getAllTiles();
            for (let i = 2; i < 9; i++) {
                if (tiles.countValue(i) < 1) {
                    return false;
                }
            }
            if (tiles.countValue(1) < 3 || tiles.countValue(9) < 3) {
                return false;
            }
            return true;
        }
        isSevenPairs() {
            let uniqueTiles = this.tiles.unique();
            if (uniqueTiles.size() != 7) {
                return false;
            }
            for (let tile of uniqueTiles.tiles) {
                if (this.tiles.count(tile) != 2) {
                    return false;
                }
            }
            return true;
        }
        isKokushiMusou() {
            if (!this.tiles.isAllTerminalsOrHonors()) {
                return false;
            }
            for (let tile of Mahjong.Tile.ofSuit(Mahjong.Suit.HONOR).concat(Mahjong.Tile.terminals())) {
                if (!this.tiles.contains(tile)) {
                    return false;
                }
            }
            return true;
        }
        isTenpai() {
            return false;
        }
        isClosed() {
            return this.openMelds.length == 0;
        }
    }
    Mahjong.Hand = Hand;
})(Mahjong || (Mahjong = {}));
