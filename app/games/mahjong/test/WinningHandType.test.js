var Mahjong;
(function (Mahjong) {
    var Test;
    (function (Test) {
        "use strict";
        describe("winning hand tests", () => {
            let table = new Mahjong.Table();
            let logic = new Mahjong.WinningHandLogic(table);
            let defaultHand = new Mahjong.Hand();
            table.prevailingWind = Mahjong.Wind.SOUTH;
            table.currentTurn = Mahjong.Wind.NORTH;
            defaultHand.wind = Mahjong.Wind.SOUTH;
            defaultHand.tiles = Mahjong.Tiles.parse("M12233456789EE");
            beforeEach(() => {
            });
            afterEach(() => {
            });
            let typeIdsToString = (typeIds) => {
                return "[" + typeIds.map(t => Mahjong.WinningHandTypeId[t]).join(", ") + "]";
            };
            let typesToString = (types) => {
                return typeIdsToString(types.map(t => t.id));
            };
            let expectHandTypesContain = (typeIds, typeId) => {
                expect(typeIds).toContain(typeId, "Expected " + typeIdsToString(typeIds) + " to contain " + Mahjong.WinningHandTypeId[typeId]);
                typeIds.splice(typeIds.findIndex(t => t == typeId), 1);
            };
            let expectHandTypes = (hand, winningTile, ...winningTypes) => {
                let winningHands = logic.getWinningHands(winningTile, hand);
                expect(winningHands.length).toBe(1, "Expected one winning hand");
                let typeIds = winningHands[0].types.map(t => t.id);
                expect(typeIds.length).toBe(winningTypes.length, "Expected " + winningTypes.length + " winnig hand types (" + typesToString(winningTypes) +
                    ", got " + typeIds.length + " (" + typeIdsToString(typeIds) + ")");
                winningTypes.forEach(wt => expectHandTypesContain(typeIds, wt.id));
            };
            it("riichi menzen-tsumo pinfu half-flush pure-straight pure-double-run", () => {
                let hand = defaultHand.createClone();
                hand.wind = Mahjong.Wind.NORTH;
                hand.riichi = true;
                expectHandTypes(hand, Mahjong.Tile.MAN_1, Mahjong.WinningHandType.RIICHI, Mahjong.WinningHandType.PINFU, Mahjong.WinningHandType.HALF_FLUSH, Mahjong.WinningHandType.PURE_STRAIGHT, Mahjong.WinningHandType.PURE_DOUBLE_RUN, Mahjong.WinningHandType.MENZEN_TSUMO);
            });
            it("kokushi musou", () => {
                let hand = new Mahjong.Hand();
                hand.tiles = Mahjong.Tiles.parse("ESWNRG M19S19P11");
                expectHandTypes(hand, Mahjong.Tile.PIN_9, Mahjong.WinningHandType.KOKUSHI_MUSOU);
                expectHandTypes(hand, Mahjong.Tile.PIN_1);
            });
            it("tanyao toi-toi three-concealed-pons mixed-triple-pon three-kans", () => {
                let hand = new Mahjong.Hand();
                hand.tiles = new Mahjong.Tiles([Mahjong.Tile.SOU_3, Mahjong.Tile.SOU_3, Mahjong.Tile.SOU_3, Mahjong.Tile.SOU_5]);
                hand.closedKans = [Mahjong.Meld.parse("M3333"), Mahjong.Meld.parse("P3333")];
                hand.openMelds = [Mahjong.Meld.parse("M8888")];
                expectHandTypes(hand, Mahjong.Tile.SOU_5, Mahjong.WinningHandType.TANYAO, Mahjong.WinningHandType.TOI_TOI, Mahjong.WinningHandType.THREE_CONCEALED_PONS, Mahjong.WinningHandType.MIXED_TRIPLE_PON, Mahjong.WinningHandType.THREE_KANS);
            });
            it("all-green", () => {
                let hand = new Mahjong.Hand();
                hand.tiles = Mahjong.Tiles.parse("S2344666888GGG");
                expectHandTypes(hand, Mahjong.Tile.SOU_4, Mahjong.WinningHandType.ALL_GREEEN);
            });
            it("full-flush pinfu/no-pinfu", () => {
                let hand = new Mahjong.Hand();
                hand.tiles = Mahjong.Tiles.parse("M2345567879");
                hand.tiles = new Mahjong.Tiles([Mahjong.Tile.MAN_2, Mahjong.Tile.MAN_3, Mahjong.Tile.MAN_4, Mahjong.Tile.MAN_6, Mahjong.Tile.MAN_7, Mahjong.Tile.MAN_8,
                    Mahjong.Tile.MAN_5, Mahjong.Tile.MAN_5, Mahjong.Tile.MAN_7, Mahjong.Tile.MAN_9]);
                hand.openMelds = [Mahjong.Meld.parse("M123")];
                expectHandTypes(hand, Mahjong.Tile.MAN_8, Mahjong.WinningHandType.FULL_FLUSH);
                hand.tiles = Mahjong.Tiles.parse("M1232345567878");
                hand.openMelds = [];
                expectHandTypes(hand, Mahjong.Tile.MAN_9, Mahjong.WinningHandType.FULL_FLUSH, Mahjong.WinningHandType.PINFU);
            });
            it("twice-pure-double-run terminals-in-all-melds no-pinfu", () => {
                let hand = new Mahjong.Hand();
                hand.tiles = Mahjong.Tiles.parse("M123123S789789P1");
                expectHandTypes(hand, Mahjong.Tile.PIN_1, Mahjong.WinningHandType.TERMINALS_IN_ALL_MELDS, Mahjong.WinningHandType.TWICE_PURE_DOUBLE_RUN);
            });
            it("mixed-triple-run no-pinfu", () => {
                let hand = new Mahjong.Hand();
                hand.tiles = Mahjong.Tiles.parse("M12P123S12367844");
                expectHandTypes(hand, Mahjong.Tile.MAN_3, Mahjong.WinningHandType.MIXED_TRIPLE_RUN);
            });
            it("dragons and winds", () => {
                let hand = new Mahjong.Hand();
                hand.wind = Mahjong.Wind.SOUTH;
                hand.tiles = Mahjong.Tiles.parse("RRR   S234SSSM3");
                expectHandTypes(hand, Mahjong.Tile.MAN_3, Mahjong.WinningHandType.DRAGON_PON, Mahjong.WinningHandType.DRAGON_PON, Mahjong.WinningHandType.WIND_PON, Mahjong.WinningHandType.WIND_PON, Mahjong.WinningHandType.THREE_CONCEALED_PONS);
            });
            it("all terminals", () => {
                let hand = new Mahjong.Hand();
                hand.tiles = Mahjong.Tiles.parse("M999111P1");
                hand.openMelds = [Mahjong.Meld.parse("P999"), Mahjong.Meld.parse("S111")];
                expectHandTypes(hand, Mahjong.Tile.PIN_1, Mahjong.WinningHandType.ALL_TERMINALS);
            });
            it("all honors", () => {
                let hand = new Mahjong.Hand();
                hand.tiles = Mahjong.Tiles.parse("RRREEESSSN");
                hand.openMelds = [Mahjong.Meld.parse("GGG")];
                expectHandTypes(hand, Mahjong.Tile.NORTH, Mahjong.WinningHandType.ALL_HONORS);
            });
            it("all terminals and honors", () => {
                let hand = new Mahjong.Hand();
                hand.tiles = Mahjong.Tiles.parse("S111SSSN");
                hand.openMelds = [Mahjong.Meld.parse("GGG"), Mahjong.Meld.parse("P999")];
                expectHandTypes(hand, Mahjong.Tile.NORTH, Mahjong.WinningHandType.ALL_TERMINALS_AND_HONORS, Mahjong.WinningHandType.TOI_TOI, Mahjong.WinningHandType.DRAGON_PON, Mahjong.WinningHandType.WIND_PON);
            });
            it("chanta", () => {
                let hand = new Mahjong.Hand();
                hand.wind = Mahjong.Wind.WEST;
                hand.tiles = Mahjong.Tiles.parse("S111789M123EEEP9");
                expectHandTypes(hand, Mahjong.Tile.PIN_9, Mahjong.WinningHandType.CHANTA);
            });
            it("nine gates", () => {
                let hand = new Mahjong.Hand();
                hand.tiles = Mahjong.Tiles.parse("P1112345678999");
                expectHandTypes(hand, Mahjong.Tile.PIN_1, Mahjong.WinningHandType.NINE_GATES);
            });
            it("four concealed pons", () => {
                let hand = new Mahjong.Hand();
                hand.tiles = Mahjong.Tiles.parse("P111S222EEEGGGM1");
                expectHandTypes(hand, Mahjong.Tile.MAN_1, Mahjong.WinningHandType.FOUR_CONCEALED_PONS);
            });
            it("four kans", () => {
                let hand = new Mahjong.Hand();
                hand.tiles = Mahjong.Tiles.parse("P1");
                hand.openMelds = [Mahjong.Meld.parse("GGGG"), Mahjong.Meld.parse("M4444"), Mahjong.Meld.parse("P2222")];
                hand.closedKans = [Mahjong.Meld.parse("S3333")];
                expectHandTypes(hand, Mahjong.Tile.PIN_1, Mahjong.WinningHandType.FOUR_KANS);
            });
            it("little three dragons", () => {
                let hand = new Mahjong.Hand();
                hand.tiles = Mahjong.Tiles.parse("P123789 ");
                hand.openMelds = [Mahjong.Meld.parse("GGG"), Mahjong.Meld.parse("RRR")];
                expectHandTypes(hand, Mahjong.Tile.WHITE, Mahjong.WinningHandType.LITTLE_THREE_DRAGONS, Mahjong.WinningHandType.DRAGON_PON, Mahjong.WinningHandType.DRAGON_PON, Mahjong.WinningHandType.CHANTA, Mahjong.WinningHandType.HALF_FLUSH);
            });
            it("big three dragons", () => {
                let hand = new Mahjong.Hand();
                hand.tiles = Mahjong.Tiles.parse("RRRGGG   P1234");
                expectHandTypes(hand, Mahjong.Tile.PIN_1, Mahjong.WinningHandType.BIG_THREE_DRAGONS);
            });
            it("little four winds", () => {
                let hand = new Mahjong.Hand();
                hand.tiles = Mahjong.Tiles.parse("EEEWWWSSSNP123");
                expectHandTypes(hand, Mahjong.Tile.NORTH, Mahjong.WinningHandType.LITTLE_FOUR_WINDS);
            });
            it("big four winds", () => {
                let hand = new Mahjong.Hand();
                hand.tiles = Mahjong.Tiles.parse("EEEWWWSSSNNP11");
                expectHandTypes(hand, Mahjong.Tile.NORTH, Mahjong.WinningHandType.BIG_FOUR_WINDS);
            });
            it("big seven pairs", () => {
                let hand = new Mahjong.Hand();
                hand.tiles = Mahjong.Tiles.parse("EEWWNNSSRRGG ");
                expectHandTypes(hand, Mahjong.Tile.WHITE, Mahjong.WinningHandType.BIG_SEVEN_PAIRS);
            });
            it("seven-pairs half-flush", () => {
                let hand = new Mahjong.Hand();
                hand.tiles = Mahjong.Tiles.parse("EEWWP115588992");
                expectHandTypes(hand, Mahjong.Tile.PIN_2, Mahjong.WinningHandType.SEVEN_PAIRS, Mahjong.WinningHandType.HALF_FLUSH);
            });
        });
    })(Test = Mahjong.Test || (Mahjong.Test = {}));
})(Mahjong || (Mahjong = {}));
