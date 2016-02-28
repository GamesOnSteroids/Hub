var Mahjong;
(function (Mahjong) {
    "use strict";
    class Table {
        constructor() {
            this.hands = [];
        }
        getAvailableMoves(newTileId, hand) {
            let newTile = Mahjong.TILE_MAP.get(newTileId);
            if (this.isMyTurn(hand)) {
                return this.getAvailableMovesOnYourTurn(newTile, hand);
            }
            else {
                return this.getAvailableMovesOnOpponentsTurn(newTile, hand);
            }
        }
        getAvailableMovesOnYourTurn(newTile, hand) {
            let moves = [
                new Mahjong.Move(Mahjong.MoveType.CHI, [Mahjong.TileId.MAN_1, Mahjong.TileId.MAN_2, Mahjong.TileId.MAN_3]),
                new Mahjong.Move(Mahjong.MoveType.PON, [Mahjong.TileId.MAN_3, Mahjong.TileId.MAN_3, Mahjong.TileId.MAN_3])
            ];
            return moves;
        }
        getAvailableMovesOnOpponentsTurn(newTile, hand) {
            let moves = [new Mahjong.Move(Mahjong.MoveType.PASS, null)];
            return moves;
        }
        isPreviousPlayerTurn(hand) {
            return Mahjong.WIND_SUCCESSION.precedes(this.currentTurn, hand.wind);
        }
        isMyTurn(hand) {
            return this.currentTurn == hand.wind;
        }
    }
    Mahjong.Table = Table;
})(Mahjong || (Mahjong = {}));
