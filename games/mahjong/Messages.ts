namespace Mahjong {
    "use strict";

    import GameMessage = Play.GameMessage;

    export enum TileId {
        Man1,
        Man2,
        Man3,
        Man4,
        Man5,
        Man6,
        Man7,
        Man8,
        Man9,
        Pin1,
        Pin2,
        Pin3,
        Pin4,
        Pin5,
        Pin6,
        Pin7,
        Pin8,
        Pin9,
        Sou1,
        Sou2,
        Sou3,
        Sou4,
        Sou5,
        Sou6,
        Sou7,
        Sou8,
        Sou9,
        East,
        South,
        West,
        North,
        Red,
        Green,
        White
    }

    export enum Wind {
        East,
        South,
        West,
        North,
    }

    export var WIND_SUCCESSION = new TileSuccession<Wind>([Wind.East, Wind.South, Wind.West, Wind.North], true);

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
                return undefined;
            } else {
                return this.list[nthIndex];
            }
        }

    }

    export enum MessageId {
        SMSG_DEAL_TILE = 1,
        CMSG_MOVE_REQUEST = 2,
        SMSG_MOVE = 3,
        SMSG_SEAT_START = 4
    }


    export enum MoveType {
        Chi,
        Pon,
        Richii,
        ClosedKan,
        OpenKan,
        Ron,
        Tsumo,
        Pass,
        Discard
    }

    export class Move {

        constructor(public type: MoveType, public tile: TileId) {
        }

    }

    export class Meld {
        public tiles: TileId[];
        public open: boolean;

        // todo: closed kan
    }

    enum TileType {
        Suite,
        Dragon,
        Wind,
    }
    enum SuiteType {
        Pin,
        Man,
        Sou
    }

    export class Tile {
        public id: TileId;

    }

    enum SetType {
        Chi,
        Pon,
        Kan
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
