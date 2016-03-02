namespace Mahjong.Test {
    "use strict";

    describe("winning hand tests", () => {

        let table = new Table();
        let logic = new WinningHandLogic(table);
        let defaultHand = new Hand();

        table.prevailingWind = Wind.SOUTH;
        table.currentTurn = Wind.NORTH;
        defaultHand.wind = Wind.SOUTH;

        defaultHand.tiles = Tiles.parse("M12233456789EE");

        beforeEach(() => {

        });

        afterEach(() => {

        });

        let typeIdsToString = (typeIds: WinningHandTypeId[]) => {
            return "[" + typeIds.map(t => WinningHandTypeId[t]).join(", ") + "]";
        };

        let typesToString = (types: WinningHandType[]) => {
            return typeIdsToString(types.map(t => t.id));
        };

        let expectHandTypesContain = (typeIds: WinningHandTypeId[], typeId: WinningHandTypeId) => {
            expect(typeIds).toContain(typeId, "Expected " + typeIdsToString(typeIds) + " to contain " + WinningHandTypeId[typeId]);
            typeIds.splice(typeIds.findIndex(t => t == typeId), 1);
        };

        let expectHandTypes = (hand: Hand, winningTile: Tile, ...winningTypes: WinningHandType[]) => {
            let winningHands = logic.getWinningHands(winningTile, hand);
            expect(winningHands.length).toBe(1, "Expected one winning hand");
            let typeIds = winningHands[0].types.map(t => t.id);
            expect(typeIds.length).toBe(winningTypes.length, "Expected " + winningTypes.length + " winnig hand types (" + typesToString(winningTypes) +
                ", got " + typeIds.length + " (" + typeIdsToString(typeIds) + ")");
            winningTypes.forEach(wt => expectHandTypesContain(typeIds, wt.id));
        };

        it("riichi menzen-tsumo pinfu half-flush pure-straight pure-double-run", () => {
            let hand = defaultHand.createClone();
            hand.wind = Wind.NORTH;
            hand.riichi = true;
            expectHandTypes(hand, Tile.MAN_1, WinningHandType.RIICHI, WinningHandType.PINFU, WinningHandType.HALF_FLUSH,
                            WinningHandType.PURE_STRAIGHT, WinningHandType.PURE_DOUBLE_RUN, WinningHandType.MENZEN_TSUMO);
        });

        it("kokushi musou", () => {
            let hand = new Hand();
            hand.tiles = Tiles.parse("ESWNRG M19S19P11");
            expectHandTypes(hand, Tile.PIN_9, WinningHandType.KOKUSHI_MUSOU);
            expectHandTypes(hand, Tile.PIN_1);
        });

        it("tanyao toi-toi three-concealed-pons mixed-triple-pon three-kans", () => {
            let hand = new Hand();
            hand.tiles = new Tiles([Tile.SOU_3, Tile.SOU_3, Tile.SOU_3, Tile.SOU_5]);
            hand.closedKans = [ Meld.parse("M3333"), Meld.parse("P3333") ];
            hand.openMelds = [ Meld.parse("M8888") ];
            expectHandTypes(hand, Tile.SOU_5, WinningHandType.TANYAO, WinningHandType.TOI_TOI, WinningHandType.THREE_CONCEALED_PONS,
                            WinningHandType.MIXED_TRIPLE_PON, WinningHandType.THREE_KANS);
        });

        it("all-green", () => {
            let hand = new Hand();
            hand.tiles = Tiles.parse("S2344666888GGG");
            expectHandTypes(hand, Tile.SOU_4, WinningHandType.ALL_GREEEN);
        });

        it("full-flush pinfu/no-pinfu", () => {
            let hand = new Hand();
            hand.tiles = Tiles.parse("M2345567879");
            hand.tiles = new Tiles([Tile.MAN_2, Tile.MAN_3, Tile.MAN_4, Tile.MAN_6, Tile.MAN_7, Tile.MAN_8,
                Tile.MAN_5, Tile.MAN_5, Tile.MAN_7, Tile.MAN_9]);
            hand.openMelds = [Meld.parse("M123")];
            expectHandTypes(hand, Tile.MAN_8, WinningHandType.FULL_FLUSH);
            hand.tiles = Tiles.parse("M1232345567878");
            hand.openMelds = [];
            expectHandTypes(hand, Tile.MAN_9, WinningHandType.FULL_FLUSH, WinningHandType.PINFU);
        });

        it("twice-pure-double-run terminals-in-all-melds no-pinfu", () => {
            let hand = new Hand();
            hand.tiles = Tiles.parse("M123123S789789P1");
            expectHandTypes(hand, Tile.PIN_1, WinningHandType.TERMINALS_IN_ALL_MELDS, WinningHandType.TWICE_PURE_DOUBLE_RUN);
        });

        it("mixed-triple-run no-pinfu", () => {
            let hand = new Hand();
            hand.tiles = Tiles.parse("M12P123S12367844");
            expectHandTypes(hand, Tile.MAN_3, WinningHandType.MIXED_TRIPLE_RUN);
        });

        it("dragons and winds", () => {
            let hand = new Hand();
            hand.wind = Wind.SOUTH;
            hand.tiles = Tiles.parse("RRR   S234SSSM3");
            expectHandTypes(hand, Tile.MAN_3, WinningHandType.DRAGON_PON, WinningHandType.DRAGON_PON, WinningHandType.WIND_PON, WinningHandType.WIND_PON,
                            WinningHandType.THREE_CONCEALED_PONS);
        });

        it("all terminals", () => {
            let hand = new Hand();
            hand.tiles = Tiles.parse("M999111P1");
            hand.openMelds = [Meld.parse("P999"), Meld.parse("S111")];
            expectHandTypes(hand, Tile.PIN_1, WinningHandType.ALL_TERMINALS);
        });

        it("all honors", () => {
            let hand = new Hand();
            hand.tiles = Tiles.parse("RRREEESSSN");
            hand.openMelds = [ Meld.parse("GGG") ];
            expectHandTypes(hand, Tile.NORTH, WinningHandType.ALL_HONORS);
        });

        it("all terminals and honors", () => {
            let hand = new Hand();
            hand.tiles = Tiles.parse("S111SSSN");
            hand.openMelds = [Meld.parse("GGG"), Meld.parse("P999")];
            expectHandTypes(hand, Tile.NORTH, WinningHandType.ALL_TERMINALS_AND_HONORS, WinningHandType.TOI_TOI, WinningHandType.DRAGON_PON, WinningHandType.WIND_PON);
        });

        it("chanta", () => {
            let hand = new Hand();
            hand.wind = Wind.WEST;
            hand.tiles = Tiles.parse("S111789M123EEEP9");
            expectHandTypes(hand, Tile.PIN_9, WinningHandType.CHANTA);
        });

        it("nine gates", () => {
            let hand = new Hand();
            hand.tiles = Tiles.parse("P1112345678999");
            expectHandTypes(hand, Tile.PIN_1, WinningHandType.NINE_GATES);
        });

        it("four concealed pons", () => {
            let hand = new Hand();
            hand.tiles = Tiles.parse("P111S222EEEGGGM1");
            expectHandTypes(hand, Tile.MAN_1, WinningHandType.FOUR_CONCEALED_PONS);
        });

        it("four kans", () => {
            let hand = new Hand();
            hand.tiles = Tiles.parse("P1");
            hand.openMelds = [Meld.parse("GGGG"), Meld.parse("M4444"), Meld.parse("P2222")];
            hand.closedKans = [Meld.parse("S3333")];
            expectHandTypes(hand, Tile.PIN_1, WinningHandType.FOUR_KANS);
        });

        it("little three dragons", () => {
            let hand = new Hand();
            hand.tiles = Tiles.parse("P123789 ");
            hand.openMelds = [Meld.parse("GGG"), Meld.parse("RRR")];
            expectHandTypes(hand, Tile.WHITE, WinningHandType.LITTLE_THREE_DRAGONS, WinningHandType.DRAGON_PON, WinningHandType.DRAGON_PON,
                            WinningHandType.CHANTA, WinningHandType.HALF_FLUSH);
        });

        it("big three dragons", () => {
            let hand = new Hand();
            hand.tiles = Tiles.parse("RRRGGG   P1234");
            expectHandTypes(hand, Tile.PIN_1, WinningHandType.BIG_THREE_DRAGONS);
        });

        it("little four winds", () => {
            let hand = new Hand();
            hand.tiles = Tiles.parse("EEEWWWSSSNP123");
            expectHandTypes(hand, Tile.NORTH, WinningHandType.LITTLE_FOUR_WINDS);
        });

        it("big four winds", () => {
            let hand = new Hand();
            hand.tiles = Tiles.parse("EEEWWWSSSNNP11");
            expectHandTypes(hand, Tile.NORTH, WinningHandType.BIG_FOUR_WINDS);
        });

        it("big seven pairs", () => {
            let hand = new Hand();
            hand.tiles = Tiles.parse("EEWWNNSSRRGG ");
            expectHandTypes(hand, Tile.WHITE, WinningHandType.BIG_SEVEN_PAIRS);
        });

        it("seven-pairs half-flush", () => {
            let hand = new Hand();
            hand.tiles = Tiles.parse("EEWWP115588992");
            expectHandTypes(hand, Tile.PIN_2, WinningHandType.SEVEN_PAIRS, WinningHandType.HALF_FLUSH);
        });

    });
}
