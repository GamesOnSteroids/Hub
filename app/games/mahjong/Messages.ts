namespace Mahjong {
    "use strict";

    import GameMessage = Play.GameMessage;

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

    export var WIND_SUCCESSION = new TileSuccession<Wind>([Wind.East, Wind.South, Wind.West, Wind.North], true);


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

        constructor(public tiles: Tile[], public type: MeldType) {}

        public getTileIds(): TileId[] {
            return this.tiles.map(t => t.id);
        }

        public toString(): string {
            return this.tiles.map(t => t.toString()).join("/");
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
