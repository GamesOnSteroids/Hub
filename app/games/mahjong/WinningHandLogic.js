var Mahjong;
(function (Mahjong) {
    "use strict";
    class WinningHandLogic {
        constructor(table) {
            this.table = table;
        }
        getWinningHandTypes(winningTile, hand) {
            let winningHands = [];
            if (!this.isFuriten(winningTile, hand) && hand.tiles.size() == 13) {
                let finalHand = hand.createCloneWithNewTile(winningTile);
                let handForms = finalHand.getCorrectForms();
                if (handForms.length > 0) {
                    for (let handForm of handForms) {
                        let winningHand = new Mahjong.WinningHand(hand);
                        if (finalHand.isClosed()) {
                            if (finalHand.riichi) {
                                winningHand.addType(Mahjong.WinningHandType.RIICHI);
                            }
                            if (this.table.isMyTurn(hand)) {
                                winningHand.addType(Mahjong.WinningHandType.MENZEN_TSUMO);
                            }
                            if (finalHand.isTanyao()) {
                                winningHand.addType(Mahjong.WinningHandType.TANYAO);
                            }
                            let doubleRunCount = handForm.countDoubleRuns();
                            if (doubleRunCount == 1) {
                                winningHand.addType(Mahjong.WinningHandType.PURE_DOUBLE_RUN);
                            }
                            else if (doubleRunCount == 2) {
                                winningHand.addType(Mahjong.WinningHandType.TWICE_PURE_DOUBLE_RUN);
                            }
                            if (this.isPinfu(winningTile, handForm, hand.wind)) {
                                winningHand.addType(Mahjong.WinningHandType.PINFU);
                            }
                            if (handForm.hasMixedTripleRun()) {
                                winningHand.addType(Mahjong.WinningHandType.MIXED_TRIPLE_RUN);
                            }
                        }
                        if (winningHand.types.length > 0) {
                            winningHands.push(winningHand);
                        }
                    }
                }
                else {
                    let winningHand = new Mahjong.WinningHand(hand);
                    if (finalHand.isKokushiMusou()) {
                        winningHand.addType(Mahjong.WinningHandType.KOKUSHI_MUSOU);
                    }
                    else if (finalHand.isSevenPairs()) {
                        if (finalHand.isAllTerminalsOrHonors()) {
                            winningHand.addType(Mahjong.WinningHandType.BIG_SEVEN_PAIRS);
                        }
                        else {
                            winningHand.addType(Mahjong.WinningHandType.SEVEN_PAIRS);
                            if (finalHand.isTanyao()) {
                                winningHand.addType(Mahjong.WinningHandType.TANYAO);
                            }
                            if (finalHand.isHalfFlush()) {
                                winningHand.addType(Mahjong.WinningHandType.HALF_FLUSH);
                            }
                            else if (finalHand.isFullFlush()) {
                                winningHand.addType(Mahjong.WinningHandType.FULL_FLUSH);
                            }
                        }
                    }
                    winningHands.push(winningHand);
                }
            }
            return winningHands;
        }
        isPinfu(winningTile, handForm, seatWind) {
            return handForm.isAllRuns() &&
                handForm.wasOpenWait(winningTile) &&
                this.isValueless(handForm.firstRemainingTile(), seatWind);
        }
        isValueless(tile, seatWind) {
            if (tile.isHonor()) {
                if (tile.type == Mahjong.TileType.DRAGON) {
                    return false;
                }
                else {
                    let tileId = Mahjong.TileId[tile.id];
                    if (Mahjong.Wind[seatWind] == tileId) {
                        return false;
                    }
                    else if (Mahjong.Wind[this.table.prevailingWind] == tileId) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            }
            else {
                return true;
            }
        }
        isFuriten(tile, hand) {
            return false;
        }
    }
    Mahjong.WinningHandLogic = WinningHandLogic;
})(Mahjong || (Mahjong = {}));
