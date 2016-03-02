namespace Mahjong {
    "use strict";



    export class Tile {

        public static MAN_1: Tile = new Tile(TileId.MAN_1, TileType.NUMBER, Suit.MAN, 1);
        public static MAN_2: Tile = new Tile(TileId.MAN_2, TileType.NUMBER, Suit.MAN, 2);
        public static MAN_3: Tile = new Tile(TileId.MAN_3, TileType.NUMBER, Suit.MAN, 3);
        public static MAN_4: Tile = new Tile(TileId.MAN_4, TileType.NUMBER, Suit.MAN, 4);
        public static MAN_5: Tile = new Tile(TileId.MAN_5, TileType.NUMBER, Suit.MAN, 5);
        public static MAN_6: Tile = new Tile(TileId.MAN_6, TileType.NUMBER, Suit.MAN, 6);
        public static MAN_7: Tile = new Tile(TileId.MAN_7, TileType.NUMBER, Suit.MAN, 7);
        public static MAN_8: Tile = new Tile(TileId.MAN_8, TileType.NUMBER, Suit.MAN, 8);
        public static MAN_9: Tile = new Tile(TileId.MAN_9, TileType.NUMBER, Suit.MAN, 9);

        public static SOU_1: Tile = new Tile(TileId.SOU_1, TileType.NUMBER, Suit.SOU, 1);
        public static SOU_2: Tile = new Tile(TileId.SOU_2, TileType.NUMBER, Suit.SOU, 2);
        public static SOU_3: Tile = new Tile(TileId.SOU_3, TileType.NUMBER, Suit.SOU, 3);
        public static SOU_4: Tile = new Tile(TileId.SOU_4, TileType.NUMBER, Suit.SOU, 4);
        public static SOU_5: Tile = new Tile(TileId.SOU_5, TileType.NUMBER, Suit.SOU, 5);
        public static SOU_6: Tile = new Tile(TileId.SOU_6, TileType.NUMBER, Suit.SOU, 6);
        public static SOU_7: Tile = new Tile(TileId.SOU_7, TileType.NUMBER, Suit.SOU, 7);
        public static SOU_8: Tile = new Tile(TileId.SOU_8, TileType.NUMBER, Suit.SOU, 8);
        public static SOU_9: Tile = new Tile(TileId.SOU_9, TileType.NUMBER, Suit.SOU, 9);

        public static PIN_1: Tile = new Tile(TileId.PIN_1, TileType.NUMBER, Suit.PIN, 1);
        public static PIN_2: Tile = new Tile(TileId.PIN_2, TileType.NUMBER, Suit.PIN, 2);
        public static PIN_3: Tile = new Tile(TileId.PIN_3, TileType.NUMBER, Suit.PIN, 3);
        public static PIN_4: Tile = new Tile(TileId.PIN_4, TileType.NUMBER, Suit.PIN, 4);
        public static PIN_5: Tile = new Tile(TileId.PIN_5, TileType.NUMBER, Suit.PIN, 5);
        public static PIN_6: Tile = new Tile(TileId.PIN_6, TileType.NUMBER, Suit.PIN, 6);
        public static PIN_7: Tile = new Tile(TileId.PIN_7, TileType.NUMBER, Suit.PIN, 7);
        public static PIN_8: Tile = new Tile(TileId.PIN_8, TileType.NUMBER, Suit.PIN, 8);
        public static PIN_9: Tile = new Tile(TileId.PIN_9, TileType.NUMBER, Suit.PIN, 9);
        
        public static EAST: Tile = new Tile(TileId.EAST, TileType.WIND, Suit.HONOR, 1);
        public static SOUTH: Tile = new Tile(TileId.SOUTH, TileType.WIND, Suit.HONOR, 2);
        public static WEST: Tile = new Tile(TileId.WEST, TileType.WIND, Suit.HONOR, 3);
        public static NORTH: Tile = new Tile(TileId.NORTH, TileType.WIND, Suit.HONOR, 4);
        
        public static RED: Tile = new Tile(TileId.RED, TileType.DRAGON, Suit.HONOR, 1);
        public static GREEN: Tile = new Tile(TileId.GREEN, TileType.DRAGON, Suit.HONOR, 2);
        public static WHITE: Tile = new Tile(TileId.WHITE, TileType.DRAGON, Suit.HONOR, 3);

        constructor(public id: TileId, public type: TileType, public suit: Suit, public value: number) {

        }

        public static findByValue(value: number, suit: Suit): Tile {
            for (let tile of TILE_MAP.values()) {
                if (tile.value == value && tile.suit == suit) {
                    return tile;
                }
            }
            return null;
        }

        public static ofSuit(suit: Suit): Tile[] {
            return Array.from(TILE_MAP.values()).filter(tile => tile.suit == suit);
        }

        public static ofType(type: TileType): Tile[] {
            return Array.from(TILE_MAP.values()).filter(tile => tile.type == type);
        }

        public static terminals(): Tile[] {
            return Array.from(TILE_MAP.values()).filter(tile => tile.isTerminal());
        }

        public ofDifferentSuit(suit: Suit): Tile {
            if (this.type != TileType.NUMBER) {
                throw new Error("Unable to find different suit for non-number tile");
            }
            if (suit == Suit.HONOR) {
                throw new Error("Unable to find tile for non-number suit");
            }
            if (this.type == TileType.NUMBER) {
                return Tile.ofSuit(suit).find(t => t.value == this.value);
            }
        }

        public equals(other: Tile): boolean {
            return this.id == other.id;
        }

        public isDragon(): boolean {
            return this.type == TileType.DRAGON;
        }

        public isWind(): boolean {
            return this.type == TileType.WIND;
        }

        public isGreen(): boolean {
            let greenSouValues = [2, 3, 4, 6, 8];
            let greenSou = this.suit == Suit.SOU && greenSouValues.indexOf(this.value) > -1;
            return greenSou || this.id == TileId.GREEN;
        }

        public isNumber(): boolean {
            return this.type == TileType.NUMBER;
        }

        public createPon(): Meld {
            return Meld.fromTileArray([this, this, this], MeldType.PON);
        }


        public createKan(): Meld {
            return Meld.fromTileArray([this, this, this, this], MeldType.KAN);
        }

        public isTerminal(): boolean {
            return this.type == TileType.NUMBER && (this.value == 1 || this.value == 9);
        }

        public isWindType(type: Wind): boolean {
            return TileId[this.id] == Wind[type];
        }

        public isHonor(): boolean {
            return this.suit == Suit.HONOR;
        }

        public isTerminalOrHonor(): boolean {
            return this.isTerminal() || this.isHonor();
        }

        public isAfter(other: Tile): boolean {
            if (other == null) {
                return false;
            } else {
                let next = other.getNext();
                if (next == null) {
                    return false;
                } else {
                    return this.id == next.id;
                }
            }
        }

        public getPrevious(): Tile {
            if (this.value == 1) {
                return null;
            } else {
                return TILE_MAP.get(this.id - 1);
            }
        }

        public getNext(): Tile {
            let maxVal = this.getMaxTypeValue();
            if (this.value == maxVal) {
                return null;
            } else {
                return TILE_MAP.get(this.id + 1);
            }
        }

        private getMaxTypeValue(): number {
            switch (this.type) {
                case TileType.DRAGON: return 3;
                case TileType.WIND: return 4;
                default: return 9;
            }
        }

        public toString(): string {
            return TileId[this.id];
        }

    }

    export var TILE_MAP: Map<TileId, Tile> = new Map<TileId, Tile>([
        [TileId.MAN_1, Tile.MAN_1],
        [TileId.MAN_2, Tile.MAN_2],
        [TileId.MAN_3, Tile.MAN_3],
        [TileId.MAN_4, Tile.MAN_4],
        [TileId.MAN_5, Tile.MAN_5],
        [TileId.MAN_6, Tile.MAN_6],
        [TileId.MAN_7, Tile.MAN_7],
        [TileId.MAN_8, Tile.MAN_8],
        [TileId.MAN_9, Tile.MAN_9],

        [TileId.SOU_1, Tile.SOU_1],
        [TileId.SOU_2, Tile.SOU_2],
        [TileId.SOU_3, Tile.SOU_3],
        [TileId.SOU_4, Tile.SOU_4],
        [TileId.SOU_5, Tile.SOU_5],
        [TileId.SOU_6, Tile.SOU_6],
        [TileId.SOU_7, Tile.SOU_7],
        [TileId.SOU_8, Tile.SOU_8],
        [TileId.SOU_9, Tile.SOU_9],

        [TileId.PIN_1, Tile.PIN_1],
        [TileId.PIN_2, Tile.PIN_2],
        [TileId.PIN_3, Tile.PIN_3],
        [TileId.PIN_4, Tile.PIN_4],
        [TileId.PIN_5, Tile.PIN_5],
        [TileId.PIN_6, Tile.PIN_6],
        [TileId.PIN_7, Tile.PIN_7],
        [TileId.PIN_8, Tile.PIN_8],
        [TileId.PIN_9, Tile.PIN_9],

        [TileId.EAST, Tile.EAST],
        [TileId.SOUTH, Tile.SOUTH],
        [TileId.WEST, Tile.WEST],
        [TileId.NORTH, Tile.NORTH],

        [TileId.RED, Tile.RED],
        [TileId.GREEN, Tile.GREEN],
        [TileId.WHITE, Tile.WHITE],
    ]);
}