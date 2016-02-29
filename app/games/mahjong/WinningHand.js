var Mahjong;
(function (Mahjong) {
    "use strict";
    class WinningHand {
        constructor(hand) {
            this.types = [];
        }
        addType(type) {
            this.types.push(type);
        }
    }
    Mahjong.WinningHand = WinningHand;
})(Mahjong || (Mahjong = {}));
