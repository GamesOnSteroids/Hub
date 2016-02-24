namespace Mahjong {
    "use strict";

    export class Hand {
        public owner: PlayerInfo[];
        public tiles: Tile[];
        public openMelds: Meld[];
        public wind: Wind;
        public pond: TileId[];

        public getPossibleRuns(tile: Tile): Meld[] {
            let runs: Tile[][] = [];
            if (tile.type == TileType.Suit) {
                let previous = tile.getPrevious();
                let next = tile.getNext();
                if (this.hasTile(previous)) {
                    if (this.hasTile(next)) {
                        runs.push([previous, tile, next]);
                    }
                    if (this.hasTile(previous.getPrevious())) {
                        runs.push([previous.getPrevious(), previous, tile]);
                    }
                }
                if (this.hasTile(next) && this.hasTile(next.getNext())) {
                    runs.push([tile, next, next.getNext()]);
                }
            }
            return runs.map(tiles => new Meld(tiles, MeldType.Chi));
        }

        public hasTile(tile: Tile): boolean {
            if (tile == null) {
                return false;
            } else {
                return this.tiles.find(t => t.id == tile.id) != null;
            }
        }

    }



}