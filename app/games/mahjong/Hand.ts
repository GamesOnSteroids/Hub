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
            return this.tiles.isAllTerminalsOrHonors();
        }

        public isTanyao(): boolean {
            return !this.tiles.hasTerminalsOrHonors();
        }

        public isFullFlush(): boolean {
            return !this.tiles.hasHonors() && this.tiles.isAllSameSuit();
        }

        public isHalfFlush(): boolean {
            let numberTiles = this.tiles.ofType(TileType.NUMBER);
            return this.tiles.hasHonors() && !numberTiles.isEmpty() && numberTiles.isAllSameSuit();
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
            if (!this.tiles.isAllHonors()) {
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