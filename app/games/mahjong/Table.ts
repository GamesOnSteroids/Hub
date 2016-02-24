namespace Mahjong {
    "use strict";

    export class Table {
        public hands: Hand[];
        public currentTurn: Wind;

        public getAvailableMoves(newTile: TileId, hand: Hand): Move[] {
            if (this.isMyTurn(hand)) {
                return this.getAvailableMovesOnYourTurn(newTile, hand);
            } else {
                return this.getAvailableMovesOnOpponentsTurn(newTile, hand);
            }
        }

        private getAvailableMovesOnYourTurn(newTile: TileId, hand: Hand): Move[] {
            return [];
        }

        private getAvailableMovesOnOpponentsTurn(newTile: TileId, hand: Hand): Move[] {
            let moves: Move[] = [];
            if (this.isPreviousPlayerTurn(hand) && this.canCompleteRun(newTile, hand)) {
                moves.push(new Move(MoveType.Chi, newTile));
            }
            return moves;
        }

        private canCompleteRun(tile: TileId, hand: Hand): boolean {
            throw "Not implemented";
        }

        private isPreviousPlayerTurn(hand: Hand): boolean {
            return WIND_SUCCESSION.precedes(this.currentTurn, hand.wind);
        }

        private isMyTurn(hand: Hand): boolean {
            return this.currentTurn == hand.wind;
        }

    }

}