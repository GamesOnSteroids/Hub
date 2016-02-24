var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
var Mahjong;
(function (Mahjong) {
    "use strict";
    var GameMessage = Play.GameMessage;
    (function (TileId) {
        TileId[TileId["Man1"] = 0] = "Man1";
        TileId[TileId["Man2"] = 1] = "Man2";
        TileId[TileId["Man3"] = 2] = "Man3";
        TileId[TileId["Man4"] = 3] = "Man4";
        TileId[TileId["Man5"] = 4] = "Man5";
        TileId[TileId["Man6"] = 5] = "Man6";
        TileId[TileId["Man7"] = 6] = "Man7";
        TileId[TileId["Man8"] = 7] = "Man8";
        TileId[TileId["Man9"] = 8] = "Man9";
        TileId[TileId["Pin1"] = 9] = "Pin1";
        TileId[TileId["Pin2"] = 10] = "Pin2";
        TileId[TileId["Pin3"] = 11] = "Pin3";
        TileId[TileId["Pin4"] = 12] = "Pin4";
        TileId[TileId["Pin5"] = 13] = "Pin5";
        TileId[TileId["Pin6"] = 14] = "Pin6";
        TileId[TileId["Pin7"] = 15] = "Pin7";
        TileId[TileId["Pin8"] = 16] = "Pin8";
        TileId[TileId["Pin9"] = 17] = "Pin9";
        TileId[TileId["Sou1"] = 18] = "Sou1";
        TileId[TileId["Sou2"] = 19] = "Sou2";
        TileId[TileId["Sou3"] = 20] = "Sou3";
        TileId[TileId["Sou4"] = 21] = "Sou4";
        TileId[TileId["Sou5"] = 22] = "Sou5";
        TileId[TileId["Sou6"] = 23] = "Sou6";
        TileId[TileId["Sou7"] = 24] = "Sou7";
        TileId[TileId["Sou8"] = 25] = "Sou8";
        TileId[TileId["Sou9"] = 26] = "Sou9";
        TileId[TileId["East"] = 27] = "East";
        TileId[TileId["South"] = 28] = "South";
        TileId[TileId["West"] = 29] = "West";
        TileId[TileId["North"] = 30] = "North";
        TileId[TileId["Red"] = 31] = "Red";
        TileId[TileId["Green"] = 32] = "Green";
        TileId[TileId["White"] = 33] = "White";
    })(Mahjong.TileId || (Mahjong.TileId = {}));
    var TileId = Mahjong.TileId;
    (function (Wind) {
        Wind[Wind["East"] = 0] = "East";
        Wind[Wind["South"] = 1] = "South";
        Wind[Wind["West"] = 2] = "West";
        Wind[Wind["North"] = 3] = "North";
    })(Mahjong.Wind || (Mahjong.Wind = {}));
    var Wind = Mahjong.Wind;
    Mahjong.WIND_SUCCESSION = new TileSuccession([Wind.East, Wind.South, Wind.West, Wind.North], true);
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
    (function (MessageId) {
        MessageId[MessageId["SMSG_DEAL_TILE"] = 1] = "SMSG_DEAL_TILE";
        MessageId[MessageId["CMSG_MOVE_REQUEST"] = 2] = "CMSG_MOVE_REQUEST";
        MessageId[MessageId["SMSG_MOVE"] = 3] = "SMSG_MOVE";
        MessageId[MessageId["SMSG_SEAT_START"] = 4] = "SMSG_SEAT_START";
    })(Mahjong.MessageId || (Mahjong.MessageId = {}));
    var MessageId = Mahjong.MessageId;
    (function (MoveType) {
        MoveType[MoveType["Chi"] = 0] = "Chi";
        MoveType[MoveType["Pon"] = 1] = "Pon";
        MoveType[MoveType["Richii"] = 2] = "Richii";
        MoveType[MoveType["ClosedKan"] = 3] = "ClosedKan";
        MoveType[MoveType["OpenKan"] = 4] = "OpenKan";
        MoveType[MoveType["Ron"] = 5] = "Ron";
        MoveType[MoveType["Tsumo"] = 6] = "Tsumo";
        MoveType[MoveType["Pass"] = 7] = "Pass";
        MoveType[MoveType["Discard"] = 8] = "Discard";
    })(Mahjong.MoveType || (Mahjong.MoveType = {}));
    var MoveType = Mahjong.MoveType;
    class Move {
        constructor(type, tile) {
            this.type = type;
            this.tile = tile;
        }
    }
    Mahjong.Move = Move;
    class Meld {
        constructor(tiles, type) {
            this.tiles = tiles;
            this.type = type;
        }
    }
    Mahjong.Meld = Meld;
    (function (TileType) {
        TileType[TileType["Suit"] = 0] = "Suit";
        TileType[TileType["Dragon"] = 1] = "Dragon";
        TileType[TileType["Wind"] = 2] = "Wind";
    })(Mahjong.TileType || (Mahjong.TileType = {}));
    var TileType = Mahjong.TileType;
    (function (Suit) {
        Suit[Suit["Pin"] = 0] = "Pin";
        Suit[Suit["Man"] = 1] = "Man";
        Suit[Suit["Sou"] = 2] = "Sou";
        Suit[Suit["Honor"] = 3] = "Honor";
    })(Mahjong.Suit || (Mahjong.Suit = {}));
    var Suit = Mahjong.Suit;
    (function (MeldType) {
        MeldType[MeldType["Chi"] = 0] = "Chi";
        MeldType[MeldType["Pon"] = 1] = "Pon";
        MeldType[MeldType["Kan"] = 2] = "Kan";
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
//# sourceMappingURL=Messages.js.map