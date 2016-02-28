var Mahjong;
(function (Mahjong) {
    "use strict";
    class Hand {
        constructor() {
            this.openMelds = [];
            this.closedKans = [];
            this.pond = [];
        }
        hasCorrectForm() {
            let remainingMelds = 4 - this.openMelds.length - this.closedKans.length;
            throw "Not implemented";
        }
    }
    Mahjong.Hand = Hand;
})(Mahjong || (Mahjong = {}));
