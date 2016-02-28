namespace Mahjong.Test {
    "use strict";

    describe("chi tests", () => {

        let table = new Table();
        let myHand = new Hand();

        beforeEach(() => {

        });

        afterEach(() => {

        });

        it("turn of the previous player", () => {

            table.currentTurn = Wind.NORTH;
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

                Tile.PIN_1,
                Tile.PIN_2,
                Tile.PIN_3]);

            let moves = table.getAvailableMoves(TileId.MAN_3, myHand);
            expect(moves.length).toBe(5, "Five available moves expected");

            expect(moves[0].type).toBe(Mahjong.MoveType.CHI, "Move should be chi, was " + MoveType[moves[0].type]);
            expect(moves[0].tiles[0]).toBe(TileId.MAN_1);
            expect(moves[0].tiles[1]).toBe(TileId.MAN_2);
            expect(moves[0].tiles[2]).toBe(TileId.MAN_3);
            expect(moves[1].type).toBe(Mahjong.MoveType.PON, "Move should be pon, was " + MoveType[moves[1].type]);
            expect(moves[1].tiles[0]).toBe(TileId.MAN_3);
            expect(moves[1].tiles[1]).toBe(TileId.MAN_3);
            expect(moves[1].tiles[2]).toBe(TileId.MAN_3);
            expect(moves[2].type).toBe(MoveType.OPEN_KAN, "Move should be open kan, was " + MoveType[moves[2].type]);
            expect(moves[2].tiles[0]).toBe(TileId.MAN_3);
            expect(moves[2].tiles[1]).toBe(TileId.MAN_3);
            expect(moves[2].tiles[2]).toBe(TileId.MAN_3);
            expect(moves[2].tiles[3]).toBe(TileId.MAN_3);
            expect(moves[3].type).toBe(MoveType.RON, "Move should be ron, was " + MoveType[moves[3].type]);
            expect(moves[3].tiles[0]).toBe(TileId.MAN_3);
            expect(moves[3].tiles.length).toBe(1, "Move should contain only one tile");
            expect(moves[4].type).toBe(MoveType.PASS, "Move should be pass, was " + MoveType[moves[4].type]);
            expect(moves[4].tiles).toBeNull("No tiles expected");
        });

    });
}
