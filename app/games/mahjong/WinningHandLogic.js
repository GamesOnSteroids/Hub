var Mahjong;
(function (Mahjong) {
    "use strict";
    class WinningHandLogic {
        constructor(table) {
            this.table = table;
        }
        getWinningHands(winningTile, hand) {
            let winningHands = [];
            if (!this.isFuriten(winningTile, hand)) {
                let finalHand = hand.createCloneWithNewTile(winningTile);
                let finalTiles = finalHand.getAllTiles();
                let handForms = finalHand.getCorrectForms();
                if (handForms.length > 0) {
                    for (let handForm of handForms) {
                        let winningHand = new Mahjong.WinningHand(hand);
                        if (finalHand.isTanyao()) {
                            winningHand.addType(Mahjong.WinningHandType.TANYAO);
                        }
                        if (finalHand.isClosed()) {
                            if (finalHand.riichi) {
                                winningHand.addType(Mahjong.WinningHandType.RIICHI);
                            }
                            if (this.table.isMyTurn(hand)) {
                                winningHand.addType(Mahjong.WinningHandType.MENZEN_TSUMO);
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
                        }
                        if (handForm.hasMixedTripleRun()) {
                            winningHand.addType(Mahjong.WinningHandType.MIXED_TRIPLE_RUN);
                        }
                        if (handForm.hasPureStraight()) {
                            winningHand.addType(Mahjong.WinningHandType.PURE_STRAIGHT);
                        }
                        let pons = handForm.getPons();
                        for (let pon of pons) {
                            let ponTile = pon.first();
                            if (ponTile.type == Mahjong.TileType.DRAGON) {
                                winningHand.addType(Mahjong.WinningHandType.DRAGON_PON);
                            }
                            else if (ponTile.type == Mahjong.TileType.WIND) {
                                if (ponTile.isWindType(this.table.prevailingWind)) {
                                    winningHand.addType(Mahjong.WinningHandType.WIND_PON);
                                }
                                if (ponTile.isWindType(hand.wind)) {
                                    winningHand.addType(Mahjong.WinningHandType.WIND_PON);
                                }
                            }
                        }
                        if (handForm.hasTerminalOrHonorInEachMeld()) {
                            if (finalTiles.isAllTerminalsOrHonors()) {
                                winningHand.addType(Mahjong.WinningHandType.ALL_TERMINALS_AND_HONORS);
                            }
                            else {
                                if (!finalTiles.hasHonors()) {
                                    winningHand.addType(Mahjong.WinningHandType.TERMINALS_IN_ALL_MELDS);
                                }
                                else {
                                    winningHand.addType(Mahjong.WinningHandType.CHANTA);
                                }
                            }
                        }
                        if (handForm.hasMixedTriplePon()) {
                            winningHand.addType(Mahjong.WinningHandType.MIXED_TRIPLE_PON);
                        }
                        if (pons.length >= 3) {
                            let closedPons = this.countClosedPons(winningTile, finalHand, handForm);
                            if (closedPons == 3) {
                                winningHand.addType(Mahjong.WinningHandType.THREE_CONCEALED_PONS);
                            }
                            else if (closedPons == 4) {
                                winningHand.types = [Mahjong.WinningHandType.FOUR_CONCEALED_PONS];
                                winningHands.push(winningHand);
                                continue;
                            }
                        }
                        let kans = handForm.getKans();
                        if (kans.length == 3) {
                            winningHand.addType(Mahjong.WinningHandType.THREE_KANS);
                        }
                        if (kans.length == 4) {
                            winningHand.types = [Mahjong.WinningHandType.FOUR_KANS];
                        }
                        if (kans.length != 4 && pons.length == 4) {
                            winningHand.addType(Mahjong.WinningHandType.TOI_TOI);
                        }
                        if (finalHand.isHalfFlush()) {
                            winningHand.addType(Mahjong.WinningHandType.HALF_FLUSH);
                        }
                        if (handForm.isLittleThreeDragons()) {
                            winningHand.addType(Mahjong.WinningHandType.LITTLE_THREE_DRAGONS);
                        }
                        if (finalHand.isFullFlush()) {
                            winningHand.addType(Mahjong.WinningHandType.FULL_FLUSH);
                        }
                        if (finalHand.isAllGreen()) {
                            winningHand.types = [Mahjong.WinningHandType.ALL_GREEEN];
                        }
                        else if (handForm.isBigThreeDragons()) {
                            winningHand.types = [Mahjong.WinningHandType.BIG_THREE_DRAGONS];
                        }
                        else if (handForm.isLittleFourWinds()) {
                            winningHand.types = [Mahjong.WinningHandType.LITTLE_FOUR_WINDS];
                        }
                        else if (handForm.isBigFourWinds()) {
                            winningHand.types = [Mahjong.WinningHandType.BIG_FOUR_WINDS];
                        }
                        else if (finalTiles.isAllHonors()) {
                            winningHand.types = [Mahjong.WinningHandType.ALL_HONORS];
                        }
                        else if (finalTiles.isAllTerminals()) {
                            winningHand.types = [Mahjong.WinningHandType.ALL_TERMINALS];
                        }
                        else if (finalHand.isNineGates()) {
                            winningHand.types = [Mahjong.WinningHandType.NINE_GATES];
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
        countClosedPons(winningTile, hand, handForm) {
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
                    if (tile.isWindType(seatWind)) {
                        return false;
                    }
                    else if (tile.isWindType(this.table.prevailingWind)) {
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
