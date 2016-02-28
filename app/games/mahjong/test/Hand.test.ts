namespace Mahjong.Test {
    "use strict";

    describe("hand tests", () => {

        let kan = new Meld(new Tiles([Tile.MAN_4, Tile.MAN_4, Tile.MAN_4, Tile.MAN_4]), MeldType.KAN);

        let closedHand = new Hand();
        closedHand.tiles = new Tiles([
            Tile.MAN_1, Tile.MAN_2, Tile.MAN_3,
            Tile.PIN_4, Tile.PIN_4, Tile.PIN_4,
            Tile.SOU_5, Tile.SOU_5, Tile.SOU_5,
            Tile.SOU_7, Tile.SOU_8, Tile.SOU_9,
            Tile.MAN_1, Tile.MAN_1
        ]);

        let openHand = new Hand();
        openHand.tiles = new Tiles([
            Tile.MAN_4, Tile.MAN_5, Tile.MAN_6,
            Tile.MAN_1, Tile.MAN_2, Tile.MAN_3,
            Tile.MAN_2, Tile.MAN_2
        ]);
        openHand.openMelds = [
            new Meld(new Tiles([Tile.MAN_5, Tile.MAN_5, Tile.MAN_5]), MeldType.PON),
            new Meld(new Tiles([Tile.MAN_1, Tile.MAN_2, Tile.MAN_3]), MeldType.CHI)
        ];

        let closedHandWithClosedKan = closedHand.createClone();
        closedHandWithClosedKan.tiles.tiles.splice(3, 3);
        closedHandWithClosedKan.closedKans.push(kan);

        let openHandWithClosedKan = openHand.createClone();
        openHandWithClosedKan.tiles.tiles.splice(0, 3);
        openHandWithClosedKan.closedKans.push(kan);

        let incorrectHand = openHand.createClone();
        incorrectHand.tiles.tiles[7] = Tile.MAN_7;

        it("correctForm with closed hand", () => {
            expect(closedHand.getCorrectForms().length).toBe(1);
            expect(openHand.getCorrectForms().length).toBe(1);
            expect(closedHandWithClosedKan.getCorrectForms().length).toBe(1);
            expect(openHandWithClosedKan.getCorrectForms().length).toBe(1);
            expect(incorrectHand.getCorrectForms().length).toBe(0);
        });

    });
}
