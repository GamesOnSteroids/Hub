var Mahjong;
(function (Mahjong) {
    var Test;
    (function (Test) {
        "use strict";
        describe("hand tests", () => {
            let kan = new Mahjong.Meld(new Mahjong.Tiles([Mahjong.Tile.MAN_4, Mahjong.Tile.MAN_4, Mahjong.Tile.MAN_4, Mahjong.Tile.MAN_4]), Mahjong.MeldType.KAN);
            let closedHand = new Mahjong.Hand();
            closedHand.tiles = new Mahjong.Tiles([
                Mahjong.Tile.MAN_1, Mahjong.Tile.MAN_2, Mahjong.Tile.MAN_3,
                Mahjong.Tile.PIN_4, Mahjong.Tile.PIN_4, Mahjong.Tile.PIN_4,
                Mahjong.Tile.SOU_5, Mahjong.Tile.SOU_5, Mahjong.Tile.SOU_5,
                Mahjong.Tile.SOU_7, Mahjong.Tile.SOU_8, Mahjong.Tile.SOU_9,
                Mahjong.Tile.MAN_1, Mahjong.Tile.MAN_1
            ]);
            let openHand = new Mahjong.Hand();
            openHand.tiles = new Mahjong.Tiles([
                Mahjong.Tile.MAN_4, Mahjong.Tile.MAN_5, Mahjong.Tile.MAN_6,
                Mahjong.Tile.MAN_1, Mahjong.Tile.MAN_2, Mahjong.Tile.MAN_3,
                Mahjong.Tile.MAN_2, Mahjong.Tile.MAN_2
            ]);
            openHand.openMelds = [
                new Mahjong.Meld(new Mahjong.Tiles([Mahjong.Tile.MAN_5, Mahjong.Tile.MAN_5, Mahjong.Tile.MAN_5]), Mahjong.MeldType.PON),
                new Mahjong.Meld(new Mahjong.Tiles([Mahjong.Tile.MAN_1, Mahjong.Tile.MAN_2, Mahjong.Tile.MAN_3]), Mahjong.MeldType.CHI)
            ];
            let closedHandWithClosedKan = closedHand.createClone();
            closedHandWithClosedKan.tiles.tiles.splice(3, 3);
            closedHandWithClosedKan.closedKans.push(kan);
            let openHandWithClosedKan = openHand.createClone();
            openHandWithClosedKan.tiles.tiles.splice(0, 3);
            openHandWithClosedKan.closedKans.push(kan);
            let incorrectHand = openHand.createClone();
            incorrectHand.tiles.tiles[7] = Mahjong.Tile.MAN_7;
            it("correctForm with closed hand", () => {
                expect(closedHand.getCorrectForms().length).toBe(1);
                expect(openHand.getCorrectForms().length).toBe(1);
                expect(closedHandWithClosedKan.getCorrectForms().length).toBe(1);
                expect(openHandWithClosedKan.getCorrectForms().length).toBe(1);
                expect(incorrectHand.getCorrectForms().length).toBe(0);
            });
        });
    })(Test = Mahjong.Test || (Mahjong.Test = {}));
})(Mahjong || (Mahjong = {}));
