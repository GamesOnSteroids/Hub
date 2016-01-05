Minesweeper.Game = {}

Minesweeper.Game.Field = class Field {

}

Minesweeper.Game.Minefield = class Minefield {

  forAdjecent(x, y, callback) {
    for (let _y = Math.max(0, y - 1); _y <= Math.min(y + 1, this.height - 1); _y++) {
      for (let _x = Math.max(0, x - 1); _x <= Math.min(x + 1, this.width - 1); _x++) {
        let fieldId = _x + _y * this.width;
        callback(fieldId);
      }
    }
  }

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.fields = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let field = this.fields[x + y * this.width] = new Minesweeper.Game.Field();
        field.isRevealed = false;
      }
    }
  }

  get(fieldId) {
    return this.fields[fieldId];
  }
}


const TILE_SIZE = 20;


Minesweeper.Game.MinesweeperGame = class MinesweeperGame extends Game {

  constructor(lobby) {
    super(lobby);

    this.minefield = new Minesweeper.Game.Minefield(10, 10);
    this.lobby.on(SMSG_REVEAL, this.onReveal.bind(this));
    this.lobby.on(SMSG_FLAG, this.onFlag.bind(this));

    this.canvas.width = this.minefield.width * TILE_SIZE * 4;
    this.canvas.height = this.minefield.height * TILE_SIZE * 4;
    this.canvas.style.cursor = "pointer";

    this.camera = new Camera();
  }

  flag(x, y) {
    let field = this.minefield.get(x + y * this.minefield.width);

    if (field.isRevealed) {
      return;
    }

    if (field.owner != null) {
      if (field.owner.id == this.lobby.localPlayer.id) {
        this.send({id: CMSG_FLAG_REQUEST, fieldId: x + y * this.minefield.width, flag: false});
      }
    } else {
      this.send({id: CMSG_FLAG_REQUEST, fieldId: x + y * this.minefield.width, flag: true});
    }
      //TODO: play sound

  }

  massReveal(x, y) {
    let field = this.minefield.get(x + y * this.minefield.width);
    if (!field.isRevealed) {
      return;
    }

    let flags = 0
    this.minefield.forAdjecent(x, y, (fieldId) => {
      let field = this.minefield.get(fieldId);
      if (field.hasFlag) {
        flags++;
      }
    });

    if (flags == field.adjecentMines) {
      this.send({id: CMSG_MASS_REVEAL_REQUEST, fieldId: x + y * this.minefield.width});
    }
  }

  reveal(x, y) {
    let field = this.minefield.get(x + y * this.minefield.width);

    if (field.isRevealed) {
      return;
    }
    this.send({id: CMSG_REVEAL_REQUEST, fieldId: x + y * this.minefield.width});

    //TODO: play sound
  }

  onFlag(player, msg) {
    let field = this.minefield.get(msg.fieldId);
    field.owner = this.lobby.players[msg.playerId];
    field.hasFlag = msg.flag;
  }

  onReveal(player, msg) {
    let field = this.minefield.get(msg.fieldId);
    field.isRevealed = true;
    field.owner = this.lobby.players[msg.playerId];
    field.adjecentMines = msg.adjecentMines;
    field.hasMine = msg.hasMine;
    if (field.hasMine) {
      //TODO: explosion sound
      //TODO: screen shake
    }

  }


  load() {
    this.assets = [];

    let root = "games/minesweeper/assets/";

    this.assets.hidden = new Image();
    this.assets.hidden.src = root + "images/hidden.png";
    this.assets.over = new Image();
    this.assets.over.src = root + "images/over.png";

    this.assets.reveal = [];
    this.assets.mines = [];
    this.assets.flags = [];
    this.assets.reveal[0] = new Image();
    this.assets.reveal[0].src = root + "images/empty-red.png";
    this.assets.mines[0] = new Image();
    this.assets.mines[0].src = root + "images/mine-red.png";
    this.assets.flags[0] = new Image();
    this.assets.flags[0].src = root + "images/flag-red.png";

    this.assets.numbers = [];
    for (let i = 0; i < 8; i++) {
      this.assets.numbers[i] = new Image();
      this.assets.numbers[i].src = root + "images/" + (i + 1) + ".png";
    }
  }


  draw() {
    var ctx = this.context;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.setTransform(this.camera.scale.x,0,0,this.camera.scale.y,this.camera.translate.x,this.camera.translate.y);


    for (let y = 0; y < this.minefield.height; y++) {
      for (let x = 0; x < this.minefield.width; x++) {
        let field = this.minefield.get(x + y * this.minefield.width);



        //console.log(x, y, field);
        if (field.isRevealed) {
          ctx.drawImage(this.assets.reveal[field.owner.team], x * TILE_SIZE, y * TILE_SIZE);
          if (field.hasMine) {
            ctx.drawImage(this.assets.mines[field.owner.team], x * TILE_SIZE, y * TILE_SIZE);
          } else {
            if (field.adjecentMines > 0) {
              ctx.drawImage(this.assets.numbers[field.adjecentMines - 1], x * TILE_SIZE, y * TILE_SIZE);
            }
          }
           // neco
        } else {

          // if mouse over
          let mousePosition = this.camera.unproject(Mouse.x, Mouse.y);

          if (field.hasFlag) {
            ctx.drawImage(this.assets.hidden, x * TILE_SIZE, y * TILE_SIZE);
            ctx.drawImage(this.assets.flags[field.owner.team], x * TILE_SIZE, y * TILE_SIZE - TILE_SIZE / 3);
          } else {

            if (x == ((mousePosition.x / TILE_SIZE) | 0) && y == ((mousePosition.y / TILE_SIZE) | 0)) {
              if (Mouse.button == 1) {
                ctx.drawImage(this.assets.reveal[0], x * TILE_SIZE, y * TILE_SIZE);
              } else {
                ctx.drawImage(this.assets.over, x * TILE_SIZE, y * TILE_SIZE);
              }
            } else {
              ctx.drawImage(this.assets.hidden, x * TILE_SIZE, y * TILE_SIZE);
            }
          }

        }
      }
    }
  }

  onMouseDown(e) {

    if (Mouse.button == 2) {
      let position = this.camera.unproject(e.offsetX, e.offsetY);
      let x = (position.x / TILE_SIZE) | 0;
      let y = (position.y / TILE_SIZE) | 0;
      if (x >= 0 && y >= 0 && x < this.minefield.width && y < this.minefield.height) {
        this.flag(x, y);
      }
    }
  }

  onMouseUp(e) {
    if (Mouse.button == 1 || Mouse.button == 3) {
      let position = this.camera.unproject(e.offsetX, e.offsetY);

      let x = (position.x / TILE_SIZE) | 0;
      let y = (position.y / TILE_SIZE) | 0;
      if (x >= 0 && y >= 0 && x < this.minefield.width && y < this.minefield.height) {
        if (Mouse.button == 3) {
          this.massReveal(x, y)
        } else {
          this.reveal(x, y);
        }
      }
    }
  }
}
