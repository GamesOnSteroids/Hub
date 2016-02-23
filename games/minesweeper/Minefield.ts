namespace Minesweeper {
    "use strict";
    import IPlayerInfo = Play.IPlayerInfo;

    export class Field {
        public isRevealed: boolean;
        public hasFlag: boolean;
        public hasMine: boolean;
        public owner: IPlayerInfo;
        public adjacentMines: number;
    }

    export class Minefield {
        public width: number;
        public height: number;
        public fields: Field[];

        constructor(width: number, height: number) {
            this.width = width;
            this.height = height;

            this.fields = [];
        }

        public forAdjacent(fieldId: number, callback: (fieldId: number) => void): void {
            let x = fieldId % this.width;
            let y = Math.floor(fieldId / this.width);

            for (let _y = Math.max(0, y - 1); _y <= Math.min(y + 1, this.height - 1); _y++) {
                for (let _x = Math.max(0, x - 1); _x <= Math.min(x + 1, this.width - 1); _x++) {
                    let _fieldId = _x + _y * this.width;
                    callback(_fieldId);
                }
            }
        }

        public get(fieldId: number): Field {
            return this.fields[fieldId];
        }
    }
}