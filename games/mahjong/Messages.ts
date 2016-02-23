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

    enum Wind {
        East,
        South,
        West,
        North,
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
