var Mahjong;
(function (Mahjong) {
    var Test;
    (function (Test) {
        "use strict";
        describe("chi tests", () => {
            let table = new Mahjong.Table();
            let myHand = new Mahjong.Hand();
            beforeEach(() => {
            });
            afterEach(() => {
            });
            it("turn of the previous player", () => {
                table.currentTurn = Mahjong.Wind.NORTH;
                myHand.wind = Mahjong.Wind.EAST;
                myHand.tiles = new Mahjong.Tiles([
                    Mahjong.Tile.MAN_1,
                    Mahjong.Tile.MAN_2,
                    Mahjong.Tile.MAN_3,
                    Mahjong.Tile.MAN_3,
                    Mahjong.Tile.MAN_3,
                    Mahjong.Tile.SOU_1,
                    Mahjong.Tile.SOU_2,
                    Mahjong.Tile.SOU_3,
                    Mahjong.Tile.EAST,
                    Mahjong.Tile.EAST,
                    Mahjong.Tile.PIN_1,
                    Mahjong.Tile.PIN_2,
                    Mahjong.Tile.PIN_3]);
                let moves = table.getAvailableMoves(Mahjong.TileId.MAN_3, myHand);
                expect(moves.length).toBe(5, "Five available moves expected");
                expect(moves[0].type).toBe(Mahjong.MoveType.CHI, "Move should be chi, was " + Mahjong.MoveType[moves[0].type]);
                expect(moves[0].tiles[0]).toBe(Mahjong.TileId.MAN_1);
                expect(moves[0].tiles[1]).toBe(Mahjong.TileId.MAN_2);
                expect(moves[0].tiles[2]).toBe(Mahjong.TileId.MAN_3);
                expect(moves[1].type).toBe(Mahjong.MoveType.PON, "Move should be pon, was " + Mahjong.MoveType[moves[1].type]);
                expect(moves[1].tiles[0]).toBe(Mahjong.TileId.MAN_3);
                expect(moves[1].tiles[1]).toBe(Mahjong.TileId.MAN_3);
                expect(moves[1].tiles[2]).toBe(Mahjong.TileId.MAN_3);
                expect(moves[2].type).toBe(Mahjong.MoveType.OPEN_KAN, "Move should be open kan, was " + Mahjong.MoveType[moves[2].type]);
                expect(moves[2].tiles[0]).toBe(Mahjong.TileId.MAN_3);
                expect(moves[2].tiles[1]).toBe(Mahjong.TileId.MAN_3);
                expect(moves[2].tiles[2]).toBe(Mahjong.TileId.MAN_3);
                expect(moves[2].tiles[3]).toBe(Mahjong.TileId.MAN_3);
                expect(moves[3].type).toBe(Mahjong.MoveType.RON, "Move should be ron, was " + Mahjong.MoveType[moves[3].type]);
                expect(moves[3].tiles[0]).toBe(Mahjong.TileId.MAN_3);
                expect(moves[3].tiles.length).toBe(1, "Move should contain only one tile");
                expect(moves[4].type).toBe(Mahjong.MoveType.PASS, "Move should be pass, was " + Mahjong.MoveType[moves[4].type]);
                expect(moves[4].tiles).toBeNull("No tiles expected");
            });
        });
    })(Test = Mahjong.Test || (Mahjong.Test = {}));
})(Mahjong || (Mahjong = {}));
