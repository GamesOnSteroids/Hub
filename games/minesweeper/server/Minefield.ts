module Minesweeper.Server {
    "use strict";
    import IPlayerInfo = Play.IPlayerInfo;

    export class Field {
        public isRevealed:boolean;
        public hasFlag:boolean;
        public hasMine:boolean;
        public owner:IPlayerInfo;
        public adjacentMines:number;
    }

    export class Minefield {
        public width:number;
        public height:number;
        public generated:boolean;
        public fields:Field[];

        forAdjacent(fieldId:number, callback:(fieldId:number) => void) {
            let x = (fieldId % this.width) | 0;
            let y = (fieldId / this.width) | 0;

            for (let _y = Math.max(0, y - 1); _y <= Math.min(y + 1, this.height - 1); _y++) {
                for (let _x = Math.max(0, x - 1); _x <= Math.min(x + 1, this.width - 1); _x++) {
                    let _fieldId = _x + _y * this.width;
                    callback(_fieldId);
                }
            }
        }

        constructor(width:number, height:number) {
            this.width = width;
            this.height = height;
            this.generated = false;

            this.fields = [];

            for (let i = 0; i < width * height; i++) {
                let field:Field = new Field();
                field.hasMine = false;
                field.owner = null;

                this.fields.push(field);
            }
        }

        get(fieldId:number) {
            return this.fields[fieldId];
        }
    }
}