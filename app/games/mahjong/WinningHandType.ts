namespace Mahjong {
    "use strict";

    export enum WinningHandTypeId {
        RIICHI,
        MENZEN_TSUMO,
        TANYAO,
        PINFU,
        PURE_DOUBLE_RUN,
        MIXED_TRIPLE_RUN,
        PURE_STRAIGHT,
        DRAGON_PON,
        WIND_PON,
        CHANTA,
        SEVEN_PAIRS,
        MIXED_TRIPLE_PON,
        THREE_CONCEALED_PONS,
        THREE_KANS,
        TOI_TOI,
        HALF_FLUSH,
        LITTLE_THREE_DRAGONS,
        ALL_TERMINALS_AND_HONORS,
        TERMINALS_IN_ALL_MELDS,
        TWICE_PURE_DOUBLE_RUN,
        FULL_FLUSH,
        NAGASHI_MANGAN,
        KOKUSHI_MUSOU,
        NINE_GATES,
        FOUR_CONCEALED_PONS,
        FOUR_KANS,
        ALL_GREEEN,
        ALL_TERMINALS,
        ALL_HONORS,
        BIG_THREE_DRAGONS,
        BIG_SEVEN_PAIRS,
        LITTLE_FOUR_WINDS,
        BIG_FOUR_WINDS
    }

    export class WinningHandType {

        public static RIICHI = new WinningHandType(WinningHandTypeId.RIICHI, 1);
        public static MENZEN_TSUMO = new WinningHandType(WinningHandTypeId.MENZEN_TSUMO, 1);
        public static TANYAO = new WinningHandType(WinningHandTypeId.TANYAO, 1);
        public static PINFU = new WinningHandType(WinningHandTypeId.PINFU, 1);
        public static PURE_DOUBLE_RUN = new WinningHandType(WinningHandTypeId.PURE_DOUBLE_RUN, 1);
        public static MIXED_TRIPLE_RUN = new WinningHandType(WinningHandTypeId.MIXED_TRIPLE_RUN, 1, true);
        public static PURE_STRAIGHT = new WinningHandType(WinningHandTypeId.PURE_STRAIGHT, 1, true);
        public static DRAGON_PON = new WinningHandType(WinningHandTypeId.DRAGON_PON, 1);
        public static WIND_PON = new WinningHandType(WinningHandTypeId.WIND_PON, 1);
        public static CHANTA = new WinningHandType(WinningHandTypeId.CHANTA, 1, true);
        public static SEVEN_PAIRS = new WinningHandType(WinningHandTypeId.SEVEN_PAIRS, 2);
        public static MIXED_TRIPLE_PON = new WinningHandType(WinningHandTypeId.MIXED_TRIPLE_PON, 2);
        public static THREE_CONCEALED_PONS = new WinningHandType(WinningHandTypeId.THREE_CONCEALED_PONS, 2);
        public static THREE_KANS = new WinningHandType(WinningHandTypeId.THREE_KANS, 2);
        public static TOI_TOI = new WinningHandType(WinningHandTypeId.TOI_TOI, 2);
        public static HALF_FLUSH = new WinningHandType(WinningHandTypeId.HALF_FLUSH, 2, true);
        public static LITTLE_THREE_DRAGONS = new WinningHandType(WinningHandTypeId.LITTLE_THREE_DRAGONS, 2);
        public static ALL_TERMINALS_AND_HONORS = new WinningHandType(WinningHandTypeId.ALL_TERMINALS_AND_HONORS, 2);
        public static TERMINALS_IN_ALL_MELDS = new WinningHandType(WinningHandTypeId.TERMINALS_IN_ALL_MELDS, 2, true);
        public static TWICE_PURE_DOUBLE_RUN = new WinningHandType(WinningHandTypeId.TWICE_PURE_DOUBLE_RUN, 3);
        public static FULL_FLUSH = new WinningHandType(WinningHandTypeId.FULL_FLUSH, 5, true);
        public static NAGASHI_MANGAN = new WinningHandType(WinningHandTypeId.NAGASHI_MANGAN, 5);
        public static KOKUSHI_MUSOU = new WinningHandType(WinningHandTypeId.KOKUSHI_MUSOU, 13);
        public static NINE_GATES = new WinningHandType(WinningHandTypeId.NINE_GATES, 13);
        public static FOUR_CONCEALED_PONS = new WinningHandType(WinningHandTypeId.FOUR_CONCEALED_PONS, 13);
        public static FOUR_KANS = new WinningHandType(WinningHandTypeId.FOUR_KANS, 13);
        public static ALL_GREEEN = new WinningHandType(WinningHandTypeId.ALL_GREEEN, 13);
        public static ALL_TERMINALS = new WinningHandType(WinningHandTypeId.ALL_TERMINALS, 13);
        public static ALL_HONORS = new WinningHandType(WinningHandTypeId.ALL_HONORS, 13);
        public static BIG_THREE_DRAGONS = new WinningHandType(WinningHandTypeId.BIG_THREE_DRAGONS, 13);
        public static BIG_SEVEN_PAIRS = new WinningHandType(WinningHandTypeId.BIG_SEVEN_PAIRS, 13);
        public static LITTLE_FOUR_WINDS = new WinningHandType(WinningHandTypeId.LITTLE_FOUR_WINDS, 13);
        public static BIG_FOUR_WINDS = new WinningHandType(WinningHandTypeId.BIG_FOUR_WINDS, 26);

        constructor(public id: WinningHandTypeId, public value: number, public closedBonus?: boolean) {}

    }

}