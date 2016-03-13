var Mahjong;
(function (Mahjong) {
    "use strict";
    class Table {
        constructor() {
            this.hands = [];
            this.winningLogic = new Mahjong.WinningHandLogic(this);
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
            let moves = [];
            if (hand.riichi) {
                moves.push(new Mahjong.Move(Mahjong.MoveType.DISCARD, [newTile.id]));
            }
            else {
                moves.push(new Mahjong.Move(Mahjong.MoveType.DISCARD, hand.tiles.getTileIds().concat(newTile.id)));
            }
            let winningHands = this.winningLogic.getWinningHands(newTile, hand);
            if (winningHands.length > 0) {
                moves.push(new Mahjong.Move(Mahjong.MoveType.TSUMO, [newTile.id]));
            }
            return moves;
        }
        getAvailableMovesOnOpponentsTurn(newTile, hand) {
            let moves = [];
            if (!hand.riichi) {
                if (this.isPreviousPlayerTurn(hand)) {
                    hand.tiles.getPossibleRuns(newTile).forEach(meld => moves.push(new Mahjong.Move(Mahjong.MoveType.CHI, meld.getTileIds())));
                }
                hand.tiles.getPossibleSets(newTile).forEach(meld => {
                    let moveType = meld.type == Mahjong.MeldType.KAN ? Mahjong.MoveType.OPEN_KAN : Mahjong.MoveType.PON;
                    moves.push(new Mahjong.Move(moveType, meld.getTileIds()));
                });
            }
            let winningHandTypes = this.winningLogic.getWinningHands(newTile, hand);
            if (winningHandTypes.length > 0) {
                moves.push(new Mahjong.Move(Mahjong.MoveType.RON, [newTile.id]));
            }
            moves.push(new Mahjong.Move(Mahjong.MoveType.PASS, null));
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
