namespace Mahjong {
    "use strict";

    export class WinningHandLogic {

        constructor(public table: Table) {}
        
        public getWinningHands(winningTile: Tile, hand: Hand): WinningHand[] {
            let winningHands: WinningHand[] = [];
            if (!this.isFuriten(winningTile, hand)) {
                let finalHand = hand.createCloneWithNewTile(winningTile);
                let finalTiles = finalHand.getAllTiles();
                let handForms = finalHand.getCorrectForms();
                if (handForms.length > 0) {
                    for (let handForm of handForms) {
                        let winningHand = new WinningHand(hand);
                        if (finalHand.isTanyao()) {
                            winningHand.addType(WinningHandType.TANYAO);
                        }
                        if (finalHand.isClosed()) {
                            if (finalHand.riichi) {
                                winningHand.addType(WinningHandType.RIICHI);
                            }
                            if (this.table.isMyTurn(hand)) {
                                winningHand.addType(WinningHandType.MENZEN_TSUMO);
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
                        }
                        if (handForm.hasMixedTripleRun()) {
                            winningHand.addType(WinningHandType.MIXED_TRIPLE_RUN);
                        }
                        if (handForm.hasPureStraight()) {
                            winningHand.addType(WinningHandType.PURE_STRAIGHT);
                        }
                        let pons = handForm.getPons();
                        for (let pon of pons) {
                            let ponTile = pon.first();
                            if (ponTile.type == TileType.DRAGON) {
                                winningHand.addType(WinningHandType.DRAGON_PON);
                            } else if (ponTile.type == TileType.WIND) {
                                if (ponTile.isWindType(this.table.prevailingWind)) {
                                    winningHand.addType(WinningHandType.WIND_PON);
                                }
                                if (ponTile.isWindType(hand.wind)) {
                                    winningHand.addType(WinningHandType.WIND_PON);
                                }
                            }
                        }
                        if (handForm.hasTerminalOrHonorInEachMeld()) {
                            if (finalTiles.isAllTerminalsOrHonors()) {
                                winningHand.addType(WinningHandType.ALL_TERMINALS_AND_HONORS);
                            } else {
                                if (!finalTiles.hasHonors()) {
                                    winningHand.addType(WinningHandType.TERMINALS_IN_ALL_MELDS);
                                } else {
                                    winningHand.addType(WinningHandType.CHANTA);
                                }
                            }
                        }
                        if (handForm.hasMixedTriplePon()) {
                            winningHand.addType(WinningHandType.MIXED_TRIPLE_PON);
                        }
                        if (pons.length >= 3) {
                            let closedPons = this.countClosedPons(winningTile, finalHand, handForm);
                            if (closedPons == 3) {
                                winningHand.addType(WinningHandType.THREE_CONCEALED_PONS);
                            } else if (closedPons == 4) {
                                winningHand.types = [WinningHandType.FOUR_CONCEALED_PONS];
                                winningHands.push(winningHand);
                                continue;
                            }
                        }
                        let kans = handForm.getKans();
                        if (kans.length == 3) {
                            winningHand.addType(WinningHandType.THREE_KANS);
                        }
                        if (kans.length == 4) {
                            winningHand.types = [WinningHandType.FOUR_KANS];
                        }
                        if (kans.length != 4 && pons.length == 4) {
                            winningHand.addType(WinningHandType.TOI_TOI);
                        }
                        if (finalHand.isHalfFlush()) {
                            winningHand.addType(WinningHandType.HALF_FLUSH);
                        }
                        if (handForm.isLittleThreeDragons()) {
                            winningHand.addType(WinningHandType.LITTLE_THREE_DRAGONS);
                        }
                        if (finalHand.isFullFlush()) {
                            winningHand.addType(WinningHandType.FULL_FLUSH);
                        }
                        if (finalHand.isAllGreen()) {
                            winningHand.types = [WinningHandType.ALL_GREEEN];
                        } else if (handForm.isBigThreeDragons()) {
                            winningHand.types = [WinningHandType.BIG_THREE_DRAGONS];
                        } else if (handForm.isLittleFourWinds()) {
                            winningHand.types = [WinningHandType.LITTLE_FOUR_WINDS];
                        } else if (handForm.isBigFourWinds()) {
                            winningHand.types = [WinningHandType.BIG_FOUR_WINDS];
                        } else if (finalTiles.isAllHonors()) {
                            winningHand.types = [WinningHandType.ALL_HONORS];
                        } else if (finalTiles.isAllTerminals()) {
                            winningHand.types = [WinningHandType.ALL_TERMINALS];
                        } else if (finalHand.isNineGates()) {
                            winningHand.types = [WinningHandType.NINE_GATES];
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

        private countClosedPons(winningTile: Tile, hand: Hand, handForm: HandForm): number {
            let ponTiles = handForm.getPons().map(m => m.first());
            let closedPonTiles = hand.tiles.withoutTiles(handForm.getRunTiles()).withoutTiles(handForm.remainingTiles.tiles).unique();
            let closedPons = 0;
            for (let ponTile of ponTiles) {
                if (ponTile.id != winningTile.id) {
                    for (let kan of hand.closedKans) {
                        if (kan.contains(ponTile)) {
                            closedPons++;
                            break;
                        }
                    }
                    if (closedPonTiles.tiles.findIndex(tile => tile.id == ponTile.id) > -1) {
                        closedPons++;
                    }
                }
            }
            return closedPons;
        }

        private isPinfu(winningTile: Tile, handForm: HandForm, seatWind: Wind): boolean {
            return handForm.isAllRuns() &&
                handForm.wasOpenWait(winningTile) &&
                this.isValueless(handForm.firstRemainingTile(), seatWind);
        }

        private isValueless(tile: Tile, seatWind: Wind): boolean {
            if (tile.isHonor()) {
                if (tile.type == TileType.DRAGON) {
                    return false;
                } else {
                    if (tile.isWindType(seatWind)) {
                        return false;
                    } else if (tile.isWindType(this.table.prevailingWind)) {
                        return false;
                    } else {
                        return true;
                    }
                }
            } else {
                return true;
            }
        }

        private isFuriten(tile: Tile, hand: Hand): boolean {
            //TODO: implement
            return false;
        }
        
    }

}