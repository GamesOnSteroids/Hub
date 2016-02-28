var Mahjong;
(function (Mahjong) {
    "use strict";
    var GameMessage = Play.GameMessage;
    (function (TileId) {
        TileId[TileId["MAN_1"] = 0] = "MAN_1";
        TileId[TileId["MAN_2"] = 1] = "MAN_2";
        TileId[TileId["MAN_3"] = 2] = "MAN_3";
        TileId[TileId["MAN_4"] = 3] = "MAN_4";
        TileId[TileId["MAN_5"] = 4] = "MAN_5";
        TileId[TileId["MAN_6"] = 5] = "MAN_6";
        TileId[TileId["MAN_7"] = 6] = "MAN_7";
        TileId[TileId["MAN_8"] = 7] = "MAN_8";
        TileId[TileId["MAN_9"] = 8] = "MAN_9";
        TileId[TileId["PIN_1"] = 9] = "PIN_1";
        TileId[TileId["PIN_2"] = 10] = "PIN_2";
        TileId[TileId["PIN_3"] = 11] = "PIN_3";
        TileId[TileId["PIN_4"] = 12] = "PIN_4";
        TileId[TileId["PIN_5"] = 13] = "PIN_5";
        TileId[TileId["PIN_6"] = 14] = "PIN_6";
        TileId[TileId["PIN_7"] = 15] = "PIN_7";
        TileId[TileId["PIN_8"] = 16] = "PIN_8";
        TileId[TileId["PIN_9"] = 17] = "PIN_9";
        TileId[TileId["SOU_1"] = 18] = "SOU_1";
        TileId[TileId["SOU_2"] = 19] = "SOU_2";
        TileId[TileId["SOU_3"] = 20] = "SOU_3";
        TileId[TileId["SOU_4"] = 21] = "SOU_4";
        TileId[TileId["SOU_5"] = 22] = "SOU_5";
        TileId[TileId["SOU_6"] = 23] = "SOU_6";
        TileId[TileId["SOU_7"] = 24] = "SOU_7";
        TileId[TileId["SOU_8"] = 25] = "SOU_8";
        TileId[TileId["SOU_9"] = 26] = "SOU_9";
        TileId[TileId["EAST"] = 27] = "EAST";
        TileId[TileId["SOUTH"] = 28] = "SOUTH";
        TileId[TileId["WEST"] = 29] = "WEST";
        TileId[TileId["NORTH"] = 30] = "NORTH";
        TileId[TileId["RED"] = 31] = "RED";
        TileId[TileId["GREEN"] = 32] = "GREEN";
        TileId[TileId["WHITE"] = 33] = "WHITE";
    })(Mahjong.TileId || (Mahjong.TileId = {}));
    var TileId = Mahjong.TileId;
    (function (Wind) {
        Wind[Wind["EAST"] = 0] = "EAST";
        Wind[Wind["SOUTH"] = 1] = "SOUTH";
        Wind[Wind["WEST"] = 2] = "WEST";
        Wind[Wind["NORTH"] = 3] = "NORTH";
    })(Mahjong.Wind || (Mahjong.Wind = {}));
    var Wind = Mahjong.Wind;
    class TileSuccession {
        constructor(list, circular) {
            this.list = list;
            this.circular = circular;
        }
        getNext(item) {
            return this.getNthFrom(item, 1);
        }
        getPrevious(item) {
            return this.getNthFrom(item, -1);
        }
        succedes(a, b) {
            return this.getNext(b) == a;
        }
        precedes(a, b) {
            return this.getNext(a) == b;
        }
        getNthFrom(item, n) {
            let index = this.list.indexOf(item);
            let nthIndex = index + n;
            if (this.circular) {
                nthIndex %= this.list.length;
            }
            if (nthIndex >= this.list.length || nthIndex < 0) {
                return null;
            }
            else {
                return this.list[nthIndex];
            }
        }
    }
    Mahjong.TileSuccession = TileSuccession;
    Mahjong.WIND_SUCCESSION = new TileSuccession([Wind.EAST, Wind.SOUTH, Wind.WEST, Wind.NORTH], true);
    (function (MessageId) {
        MessageId[MessageId["SMSG_DEAL_TILE"] = 1] = "SMSG_DEAL_TILE";
        MessageId[MessageId["CMSG_MOVE_REQUEST"] = 2] = "CMSG_MOVE_REQUEST";
        MessageId[MessageId["SMSG_MOVE"] = 3] = "SMSG_MOVE";
        MessageId[MessageId["SMSG_SEAT_START"] = 4] = "SMSG_SEAT_START";
    })(Mahjong.MessageId || (Mahjong.MessageId = {}));
    var MessageId = Mahjong.MessageId;
    (function (MoveType) {
        MoveType[MoveType["CHI"] = 0] = "CHI";
        MoveType[MoveType["PON"] = 1] = "PON";
        MoveType[MoveType["RIICHI"] = 2] = "RIICHI";
        MoveType[MoveType["CLOSED_KAN"] = 3] = "CLOSED_KAN";
        MoveType[MoveType["OPEN_KAN"] = 4] = "OPEN_KAN";
        MoveType[MoveType["RON"] = 5] = "RON";
        MoveType[MoveType["TSUMO"] = 6] = "TSUMO";
        MoveType[MoveType["PASS"] = 7] = "PASS";
        MoveType[MoveType["DISCARD"] = 8] = "DISCARD";
    })(Mahjong.MoveType || (Mahjong.MoveType = {}));
    var MoveType = Mahjong.MoveType;
    class Move {
        constructor(type, tiles) {
            this.type = type;
            this.tiles = tiles;
        }
    }
    Mahjong.Move = Move;
    class Meld {
        constructor(tiles, type) {
            this.tiles = tiles;
            this.type = type;
        }
        getTileIds() {
            return this.tiles.getTileIds();
        }
        count(tile) {
            return this.tiles.count(tile);
        }
        contains(tile) {
            return this.tiles.contains(tile);
        }
        equals(other) {
            return this.tiles.equals(other.tiles);
        }
        toString() {
            return this.tiles.tiles.map(t => t.toString()).join("/") + "::" + MeldType[this.type];
        }
    }
    Mahjong.Meld = Meld;
    class MeldCollection {
        constructor(melds) {
            this.melds = melds;
        }
    }
    Mahjong.MeldCollection = MeldCollection;
    (function (TileType) {
        TileType[TileType["NUMBER"] = 0] = "NUMBER";
        TileType[TileType["DRAGON"] = 1] = "DRAGON";
        TileType[TileType["WIND"] = 2] = "WIND";
    })(Mahjong.TileType || (Mahjong.TileType = {}));
    var TileType = Mahjong.TileType;
    (function (Suit) {
        Suit[Suit["PIN"] = 0] = "PIN";
        Suit[Suit["MAN"] = 1] = "MAN";
        Suit[Suit["SOU"] = 2] = "SOU";
        Suit[Suit["HONOR"] = 3] = "HONOR";
    })(Mahjong.Suit || (Mahjong.Suit = {}));
    var Suit = Mahjong.Suit;
    (function (MeldType) {
        MeldType[MeldType["CHI"] = 0] = "CHI";
        MeldType[MeldType["PON"] = 1] = "PON";
        MeldType[MeldType["KAN"] = 2] = "KAN";
    })(Mahjong.MeldType || (Mahjong.MeldType = {}));
    var MeldType = Mahjong.MeldType;
    class MoveRequestMessage extends GameMessage {
        constructor(moveType, tileId) {
            super(MessageId.SMSG_DEAL_TILE);
            this.moveType = moveType;
            this.tileId = tileId;
        }
    }
    Mahjong.MoveRequestMessage = MoveRequestMessage;
    class SeatStartMessage extends GameMessage {
        constructor(seatWind, yourWind) {
            super(MessageId.SMSG_SEAT_START);
            this.seatWind = seatWind;
            this.yourWind = yourWind;
        }
    }
    Mahjong.SeatStartMessage = SeatStartMessage;
    class DealTileMessage extends GameMessage {
        constructor(tileId) {
            super(MessageId.SMSG_DEAL_TILE);
            this.tileId = tileId;
        }
    }
    Mahjong.DealTileMessage = DealTileMessage;
})(Mahjong || (Mahjong = {}));
