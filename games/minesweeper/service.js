"use strict";
Minesweeper.Service = {}

Minesweeper.Service.Field = class Field {

}

Minesweeper.Service.Minefield = class Minefield {

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

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.generated = false;

    this.fields = [];

    for (let i = 0; i < width * height; i++) {
      let field = new Minesweeper.Service.Field();
      field.hasMine = false;
      field.owner = null;

      this.fields.push(field);
    }
  }

  get(fieldId) {
    return this.fields[fieldId];
  }
}

Minesweeper.Service.MinesweeperService = class MinesweeperService extends GameService {

  constructor() {
    super();
  }

  initialize() {
    this.on(CMSG_REVEAL_REQUEST, this.onRevealRequest.bind(this));
    this.on(CMSG_FLAG_REQUEST, this.onFlagRequest.bind(this));
    this.on(CMSG_MASS_REVEAL_REQUEST, this.onMassRevealRequest.bind(this));
    this.minefield = new Minesweeper.Service.Minefield(10, 10);
      this.mines = 20; //TODO: move to game settings

  }

  onJoin(client) {

  }

  flag(client, fieldId, flag) {
    let field = this.minefield.get(fieldId);
    if (field.isRevealed) {
      return;
    }

    field.hasFlag = flag;
    if (flag) {
      field.owner = client;

      this.broadcast({ id: SMSG_FLAG, playerId: field.owner.id, fieldId: fieldId, flag: true });
    } else {
      field.owner = null;

      this.broadcast({ id: SMSG_FLAG,fieldId: fieldId, flag: false });
    }



  }

  massReveal(client, fieldId) {

    let field = this.minefield.get(fieldId);
    if (!field.isRevealed || field.adjecentMines == 0 || field.hasMine) {
      return;
    }



    let flags = 0;
    this.minefield.forAdjecent(fieldId, (fieldId) => {
        let field = this.minefield.get(fieldId);
        if (field.hasFlag || (field.isRevealed && field.hasMine)) {
          flags++;
        }
    });

    if (flags == field.adjecentMines) {
      this.minefield.forAdjecent(fieldId, (fieldId) => {
        let field = this.minefield.get(fieldId);
        if (!field.isRevealed && !field.hasFlag) { // reveal all non flagged
          this.reveal(client, fieldId);
        }
      });
    }

  }

  reveal(client, fieldId) {

    let field = this.minefield.get(fieldId);
    if (field.isRevealed) {
      return;
    }
    if (field.hasFlag && field.owner.id == client.id) { // Can not reveal your own flags
      return;
    }

    field.isRevealed = true;
    field.owner = client;
    field.hasFlag = false;

    this.broadcast({ id: SMSG_REVEAL, playerId: client.id, fieldId: fieldId, adjecentMines: field.adjecentMines, hasMine: field.hasMine });

    if (field.hasFlag) {
      if (field.owner.id != client.id && field.hasMine) {
        //TODO: boom
      } else {
        //TODO: not possible to click on your flag
      }
    } else {
      if (field.hasMine) {

      } else {
        if (field.adjecentMines == 0) {
          this.minefield.forAdjecent(fieldId, (fieldId) => {
              let field = this.minefield.get(fieldId);
              if (!field.hasMine && !field.isRevealed && !field.hasFlag) {
                this.reveal(client, fieldId);
              }
          });
        }
      }
    }
  }

  onFlagRequest(client, msg) {
    this.flag(client, msg.fieldId, msg.flag);
  }

  onMassRevealRequest(client, msg) {

    this.massReveal(client, msg.fieldId);
  }

  onRevealRequest(client, msg) {
    //todo: sanitize input

    if (!this.minefield.generated) {
      this.generate(msg.fieldId)
    }

    this.reveal(client, msg.fieldId);

  }

  generate(safeFieldId) {

    let result = this.minefield;

    let safePosition = {x: (safeFieldId % result.width) | 0, y: (safeFieldId / result.width) | 0 }

    let minesRemaining = this.mines;
    while (minesRemaining > 0) {
      let fieldId = (Math.random() * result.width * result.height) | 0;
      let x = (fieldId % result.width) | 0;
      let y = (fieldId / result.width) | 0;

      if (x >= safePosition.x - 1 && x <= safePosition.x + 1 && y >= safePosition.y - 1 && y <= safePosition.y + 1) {
        continue;
      }

      if (!result.fields[fieldId].hasMine) {
        result.fields[fieldId].hasMine = true;
        minesRemaining--;
      }
    }


    for (let y = 0; y < result.height; y++) {
      for (let x = 0; x < result.width; x++) {
         let fieldId = x + y * result.width;
         let field = result.fields[fieldId];
         field.adjecentMines = 0;
         this.minefield.forAdjecent(fieldId, (_fieldId) => {
           let _field = result.fields[_fieldId];
           if (_fieldId != fieldId && _field.hasMine) {
             field.adjecentMines++;
           }
         })
      }
    }

    result.generated = true;
  }
}
