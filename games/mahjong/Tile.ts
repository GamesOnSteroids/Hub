namespace Mahjong {
    "use strict";

    export var TILE_MAP: Map<TileId, Tile> = new Map<TileId, Tile>([
        [TileId.Man1, new Tile(TileId.Man1, TileType.Suit, Suit.Man)],
        [TileId.Man2, new Tile(TileId.Man2, TileType.Suit, Suit.Man)],
        [TileId.Man3, new Tile(TileId.Man3, TileType.Suit, Suit.Man)],
        [TileId.Man4, new Tile(TileId.Man4, TileType.Suit, Suit.Man)],
        [TileId.Man5, new Tile(TileId.Man5, TileType.Suit, Suit.Man)],
        [TileId.Man6, new Tile(TileId.Man6, TileType.Suit, Suit.Man)],
        [TileId.Man7, new Tile(TileId.Man7, TileType.Suit, Suit.Man)],
        [TileId.Man8, new Tile(TileId.Man8, TileType.Suit, Suit.Man)],
        [TileId.Man9, new Tile(TileId.Man9, TileType.Suit, Suit.Man)],

        [TileId.Sou1, new Tile(TileId.Sou1, TileType.Suit, Suit.Sou)],
        [TileId.Sou2, new Tile(TileId.Sou2, TileType.Suit, Suit.Sou)],
        [TileId.Sou3, new Tile(TileId.Sou3, TileType.Suit, Suit.Sou)],
        [TileId.Sou4, new Tile(TileId.Sou4, TileType.Suit, Suit.Sou)],
        [TileId.Sou5, new Tile(TileId.Sou5, TileType.Suit, Suit.Sou)],
        [TileId.Sou6, new Tile(TileId.Sou6, TileType.Suit, Suit.Sou)],
        [TileId.Sou7, new Tile(TileId.Sou7, TileType.Suit, Suit.Sou)],
        [TileId.Sou8, new Tile(TileId.Sou8, TileType.Suit, Suit.Sou)],
        [TileId.Sou9, new Tile(TileId.Sou9, TileType.Suit, Suit.Sou)],

        [TileId.Pin1, new Tile(TileId.Pin1, TileType.Suit, Suit.Pin)],
        [TileId.Pin2, new Tile(TileId.Pin2, TileType.Suit, Suit.Pin)],
        [TileId.Pin3, new Tile(TileId.Pin3, TileType.Suit, Suit.Pin)],
        [TileId.Pin4, new Tile(TileId.Pin4, TileType.Suit, Suit.Pin)],
        [TileId.Pin5, new Tile(TileId.Pin5, TileType.Suit, Suit.Pin)],
        [TileId.Pin6, new Tile(TileId.Pin6, TileType.Suit, Suit.Pin)],
        [TileId.Pin7, new Tile(TileId.Pin7, TileType.Suit, Suit.Pin)],
        [TileId.Pin8, new Tile(TileId.Pin8, TileType.Suit, Suit.Pin)],
        [TileId.Pin9, new Tile(TileId.Pin9, TileType.Suit, Suit.Pin)],

        [TileId.East, new Tile(TileId.East, TileType.Wind, Suit.Honor)],
        [TileId.South, new Tile(TileId.South, TileType.Wind, Suit.Honor)],
        [TileId.West, new Tile(TileId.West, TileType.Wind, Suit.Honor)],
        [TileId.North, new Tile(TileId.North, TileType.Wind, Suit.Honor)],

        [TileId.Red, new Tile(TileId.Red, TileType.Dragon, Suit.Honor)],
        [TileId.Green, new Tile(TileId.Green, TileType.Dragon, Suit.Honor)],
        [TileId.White, new Tile(TileId.White, TileType.Dragon, Suit.Honor)],
    ]);

    export class Tile {

        private succession: TileSuccession<Tile>;

        constructor(public id: TileId, public type: TileType, public suit: Suit) {
            this.succession = new TileSuccession<Tile>(Tile.ofSuit(suit), false);
        }

        public static ofSuit(suit: Suit): Tile[] {
            return Array.from(TILE_MAP.values()).filter(tile => tile.suit == suit);
        }

        public static ofType(type: TileType): Tile[] {
            return Array.from(TILE_MAP.values()).filter(tile => tile.type == type);
        }

        public getPrevious(): Tile {
            return this.succession.getPrevious(this);
        }

        public getNext(): Tile {
            return this.succession.getNext(this);
        }

        public succedes(tile: Tile): boolean {
            return this.succession.succedes(this, tile);
        }

        public precedes(tile: Tile): boolean {
            return this.succession.precedes(this, tile);
        }

    }

}