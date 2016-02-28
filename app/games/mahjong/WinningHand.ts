namespace Mahjong {
    "use strict";

    export class WinningHand {

        public types: WinningHandType[] = [];

        constructor(hand: Hand) {}

        public addType(type: WinningHandType): void {
            this.types.push(type);
        }

    }

}