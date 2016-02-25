namespace Mahjong {
    "use strict";

    export class Table {
        public hands: Hand[];
        public currentTurn: Wind;

        public getAvailableMoves(newTileId: TileId, hand: Hand): Move[] {
            let newTile = TILE_MAP.get(newTileId);
            if (this.isMyTurn(hand)) {
                return this.getAvailableMovesOnYourTurn(newTile, hand);
            } else {
                return this.getAvailableMovesOnOpponentsTurn(newTile, hand);
            }
        }

        private getAvailableMovesOnYourTurn(newTile: Tile, hand: Hand): Move[] {
            return [];
        }

        private getAvailableMovesOnOpponentsTurn(newTile: Tile, hand: Hand): Move[] {
            let moves: Move[] = [ new Move(MoveType.PASS, null) ];
            if (this.isPreviousPlayerTurn(hand)) {
                hand.getPossibleRuns(newTile).forEach(meld => moves.push(new Move(MoveType.CHI, meld.getTileIds())));
            }
            hand.getPossibleSets(newTile).forEach(meld => {
                let moveType = meld.type == MeldType.KAN ? MoveType.OPEN_KAN : MoveType.PON;
                moves.push(new Move(moveType, meld.getTileIds()));
            });
            if (hand.isTenpai()) {

            }
            return moves;
        }

        private isPreviousPlayerTurn(hand: Hand): boolean {
            return WIND_SUCCESSION.precedes(this.currentTurn, hand.wind);
        }

        private isMyTurn(hand: Hand): boolean {
            return this.currentTurn == hand.wind;
        }

    }

}