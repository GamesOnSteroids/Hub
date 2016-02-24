var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
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
//# sourceMappingURL=Minefield.js.map