class Camera {
   constructor() {
     this.scale = { x: 1, y: 1 };
     this.translate = { x: 20, y: 20 };
   }

   unproject(x, y) {
     return {x: (x - this.translate.x) / this.scale.x, y: (y - this.translate.y) / this.scale.y };
   }
}

class Mouse {

}

Game = class Game {

  constructor(lobby) {
    this.lobby = lobby;
    this.canvas = document.getElementById("gameCanvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.onmousemove = (e) => { Mouse.x = e.offsetX; Mouse.y = e.offsetY;

    };
    this.canvas.onmouseup = (e) => {  Mouse.x = e.offsetX; Mouse.y = e.offsetY;
      this.onMouseUp(e);
      if (e.button == 0) Mouse.button &= ~1;
      if (e.button == 2) Mouse.button &= ~2;
    };
    this.canvas.onmousedown = (e) => {  Mouse.x = e.offsetX; Mouse.y = e.offsetY;
      if (e.button == 0) Mouse.button |= 1;
      if (e.button == 2) Mouse.button |= 2;
      this.onMouseDown(e);
    };
    this.canvas.oncontextmenu = (e) => { return false;  };
    this.canvas.onselectstart = (e) => { return false;  };
    window.requestAnimationFrame(this.tick.bind(this));

    this.load();
  }

  tick(time) {
    this.draw(time);
    this.update(time);

    window.requestAnimationFrame(this.tick.bind(this));
  }

  load() { }
  draw() { }
  update() { }
  onMouseUp(e) { }
  onMouseDown(e) { }

  send(msg) {
    this.lobby.sendToServer(msg);
  }
}
