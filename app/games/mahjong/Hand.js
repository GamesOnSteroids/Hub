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
            return this.tiles.isAllTerminalsOrHonors();
        }
        isTanyao() {
            return !this.tiles.hasTerminalsOrHonors();
        }
        isFullFlush() {
            return !this.tiles.hasHonors() && this.tiles.isAllSameSuit();
        }
        isHalfFlush() {
            let numberTiles = this.tiles.ofType(Mahjong.TileType.NUMBER);
            return this.tiles.hasHonors() && !numberTiles.isEmpty() && numberTiles.isAllSameSuit();
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
            if (!this.tiles.isAllHonors()) {
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
