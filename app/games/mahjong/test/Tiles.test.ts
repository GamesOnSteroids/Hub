namespace Mahjong.Test {
    "use strict";

    describe("tiles tests", () => {

        let tiles = new Tiles([
            Tile.MAN_1, Tile.MAN_2, Tile.MAN_3,
            Tile.PIN_4, Tile.PIN_4, Tile.PIN_4,
            Tile.SOU_5, Tile.SOU_5, Tile.SOU_5,
            Tile.SOU_7, Tile.SOU_8, Tile.SOU_9,
            Tile.MAN_1, Tile.MAN_1
        ]);

        let difficultTiles = new Tiles([
            Tile.MAN_1, Tile.MAN_2, Tile.MAN_3,
            Tile.MAN_4, Tile.MAN_5, Tile.MAN_6,
            Tile.MAN_5, Tile.MAN_5, Tile.MAN_5,
            Tile.MAN_1, Tile.MAN_2, Tile.MAN_3,
            Tile.MAN_2, Tile.MAN_2
        ]);

        let ambiguousWinningTiles = new Tiles([
            Tile.MAN_1, Tile.MAN_1, Tile.MAN_1, Tile.MAN_1,
            Tile.MAN_2, Tile.MAN_2, Tile.MAN_2, Tile.MAN_2,
            Tile.MAN_3, Tile.MAN_3, Tile.MAN_3, Tile.MAN_3,
            Tile.RED, Tile.RED
        ]);

        it("withoutTiles", () => {
            let tilesToRemove = [Tile.MAN_1, Tile.MAN_2, Tile.MAN_3];
            let reducedTiles = tiles.withoutTiles(tilesToRemove);
            expect(reducedTiles.size()).toBe(tiles.size() - tilesToRemove.length);
        });

        it("grouping", () => {
            expect(tiles.getPossibleGroupings().length).toBe(2);
            let possibleGroupings = difficultTiles.getPossibleGroupings();
            expect(possibleGroupings.length).toBe(5);
            for (let i = 0; i < possibleGroupings.length; i++) {
                let g = possibleGroupings[i];
                let sameGroupings = possibleGroupings.filter((pg, j) => i != j && pg.equals(g));
                expect(sameGroupings.length).toBe(0);
            }
            expect(ambiguousWinningTiles.getPossibleGroupings().length).toBe(2);
        });

        it("getUniqueMelds", () => {
            expect(tiles.getUniqueMelds().length).toBe(5);
            expect(difficultTiles.getUniqueMelds().length).toBe(6);
        });

        it("getAmbiguousMelds", () => {
            expect(tiles.getAmbiguousMelds(tiles.getUniqueMelds()).length).toBe(2);
            expect(difficultTiles.getAmbiguousMelds(difficultTiles.getUniqueMelds()).length).toBe(6);
        });

    });
}
