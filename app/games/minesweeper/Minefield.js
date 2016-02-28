var Minesweeper;
(function (Minesweeper) {
    "use strict";
    class Field {
    }
    Minesweeper.Field = Field;
    class Minefield {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.fields = [];
        }
        forAdjacent(fieldId, callback) {
            let x = fieldId % this.width;
            let y = Math.floor(fieldId / this.width);
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
    Minesweeper.Minefield = Minefield;
})(Minesweeper || (Minesweeper = {}));
