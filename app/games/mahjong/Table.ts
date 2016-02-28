namespace Mahjong {
    "use strict";

    export class Table {
        public hands: Hand[] = [];
        public currentTurn: Wind;
        public prevailingWind: Wind;

        private winningLogic: WinningHandLogic;

        constructor() {
            this.winningLogic = new WinningHandLogic(this);
        }

        public getAvailableMoves(newTileId: TileId, hand: Hand): Move[] {
            let newTile = TILE_MAP.get(newTileId);
            if (this.isMyTurn(hand)) {
                return this.getAvailableMovesOnYourTurn(newTile, hand);
            } else {
                return this.getAvailableMovesOnOpponentsTurn(newTile, hand);
            }
        }

        private getAvailableMovesOnYourTurn(newTile: Tile, hand: Hand): Move[] {
            let moves: Move[] = [];
            if (hand.riichi) {
                moves.push(new Move(MoveType.DISCARD, [newTile.id]));
            } else {
                moves.push(new Move(MoveType.DISCARD, hand.tiles.getTileIds().concat(newTile.id)));
                //TODO: detect riichi
                //if (hand.isClosed() && hand.isTenpai() /*TODO: && there are enough remainingTiles for me to play another turn*/) {
                //    moves.push(new Move(MoveType.RIICHI, null));
                //}

            }
            let winningHandTypes = this.winningLogic.getWinningHandTypes(newTile, hand);
            if (winningHandTypes.length > 0) {
                moves.push(new Move(MoveType.TSUMO, [newTile.id]));
            }
            return moves;
        }

        private getAvailableMovesOnOpponentsTurn(newTile: Tile, hand: Hand): Move[] {
            let moves: Move[] = [];
            if (!hand.riichi) {
                if (this.isPreviousPlayerTurn(hand)) {
                    hand.tiles.getPossibleRuns(newTile).forEach(meld => moves.push(new Move(MoveType.CHI, meld.getTileIds())));
                }
                hand.tiles.getPossibleSets(newTile).forEach(meld => {
                    let moveType = meld.type == MeldType.KAN ? MoveType.OPEN_KAN : MoveType.PON;
                    moves.push(new Move(moveType, meld.getTileIds()));
                });
            }
            let winningHandTypes = this.winningLogic.getWinningHandTypes(newTile, hand);
            if (winningHandTypes.length > 0) {
                moves.push(new Move(MoveType.RON, [newTile.id]));
            }
            moves.push(new Move(MoveType.PASS, null));
            return moves;
        }

        private isPreviousPlayerTurn(hand: Hand): boolean {
            return WIND_SUCCESSION.precedes(this.currentTurn, hand.wind);
        }

        public isMyTurn(hand: Hand): boolean {
            return this.currentTurn == hand.wind;
        }

    }

}