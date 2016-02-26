namespace Mahjong.Test {
    "use strict";

    describe("chi tests", () => {

        let table = new Table();
        let myHand = new Hand();

        beforeEach(() => {

        });

        afterEach(() => {

        });

        it("my turn", () => {

            table.currentTurn = Wind.EAST;
            myHand.wind = Wind.EAST;

            myHand.tiles = new Tiles([
                Tile.MAN_1,
                Tile.MAN_2,
                //Tile.MAN_3,

                Tile.MAN_3,
                Tile.MAN_3,
                Tile.MAN_3,

                Tile.SOU_1,
                Tile.SOU_2,
                Tile.SOU_3,

                Tile.EAST,
                Tile.EAST,
                Tile.EAST,

                Tile.PIN_1,
                Tile.PIN_1,
                Tile.PIN_1]);

            let moves = table.getAvailableMoves(TileId.PIN_3, myHand);
            //expect(moves.length).toBe(1, "One available move expected");

            expect(moves[0].type).toBe(Mahjong.MoveType.CHI, "Move should be chi");
            expect(moves[0].tiles[0]).toBe(TileId.MAN_1);
            expect(moves[0].tiles[1]).toBe(TileId.MAN_2);
            expect(moves[0].tiles[2]).toBe(TileId.MAN_3);
            expect(moves[1].type).toBe(Mahjong.MoveType.PON, "Move should be pon");
            expect(moves[1].tiles[0]).toBe(TileId.MAN_3);
            expect(moves[1].tiles[1]).toBe(TileId.MAN_3);
            expect(moves[1].tiles[2]).toBe(TileId.MAN_3);
        });

    });
}
