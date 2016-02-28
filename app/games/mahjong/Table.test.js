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
            it("my turn", () => {
                table.currentTurn = Mahjong.Wind.EAST;
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
                    Mahjong.Tile.EAST,
                    Mahjong.Tile.PIN_1,
                    Mahjong.Tile.PIN_1,
                    Mahjong.Tile.PIN_1]);
                let moves = table.getAvailableMoves(Mahjong.TileId.PIN_3, myHand);
                expect(moves[0].type).toBe(Mahjong.MoveType.CHI, "Move should be chi");
                expect(moves[0].tiles[0]).toBe(Mahjong.TileId.MAN_1);
                expect(moves[0].tiles[1]).toBe(Mahjong.TileId.MAN_2);
                expect(moves[0].tiles[2]).toBe(Mahjong.TileId.MAN_3);
                expect(moves[1].type).toBe(Mahjong.MoveType.PON, "Move should be pon");
                expect(moves[1].tiles[0]).toBe(Mahjong.TileId.MAN_3);
                expect(moves[1].tiles[1]).toBe(Mahjong.TileId.MAN_3);
                expect(moves[1].tiles[2]).toBe(Mahjong.TileId.MAN_3);
            });
        });
    })(Test = Mahjong.Test || (Mahjong.Test = {}));
})(Mahjong || (Mahjong = {}));
