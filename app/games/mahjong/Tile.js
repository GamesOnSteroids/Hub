var Mahjong;
(function (Mahjong) {
    "use strict";
    class Tile {
        constructor(id, type, suit, value) {
            this.id = id;
            this.type = type;
            this.suit = suit;
            this.value = value;
        }
        static findByValue(value, suit) {
            for (let tile of Mahjong.TILE_MAP.values()) {
                if (tile.value == value && tile.suit == suit) {
                    return tile;
                }
            }
            return null;
        }
        static ofSuit(suit) {
            return Array.from(Mahjong.TILE_MAP.values()).filter(tile => tile.suit == suit);
        }
        static ofType(type) {
            return Array.from(Mahjong.TILE_MAP.values()).filter(tile => tile.type == type);
        }
        static terminals() {
            return Array.from(Mahjong.TILE_MAP.values()).filter(tile => tile.isTerminal());
        }
        ofDifferentSuit(suit) {
            if (this.type != Mahjong.TileType.NUMBER) {
                throw new Error("Unable to find different suit for non-number tile");
            }
            if (suit == Mahjong.Suit.HONOR) {
                throw new Error("Unable to find tile for non-number suit");
            }
            if (this.type == Mahjong.TileType.NUMBER) {
                return Tile.ofSuit(suit).find(t => t.value == this.value);
            }
        }
        equals(other) {
            return this.id == other.id;
        }
        isDragon() {
            return this.type == Mahjong.TileType.DRAGON;
        }
        isWind() {
            return this.type == Mahjong.TileType.WIND;
        }
        isGreen() {
            let greenSouValues = [2, 3, 4, 6, 8];
            let greenSou = this.suit == Mahjong.Suit.SOU && greenSouValues.indexOf(this.value) > -1;
            return greenSou || this.id == Mahjong.TileId.GREEN;
        }
        isNumber() {
            return this.type == Mahjong.TileType.NUMBER;
        }
        createPon() {
            return Mahjong.Meld.fromTileArray([this, this, this], Mahjong.MeldType.PON);
        }
        createKan() {
            return Mahjong.Meld.fromTileArray([this, this, this, this], Mahjong.MeldType.KAN);
        }
        isTerminal() {
            return this.type == Mahjong.TileType.NUMBER && (this.value == 1 || this.value == 9);
        }
        isWindType(type) {
            return Mahjong.TileId[this.id] == Mahjong.Wind[type];
        }
        isHonor() {
            return this.suit == Mahjong.Suit.HONOR;
        }
        isTerminalOrHonor() {
            return this.isTerminal() || this.isHonor();
        }
        isAfter(other) {
            if (other == null) {
                return false;
            }
            else {
                let next = other.getNext();
                if (next == null) {
                    return false;
                }
                else {
                    return this.id == next.id;
                }
            }
        }
        getPrevious() {
            if (this.value == 1) {
                return null;
            }
            else {
                return Mahjong.TILE_MAP.get(this.id - 1);
            }
        }
        getNext() {
            let maxVal = this.getMaxTypeValue();
            if (this.value == maxVal) {
                return null;
            }
            else {
                return Mahjong.TILE_MAP.get(this.id + 1);
            }
        }
        getMaxTypeValue() {
            switch (this.type) {
                case Mahjong.TileType.DRAGON: return 3;
                case Mahjong.TileType.WIND: return 4;
                default: return 9;
            }
        }
        toString() {
            return Mahjong.TileId[this.id];
        }
    }
    Tile.MAN_1 = new Tile(Mahjong.TileId.MAN_1, Mahjong.TileType.NUMBER, Mahjong.Suit.MAN, 1);
    Tile.MAN_2 = new Tile(Mahjong.TileId.MAN_2, Mahjong.TileType.NUMBER, Mahjong.Suit.MAN, 2);
    Tile.MAN_3 = new Tile(Mahjong.TileId.MAN_3, Mahjong.TileType.NUMBER, Mahjong.Suit.MAN, 3);
    Tile.MAN_4 = new Tile(Mahjong.TileId.MAN_4, Mahjong.TileType.NUMBER, Mahjong.Suit.MAN, 4);
    Tile.MAN_5 = new Tile(Mahjong.TileId.MAN_5, Mahjong.TileType.NUMBER, Mahjong.Suit.MAN, 5);
    Tile.MAN_6 = new Tile(Mahjong.TileId.MAN_6, Mahjong.TileType.NUMBER, Mahjong.Suit.MAN, 6);
    Tile.MAN_7 = new Tile(Mahjong.TileId.MAN_7, Mahjong.TileType.NUMBER, Mahjong.Suit.MAN, 7);
    Tile.MAN_8 = new Tile(Mahjong.TileId.MAN_8, Mahjong.TileType.NUMBER, Mahjong.Suit.MAN, 8);
    Tile.MAN_9 = new Tile(Mahjong.TileId.MAN_9, Mahjong.TileType.NUMBER, Mahjong.Suit.MAN, 9);
    Tile.SOU_1 = new Tile(Mahjong.TileId.SOU_1, Mahjong.TileType.NUMBER, Mahjong.Suit.SOU, 1);
    Tile.SOU_2 = new Tile(Mahjong.TileId.SOU_2, Mahjong.TileType.NUMBER, Mahjong.Suit.SOU, 2);
    Tile.SOU_3 = new Tile(Mahjong.TileId.SOU_3, Mahjong.TileType.NUMBER, Mahjong.Suit.SOU, 3);
    Tile.SOU_4 = new Tile(Mahjong.TileId.SOU_4, Mahjong.TileType.NUMBER, Mahjong.Suit.SOU, 4);
    Tile.SOU_5 = new Tile(Mahjong.TileId.SOU_5, Mahjong.TileType.NUMBER, Mahjong.Suit.SOU, 5);
    Tile.SOU_6 = new Tile(Mahjong.TileId.SOU_6, Mahjong.TileType.NUMBER, Mahjong.Suit.SOU, 6);
    Tile.SOU_7 = new Tile(Mahjong.TileId.SOU_7, Mahjong.TileType.NUMBER, Mahjong.Suit.SOU, 7);
    Tile.SOU_8 = new Tile(Mahjong.TileId.SOU_8, Mahjong.TileType.NUMBER, Mahjong.Suit.SOU, 8);
    Tile.SOU_9 = new Tile(Mahjong.TileId.SOU_9, Mahjong.TileType.NUMBER, Mahjong.Suit.SOU, 9);
    Tile.PIN_1 = new Tile(Mahjong.TileId.PIN_1, Mahjong.TileType.NUMBER, Mahjong.Suit.PIN, 1);
    Tile.PIN_2 = new Tile(Mahjong.TileId.PIN_2, Mahjong.TileType.NUMBER, Mahjong.Suit.PIN, 2);
    Tile.PIN_3 = new Tile(Mahjong.TileId.PIN_3, Mahjong.TileType.NUMBER, Mahjong.Suit.PIN, 3);
    Tile.PIN_4 = new Tile(Mahjong.TileId.PIN_4, Mahjong.TileType.NUMBER, Mahjong.Suit.PIN, 4);
    Tile.PIN_5 = new Tile(Mahjong.TileId.PIN_5, Mahjong.TileType.NUMBER, Mahjong.Suit.PIN, 5);
    Tile.PIN_6 = new Tile(Mahjong.TileId.PIN_6, Mahjong.TileType.NUMBER, Mahjong.Suit.PIN, 6);
    Tile.PIN_7 = new Tile(Mahjong.TileId.PIN_7, Mahjong.TileType.NUMBER, Mahjong.Suit.PIN, 7);
    Tile.PIN_8 = new Tile(Mahjong.TileId.PIN_8, Mahjong.TileType.NUMBER, Mahjong.Suit.PIN, 8);
    Tile.PIN_9 = new Tile(Mahjong.TileId.PIN_9, Mahjong.TileType.NUMBER, Mahjong.Suit.PIN, 9);
    Tile.EAST = new Tile(Mahjong.TileId.EAST, Mahjong.TileType.WIND, Mahjong.Suit.HONOR, 1);
    Tile.SOUTH = new Tile(Mahjong.TileId.SOUTH, Mahjong.TileType.WIND, Mahjong.Suit.HONOR, 2);
    Tile.WEST = new Tile(Mahjong.TileId.WEST, Mahjong.TileType.WIND, Mahjong.Suit.HONOR, 3);
    Tile.NORTH = new Tile(Mahjong.TileId.NORTH, Mahjong.TileType.WIND, Mahjong.Suit.HONOR, 4);
    Tile.RED = new Tile(Mahjong.TileId.RED, Mahjong.TileType.DRAGON, Mahjong.Suit.HONOR, 1);
    Tile.GREEN = new Tile(Mahjong.TileId.GREEN, Mahjong.TileType.DRAGON, Mahjong.Suit.HONOR, 2);
    Tile.WHITE = new Tile(Mahjong.TileId.WHITE, Mahjong.TileType.DRAGON, Mahjong.Suit.HONOR, 3);
    Mahjong.Tile = Tile;
    Mahjong.TILE_MAP = new Map([
        [Mahjong.TileId.MAN_1, Tile.MAN_1],
        [Mahjong.TileId.MAN_2, Tile.MAN_2],
        [Mahjong.TileId.MAN_3, Tile.MAN_3],
        [Mahjong.TileId.MAN_4, Tile.MAN_4],
        [Mahjong.TileId.MAN_5, Tile.MAN_5],
        [Mahjong.TileId.MAN_6, Tile.MAN_6],
        [Mahjong.TileId.MAN_7, Tile.MAN_7],
        [Mahjong.TileId.MAN_8, Tile.MAN_8],
        [Mahjong.TileId.MAN_9, Tile.MAN_9],
        [Mahjong.TileId.SOU_1, Tile.SOU_1],
        [Mahjong.TileId.SOU_2, Tile.SOU_2],
        [Mahjong.TileId.SOU_3, Tile.SOU_3],
        [Mahjong.TileId.SOU_4, Tile.SOU_4],
        [Mahjong.TileId.SOU_5, Tile.SOU_5],
        [Mahjong.TileId.SOU_6, Tile.SOU_6],
        [Mahjong.TileId.SOU_7, Tile.SOU_7],
        [Mahjong.TileId.SOU_8, Tile.SOU_8],
        [Mahjong.TileId.SOU_9, Tile.SOU_9],
        [Mahjong.TileId.PIN_1, Tile.PIN_1],
        [Mahjong.TileId.PIN_2, Tile.PIN_2],
        [Mahjong.TileId.PIN_3, Tile.PIN_3],
        [Mahjong.TileId.PIN_4, Tile.PIN_4],
        [Mahjong.TileId.PIN_5, Tile.PIN_5],
        [Mahjong.TileId.PIN_6, Tile.PIN_6],
        [Mahjong.TileId.PIN_7, Tile.PIN_7],
        [Mahjong.TileId.PIN_8, Tile.PIN_8],
        [Mahjong.TileId.PIN_9, Tile.PIN_9],
        [Mahjong.TileId.EAST, Tile.EAST],
        [Mahjong.TileId.SOUTH, Tile.SOUTH],
        [Mahjong.TileId.WEST, Tile.WEST],
        [Mahjong.TileId.NORTH, Tile.NORTH],
        [Mahjong.TileId.RED, Tile.RED],
        [Mahjong.TileId.GREEN, Tile.GREEN],
        [Mahjong.TileId.WHITE, Tile.WHITE],
    ]);
})(Mahjong || (Mahjong = {}));
