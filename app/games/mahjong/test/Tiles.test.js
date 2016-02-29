var Mahjong;
(function (Mahjong) {
    var Test;
    (function (Test) {
        "use strict";
        describe("tiles tests", () => {
            let tiles = new Mahjong.Tiles([
                Mahjong.Tile.MAN_1, Mahjong.Tile.MAN_2, Mahjong.Tile.MAN_3,
                Mahjong.Tile.PIN_4, Mahjong.Tile.PIN_4, Mahjong.Tile.PIN_4,
                Mahjong.Tile.SOU_5, Mahjong.Tile.SOU_5, Mahjong.Tile.SOU_5,
                Mahjong.Tile.SOU_7, Mahjong.Tile.SOU_8, Mahjong.Tile.SOU_9,
                Mahjong.Tile.MAN_1, Mahjong.Tile.MAN_1
            ]);
            let difficultTiles = new Mahjong.Tiles([
                Mahjong.Tile.MAN_1, Mahjong.Tile.MAN_2, Mahjong.Tile.MAN_3,
                Mahjong.Tile.MAN_4, Mahjong.Tile.MAN_5, Mahjong.Tile.MAN_6,
                Mahjong.Tile.MAN_5, Mahjong.Tile.MAN_5, Mahjong.Tile.MAN_5,
                Mahjong.Tile.MAN_1, Mahjong.Tile.MAN_2, Mahjong.Tile.MAN_3,
                Mahjong.Tile.MAN_2, Mahjong.Tile.MAN_2
            ]);
            let ambiguousWinningTiles = new Mahjong.Tiles([
                Mahjong.Tile.MAN_1, Mahjong.Tile.MAN_1, Mahjong.Tile.MAN_1, Mahjong.Tile.MAN_1,
                Mahjong.Tile.MAN_2, Mahjong.Tile.MAN_2, Mahjong.Tile.MAN_2, Mahjong.Tile.MAN_2,
                Mahjong.Tile.MAN_3, Mahjong.Tile.MAN_3, Mahjong.Tile.MAN_3, Mahjong.Tile.MAN_3,
                Mahjong.Tile.RED, Mahjong.Tile.RED
            ]);
            it("withoutTiles", () => {
                let tilesToRemove = [Mahjong.Tile.MAN_1, Mahjong.Tile.MAN_2, Mahjong.Tile.MAN_3];
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
    })(Test = Mahjong.Test || (Mahjong.Test = {}));
})(Mahjong || (Mahjong = {}));
