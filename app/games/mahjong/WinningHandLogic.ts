namespace Mahjong {
    "use strict";

    export class WinningHandLogic {

        constructor(public table: Table) {}
        
        public getWinningHandTypes(winningTile: Tile, hand: Hand): WinningHand[] {
            let winningHands: WinningHand[] = [];
            if (!this.isFuriten(winningTile, hand) && hand.tiles.size() == 13) {
                let finalHand = hand.createCloneWithNewTile(winningTile);
                let handForms = finalHand.getCorrectForms();
                if (handForms.length > 0) {
                    for (let handForm of handForms) {
                        let winningHand = new WinningHand(hand);
                        if (finalHand.isClosed()) {
                            if (finalHand.riichi) {
                                winningHand.addType(WinningHandType.RIICHI);
                            }
                            if (this.table.isMyTurn(hand)) {
                                winningHand.addType(WinningHandType.MENZEN_TSUMO);
                            }
                            if (finalHand.isTanyao()) {
                                winningHand.addType(WinningHandType.TANYAO);
                            }
                            let doubleRunCount = handForm.countDoubleRuns();
                            if (doubleRunCount == 1) {
                                winningHand.addType(WinningHandType.PURE_DOUBLE_RUN);
                            } else if (doubleRunCount == 2) {
                                winningHand.addType(WinningHandType.TWICE_PURE_DOUBLE_RUN);
                            }
                            if (this.isPinfu(winningTile, handForm, hand.wind)) {
                                winningHand.addType(WinningHandType.PINFU);
                            }
                            if (handForm.hasMixedTripleRun()) {
                                winningHand.addType(WinningHandType.MIXED_TRIPLE_RUN);
                            }
                        }
                        if (winningHand.types.length > 0) {
                            winningHands.push(winningHand);
                        }
                    }
                } else {
                    let winningHand = new WinningHand(hand);
                    if (finalHand.isKokushiMusou()) {
                        winningHand.addType(WinningHandType.KOKUSHI_MUSOU);
                    } else if (finalHand.isSevenPairs()) {
                        if (finalHand.isAllTerminalsOrHonors()) {
                            winningHand.addType(WinningHandType.BIG_SEVEN_PAIRS);
                        } else {
                            winningHand.addType(WinningHandType.SEVEN_PAIRS);
                            if (finalHand.isTanyao()) {
                                winningHand.addType(WinningHandType.TANYAO);
                            }
                            if (finalHand.isHalfFlush()) {
                                winningHand.addType(WinningHandType.HALF_FLUSH);
                            } else if (finalHand.isFullFlush())  {
                                winningHand.addType(WinningHandType.FULL_FLUSH);
                            }
                        }
                    }
                    winningHands.push(winningHand);
                }
            }
            return winningHands;
        }

        public isPinfu(winningTile: Tile, handForm: HandForm, seatWind: Wind): boolean {
            return handForm.isAllRuns() &&
                handForm.wasOpenWait(winningTile) &&
                this.isValueless(handForm.firstRemainingTile(), seatWind);
        }

        public isValueless(tile: Tile, seatWind: Wind): boolean {
            if (tile.isHonor()) {
                if (tile.type == TileType.DRAGON) {
                    return false;
                } else {
                    let tileId = TileId[tile.id];
                    if (Wind[seatWind] == tileId) {
                        return false;
                    } else if (Wind[this.table.prevailingWind] == tileId) {
                        return false;
                    } else {
                        return true;
                    }
                }
            } else {
                return true;
            }
        }

        public isFuriten(tile: Tile, hand: Hand): boolean {
            //TODO: implement
            return false;
        }
        
    }

}