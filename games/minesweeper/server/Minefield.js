var Minesweeper;
(function (Minesweeper) {
    var Server;
    (function (Server) {
        "use strict";
        class Field {
        }
        Server.Field = Field;
        class Minefield {
            constructor(width, height) {
                this.width = width;
                this.height = height;
                this.generated = false;
                this.fields = [];
                for (let i = 0; i < width * height; i++) {
                    let field = new Field();
                    field.hasMine = false;
                    field.owner = null;
                    this.fields.push(field);
                }
            }
            forAdjacent(fieldId, callback) {
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
        Server.Minefield = Minefield;
    })(Server = Minesweeper.Server || (Minesweeper.Server = {}));
})(Minesweeper || (Minesweeper = {}));
//# sourceMappingURL=Minefield.js.map