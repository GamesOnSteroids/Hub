namespace Mahjong {
    "use strict";

    import GameMessage = Play.GameMessage;
    import IGameVariant = Play.IGameVariant;

    export interface IMahjongVariant extends IGameVariant{

    }

    export enum TileId {
        MAN_1,
        MAN_2,
        MAN_3,
        MAN_4,
        MAN_5,
        MAN_6,
        MAN_7,
        MAN_8,
        MAN_9,
        PIN_1,
        PIN_2,
        PIN_3,
        PIN_4,
        PIN_5,
        PIN_6,
        PIN_7,
        PIN_8,
        PIN_9,
        SOU_1,
        SOU_2,
        SOU_3,
        SOU_4,
        SOU_5,
        SOU_6,
        SOU_7,
        SOU_8,
        SOU_9,
        EAST,
        SOUTH,
        WEST,
        NORTH,
        RED,
        GREEN,
        WHITE
    }

    export enum Wind {
        EAST,
        SOUTH,
        WEST,
        NORTH,
    }

    export class TileSuccession<T> {

        constructor(private list: T[], private circular: boolean) {}

        public getNext(item: T): T {
            return this.getNthFrom(item, 1);
        }

        public getPrevious(item: T): T {
            return this.getNthFrom(item, -1);
        }

        public succedes(a: T, b: T): boolean {
            return this.getNext(b) == a;
        }

        public precedes(a: T, b: T): boolean {
            return this.getNext(a) == b;
        }

        private getNthFrom(item: T, n: number): T {
            let index = this.list.indexOf(item);
            let nthIndex = index + n;
            if (this.circular) {
                nthIndex %= this.list.length;
            }
            if (nthIndex >= this.list.length || nthIndex < 0) {
                return null;
            } else {
                return this.list[nthIndex];
            }
        }

    }

    export var WIND_SUCCESSION = new TileSuccession<Wind>([Wind.EAST, Wind.SOUTH, Wind.WEST, Wind.NORTH], true);


    export enum MessageId {
        SMSG_DEAL_TILE = 1,
        CMSG_MOVE_REQUEST = 2,
        SMSG_MOVE = 3,
        SMSG_SEAT_START = 4
    }

    export enum MoveType {
        CHI,
        PON,
        RIICHI,
        CLOSED_KAN,
        OPEN_KAN,
        RON,
        TSUMO,
        PASS,
        DISCARD
    }

    export class Move {

        constructor(public type: MoveType, public tiles: TileId[]) {
        }

    }

    export class Meld {
        public open: boolean;

        constructor(public tiles: Tiles, public type: MeldType) {}

        public static fromTileArray(tiles: Tile[], type: MeldType): Meld {
            return new Meld(new Tiles(tiles), type);
        }

        public ofDifferentSuit(suit: Suit): Meld {
            return Meld.fromTileArray(this.tiles.tiles.map(t => t.ofDifferentSuit(suit)), this.type);
        }

        public getTileIds(): TileId[] {
            return this.tiles.getTileIds();
        }

        public count(tile: Tile): number {
            return this.tiles.count(tile);
        }

        public first(): Tile {
            return this.tiles.first();
        }

        public startsWith(tile: Tile): boolean {
            return this.tiles.first().id == tile.id;
        }

        public endsWith(tile: Tile): boolean {
            return this.tiles.last().id == tile.id;
        }

        public wasOpenWait(tile: Tile): boolean {
            if (!this.contains(tile)) {
                throw new Error("Tile " + tile.toString() + " does not appear in meld " + this.toString());
            }
            if (this.type != MeldType.CHI) {
                throw new Error("Open wait can be only determined on " + MeldType[MeldType.CHI] + " meld type");
            }
            let first = this.tiles.first();
            if (tile.value == first.value + 1) {
                return false;
            } else if (first.value == 1 && tile.value == 3) {
                return false;
            } else if (first.id == tile.id && first.value == 7) {
                return false;
            } else {
                return true;
            }
        }

        public hasIntersection(other: Meld): boolean {
            for (let tile of other.tiles.tiles) {
                if (this.contains(tile)) {
                    return true;
                }
            }
            return false;
        }

        public contains(tile: Tile): boolean {
            return this.tiles.contains(tile);
        }

        public equals(other: Meld): boolean {
            return this.tiles.equals(other.tiles);
        }

        public toString(): string {
            return this.tiles.tiles.map(t => t.toString()).join("/");
        }
        // todo: closed kan
    }

    export class MeldCollection {

        constructor(public melds: Meld[]) {}

    }

    export enum TileType {
        NUMBER,
        DRAGON,
        WIND,
    }

    export enum Suit {
        PIN,
        MAN,
        SOU,
        HONOR
    }

    export enum MeldType {
        CHI,
        PON,
        KAN
    }

    export class MoveRequestMessage extends GameMessage {
        constructor(public moveType: MoveType, public tileId: TileId) {
            super(MessageId.SMSG_DEAL_TILE);
        }
    }

    export class SeatStartMessage extends GameMessage {
        constructor(public seatWind: Wind, public yourWind: Wind) {
            super(MessageId.SMSG_SEAT_START);
        }
    }

    export class DealTileMessage extends GameMessage {
        constructor(public tileId: TileId) {
            super(MessageId.SMSG_DEAL_TILE);
        }
    }


}
