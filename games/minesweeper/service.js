var Minesweeper;
(function (Minesweeper) {
    var Service;
    (function (Service) {
        "use strict";
        var GameService = Play.GameService;
        class Field {
        }
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
        class MinesweeperService extends GameService {
            constructor(lobby) {
                super(lobby);
                this.on(Minesweeper.MessageId.CMSG_REVEAL_REQUEST, this.onRevealRequest.bind(this));
                this.on(Minesweeper.MessageId.CMSG_FLAG_REQUEST, this.onFlagRequest.bind(this));
                this.on(Minesweeper.MessageId.CMSG_MASS_REVEAL_REQUEST, this.onMassRevealRequest.bind(this));
                let configuration = this.lobby.configuration;
                this.minefield = new Minefield(configuration.width, configuration.height);
                this.mines = configuration.mines;
                this.flaggedMines = 0;
            }
            checkGameOver() {
                if (this.flaggedMines == this.mines) {
                    this.lobby.gameOver();
                }
            }
            flag(client, fieldId, flag) {
                let field = this.minefield.get(fieldId);
                if (field.isRevealed) {
                    return;
                }
                field.hasFlag = flag;
                if (flag) {
                    field.owner = client;
                    this.broadcast({ id: Minesweeper.MessageId.SMSG_FLAG, playerId: field.owner.id, fieldId: fieldId, flag: true });
                    if (field.hasMine) {
                        this.flaggedMines++;
                        this.checkGameOver();
                    }
                }
                else {
                    field.owner = null;
                    this.broadcast({ id: Minesweeper.MessageId.SMSG_FLAG, fieldId: fieldId, flag: false });
                    if (field.hasMine) {
                        this.flaggedMines--;
                        this.checkGameOver();
                    }
                }
            }
            massReveal(client, fieldId) {
                let field = this.minefield.get(fieldId);
                if (!field.isRevealed || field.adjacentMines == 0 || field.hasMine) {
                    return;
                }
                let flags = 0;
                this.minefield.forAdjacent(fieldId, (fieldId) => {
                    let field = this.minefield.get(fieldId);
                    if (field.hasFlag || (field.isRevealed && field.hasMine)) {
                        flags++;
                    }
                });
                if (flags == field.adjacentMines) {
                    this.minefield.forAdjacent(fieldId, (fieldId) => {
                        let field = this.minefield.get(fieldId);
                        if (!field.isRevealed && !field.hasFlag) {
                            this.reveal(client, fieldId);
                        }
                    });
                }
            }
            reveal(client, fieldId, doubt) {
                let field = this.minefield.get(fieldId);
                if (field.isRevealed) {
                    return;
                }
                if (field.hasFlag) {
                    if (field.owner.team == client.team) {
                        return;
                    }
                    if (!doubt) {
                        return;
                    }
                }
                field.isRevealed = true;
                field.owner = client;
                field.hasFlag = false;
                this.broadcast({
                    id: Minesweeper.MessageId.SMSG_REVEAL,
                    playerId: client.id,
                    fieldId: fieldId,
                    adjacentMines: field.adjacentMines,
                    hasMine: field.hasMine
                });
                if (field.hasFlag) {
                    if (field.hasMine) {
                        this.mines--;
                        this.checkGameOver();
                    }
                    else {
                    }
                }
                else {
                    if (field.hasMine) {
                        this.mines--;
                        this.checkGameOver();
                    }
                    else {
                        if (field.adjacentMines == 0) {
                            this.minefield.forAdjacent(fieldId, (fieldId) => {
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
                if (!this.minefield.generated) {
                    this.generate(msg.fieldId);
                }
                this.reveal(client, msg.fieldId, msg.doubt);
            }
            generate(safeFieldId) {
                let result = this.minefield;
                let safePosition = { x: (safeFieldId % result.width) | 0, y: (safeFieldId / result.width) | 0 };
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
                        field.adjacentMines = 0;
                        this.minefield.forAdjacent(fieldId, (_fieldId) => {
                            let _field = result.fields[_fieldId];
                            if (_fieldId != fieldId && _field.hasMine) {
                                field.adjacentMines++;
                            }
                        });
                    }
                }
                result.generated = true;
            }
        }
        Service.MinesweeperService = MinesweeperService;
    })(Service = Minesweeper.Service || (Minesweeper.Service = {}));
})(Minesweeper || (Minesweeper = {}));
//# sourceMappingURL=service.js.map