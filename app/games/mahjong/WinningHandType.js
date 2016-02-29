var Mahjong;
(function (Mahjong) {
    "use strict";
    (function (WinningHandTypeId) {
        WinningHandTypeId[WinningHandTypeId["RIICHI"] = 0] = "RIICHI";
        WinningHandTypeId[WinningHandTypeId["MENZEN_TSUMO"] = 1] = "MENZEN_TSUMO";
        WinningHandTypeId[WinningHandTypeId["TANYAO"] = 2] = "TANYAO";
        WinningHandTypeId[WinningHandTypeId["PINFU"] = 3] = "PINFU";
        WinningHandTypeId[WinningHandTypeId["PURE_DOUBLE_RUN"] = 4] = "PURE_DOUBLE_RUN";
        WinningHandTypeId[WinningHandTypeId["MIXED_TRIPLE_RUN"] = 5] = "MIXED_TRIPLE_RUN";
        WinningHandTypeId[WinningHandTypeId["PURE_STRAIGHT"] = 6] = "PURE_STRAIGHT";
        WinningHandTypeId[WinningHandTypeId["DRAGON_PON"] = 7] = "DRAGON_PON";
        WinningHandTypeId[WinningHandTypeId["WIND_PON"] = 8] = "WIND_PON";
        WinningHandTypeId[WinningHandTypeId["CHANTA"] = 9] = "CHANTA";
        WinningHandTypeId[WinningHandTypeId["SEVEN_PAIRS"] = 10] = "SEVEN_PAIRS";
        WinningHandTypeId[WinningHandTypeId["MIXED_TRIPLE_PON"] = 11] = "MIXED_TRIPLE_PON";
        WinningHandTypeId[WinningHandTypeId["THREE_CONCEALED_PONS"] = 12] = "THREE_CONCEALED_PONS";
        WinningHandTypeId[WinningHandTypeId["THREE_KANS"] = 13] = "THREE_KANS";
        WinningHandTypeId[WinningHandTypeId["TOI_TOI"] = 14] = "TOI_TOI";
        WinningHandTypeId[WinningHandTypeId["HALF_FLUSH"] = 15] = "HALF_FLUSH";
        WinningHandTypeId[WinningHandTypeId["SHOU_SANGEN"] = 16] = "SHOU_SANGEN";
        WinningHandTypeId[WinningHandTypeId["ALL_TERMINALS_AND_HONORS"] = 17] = "ALL_TERMINALS_AND_HONORS";
        WinningHandTypeId[WinningHandTypeId["TERMINALS_IN_ALL_MELDS"] = 18] = "TERMINALS_IN_ALL_MELDS";
        WinningHandTypeId[WinningHandTypeId["TWICE_PURE_DOUBLE_RUN"] = 19] = "TWICE_PURE_DOUBLE_RUN";
        WinningHandTypeId[WinningHandTypeId["FULL_FLUSH"] = 20] = "FULL_FLUSH";
        WinningHandTypeId[WinningHandTypeId["NAGASHI_MANGAN"] = 21] = "NAGASHI_MANGAN";
        WinningHandTypeId[WinningHandTypeId["KOKUSHI_MUSOU"] = 22] = "KOKUSHI_MUSOU";
        WinningHandTypeId[WinningHandTypeId["NINE_GATES"] = 23] = "NINE_GATES";
        WinningHandTypeId[WinningHandTypeId["FOUR_CONCEALED_PONS"] = 24] = "FOUR_CONCEALED_PONS";
        WinningHandTypeId[WinningHandTypeId["ALL_GREEEN"] = 25] = "ALL_GREEEN";
        WinningHandTypeId[WinningHandTypeId["ALL_TERMINALS"] = 26] = "ALL_TERMINALS";
        WinningHandTypeId[WinningHandTypeId["ALL_HONORS"] = 27] = "ALL_HONORS";
        WinningHandTypeId[WinningHandTypeId["DAI_SANGEN"] = 28] = "DAI_SANGEN";
        WinningHandTypeId[WinningHandTypeId["BIG_SEVEN_PAIRS"] = 29] = "BIG_SEVEN_PAIRS";
        WinningHandTypeId[WinningHandTypeId["LITTLE_FOUR_WINDS"] = 30] = "LITTLE_FOUR_WINDS";
        WinningHandTypeId[WinningHandTypeId["BIG_FOUR_WINDS"] = 31] = "BIG_FOUR_WINDS";
    })(Mahjong.WinningHandTypeId || (Mahjong.WinningHandTypeId = {}));
    var WinningHandTypeId = Mahjong.WinningHandTypeId;
    class WinningHandType {
        constructor(id, value, closedBonus) {
            this.id = id;
            this.value = value;
            this.closedBonus = closedBonus;
        }
    }
    WinningHandType.RIICHI = new WinningHandType(WinningHandTypeId.RIICHI, 1);
    WinningHandType.MENZEN_TSUMO = new WinningHandType(WinningHandTypeId.MENZEN_TSUMO, 1);
    WinningHandType.TANYAO = new WinningHandType(WinningHandTypeId.TANYAO, 1);
    WinningHandType.PINFU = new WinningHandType(WinningHandTypeId.PINFU, 1);
    WinningHandType.PURE_DOUBLE_RUN = new WinningHandType(WinningHandTypeId.PURE_DOUBLE_RUN, 1);
    WinningHandType.MIXED_TRIPLE_RUN = new WinningHandType(WinningHandTypeId.MIXED_TRIPLE_RUN, 1, true);
    WinningHandType.PURE_STRAIGHT = new WinningHandType(WinningHandTypeId.PURE_STRAIGHT, 1, true);
    WinningHandType.DRAGON_PON = new WinningHandType(WinningHandTypeId.DRAGON_PON, 1);
    WinningHandType.WIND_PON = new WinningHandType(WinningHandTypeId.WIND_PON, 1);
    WinningHandType.CHANTA = new WinningHandType(WinningHandTypeId.CHANTA, 1, true);
    WinningHandType.SEVEN_PAIRS = new WinningHandType(WinningHandTypeId.SEVEN_PAIRS, 2);
    WinningHandType.MIXED_TRIPLE_PON = new WinningHandType(WinningHandTypeId.MIXED_TRIPLE_PON, 2);
    WinningHandType.THREE_CONCEALED_PONS = new WinningHandType(WinningHandTypeId.THREE_CONCEALED_PONS, 2);
    WinningHandType.THREE_KANS = new WinningHandType(WinningHandTypeId.THREE_KANS, 2);
    WinningHandType.TOI_TOI = new WinningHandType(WinningHandTypeId.TOI_TOI, 2);
    WinningHandType.HALF_FLUSH = new WinningHandType(WinningHandTypeId.HALF_FLUSH, 2, true);
    WinningHandType.SHOU_SANGEN = new WinningHandType(WinningHandTypeId.SHOU_SANGEN, 2);
    WinningHandType.ALL_TERMINALS_AND_HONORS = new WinningHandType(WinningHandTypeId.ALL_TERMINALS_AND_HONORS, 2);
    WinningHandType.TERMINALS_IN_ALL_MELDS = new WinningHandType(WinningHandTypeId.TERMINALS_IN_ALL_MELDS, 2, true);
    WinningHandType.TWICE_PURE_DOUBLE_RUN = new WinningHandType(WinningHandTypeId.TWICE_PURE_DOUBLE_RUN, 3);
    WinningHandType.FULL_FLUSH = new WinningHandType(WinningHandTypeId.FULL_FLUSH, 5, true);
    WinningHandType.NAGASHI_MANGAN = new WinningHandType(WinningHandTypeId.NAGASHI_MANGAN, 5);
    WinningHandType.KOKUSHI_MUSOU = new WinningHandType(WinningHandTypeId.KOKUSHI_MUSOU, 13);
    WinningHandType.NINE_GATES = new WinningHandType(WinningHandTypeId.NINE_GATES, 13);
    WinningHandType.FOUR_CONCEALED_PONS = new WinningHandType(WinningHandTypeId.FOUR_CONCEALED_PONS, 13);
    WinningHandType.ALL_GREEEN = new WinningHandType(WinningHandTypeId.ALL_GREEEN, 13);
    WinningHandType.ALL_TERMINALS = new WinningHandType(WinningHandTypeId.ALL_TERMINALS, 13);
    WinningHandType.ALL_HONORS = new WinningHandType(WinningHandTypeId.ALL_HONORS, 13);
    WinningHandType.DAI_SANGEN = new WinningHandType(WinningHandTypeId.DAI_SANGEN, 13);
    WinningHandType.BIG_SEVEN_PAIRS = new WinningHandType(WinningHandTypeId.BIG_SEVEN_PAIRS, 13);
    WinningHandType.LITTLE_FOUR_WINDS = new WinningHandType(WinningHandTypeId.LITTLE_FOUR_WINDS, 13);
    WinningHandType.BIG_FOUR_WINDS = new WinningHandType(WinningHandTypeId.LITTLE_FOUR_WINDS, 26);
    Mahjong.WinningHandType = WinningHandType;
})(Mahjong || (Mahjong = {}));