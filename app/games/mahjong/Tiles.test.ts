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

        it("withoutTiles", () => {
            let tilesToRemove = [Tile.MAN_1, Tile.MAN_2, Tile.MAN_3];
            let reducedTiles = tiles.withoutTiles(tilesToRemove);
            expect(reducedTiles.size()).toBe(tiles.size() - tilesToRemove.length);
        });

        it("grouping", () => {
            let possibleGroupings = tiles.getPossibleGroupings();
            console.log(possibleGroupings);
        });

    });
}
