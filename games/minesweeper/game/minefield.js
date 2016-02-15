var Minesweeper;
(function (Minesweeper) {
    var Game;
    (function (Game) {
        "use strict";
        class Field {
        }
        Game.Field = Field;
        class Minefield {
            constructor(width, height) {
                this.width = width;
                this.height = height;
                this.fields = [];
                for (let x = 0; x < this.width; x++) {
                    for (let y = 0; y < this.height; y++) {
                        let field = this.fields[x + y * this.width] = new Field();
                        field.isRevealed = false;
                    }
                }
            }
            forAdjecent(fieldId, callback) {
                let x = (fieldId % this.width) | 0;
                let y = (fieldId / this.width) | 0;
                for (let _y = Math.max(0, y - 1); _y <= Math.min(y + 1, this.height - 1); _y++) {
                    for (let _x = Math.max(0, x - 1); _x <= Math.min(x + 1, this.width - 1); _x++) {
                        let _fieldId = _x + _y * this.width;
                        callback(_fieldId);
                    }
                }
            }
            get(fieldId) {
                return this.fields[fieldId];
            }
        }
        Game.Minefield = Minefield;
    })(Game = Minesweeper.Game || (Minesweeper.Game = {}));
})(Minesweeper || (Minesweeper = {}));
//# sourceMappingURL=minefield.js.map