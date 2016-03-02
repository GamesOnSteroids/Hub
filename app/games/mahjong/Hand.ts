namespace Mahjong {
    "use strict";

    export class Hand {
        public owner: PlayerInfo[];
        public tiles: Tiles;
        public openMelds: Meld[] = [];
        public closedKans: Meld[] = [];
        public wind: Wind;
        public pond: TileId[] = [];
        public riichi: boolean;

        public createClone(): Hand {
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

        public getAllTiles(): Tiles { //TODO: maybe as an attribute?
            let all = this.tiles.tiles.slice();
            for (let meld of this.openMelds.concat(this.closedKans)) {
                all = all.concat(meld.tiles.tiles);
            }
            return new Tiles(all);
        }

        public createCloneWithNewTile(tile: Tile): Hand {
            let hand = this.createClone();
            hand.tiles.tiles.push(tile);
            return hand;
        }

        public getCorrectForms(): HandForm[] {
            let requiredMeldCount = 4 - this.openMelds.length - this.closedKans.length;
            let meldGroupings = this.tiles.getPossibleGroupings();
            let forms: HandForm[] = [];
            for (let grouping of meldGroupings) {
                if (grouping.getMeldCount() == requiredMeldCount && grouping.remainingTilesFormPair()) {
                    forms.push(grouping.withNewMelds(this.openMelds).withNewMelds(this.closedKans));
                }
            }
            return forms;
        }

        public isAllTerminalsOrHonors(): boolean {
            return this.getAllTiles().isAllTerminalsOrHonors();
        }

        public isTanyao(): boolean {
            return !this.getAllTiles().hasTerminalsOrHonors();
        }

        public isFullFlush(): boolean {
            let tiles = this.getAllTiles();
            return !tiles.hasHonors() && tiles.isAllSameSuit();
        }

        public isAllGreen(): boolean {
            return this.getAllTiles().tiles.findIndex(t => !t.isGreen()) < 0;
        }

        public isHalfFlush(): boolean {
            let tiles = this.getAllTiles();
            let numberTiles = tiles.ofType(TileType.NUMBER);
            return tiles.hasHonors() && !numberTiles.isEmpty() && numberTiles.isAllSameSuit();
        }

        public isNineGates(): boolean {
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

        public isSevenPairs(): boolean {
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

        public isKokushiMusou(): boolean {
            if (!this.tiles.isAllTerminalsOrHonors()) {
                return false;
            }
            for (let tile of Tile.ofSuit(Suit.HONOR).concat(Tile.terminals())) {
                if (!this.tiles.contains(tile)) {
                    return false;
                }
            }
            return true;
        }

        public isTenpai(): boolean {
            return false; //TODO implement
        }

        public isClosed(): boolean {
            return this.openMelds.length == 0;
        }

    }

}