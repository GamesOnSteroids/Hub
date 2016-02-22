var Minesweeper;
(function (Minesweeper) {
    var Server;
    (function (Server) {
        "use strict";
        var GameService = Play.Server.GameService;
        class MinesweeperService extends GameService {
            constructor(lobby) {
                super(lobby);
                this.flaggedMines = 0;
                this.generated = false;
                this.on(Minesweeper.MessageId.CMSG_REVEAL_REQUEST, this.onRevealRequest.bind(this));
                this.on(Minesweeper.MessageId.CMSG_FLAG_REQUEST, this.onFlagRequest.bind(this));
                this.on(Minesweeper.MessageId.CMSG_MASS_REVEAL_REQUEST, this.onMassRevealRequest.bind(this));
                let configuration = this.lobby.configuration.gameConfiguration;
                this.minefield = new Minesweeper.Minefield(configuration.width, configuration.height);
                this.mines = configuration.mines;
            }
            checkGameOver() {
                if (this.flaggedMines == this.mines) {
                    this.gameOver();
                }
            }
            gameOver() {
                for (let i = 0; i < this.minefield.width * this.minefield.height; i++) {
                    let field = this.minefield.get(i);
                    if (field.hasFlag) {
                        if (field.hasMine) {
                            this.score(field.owner, MinesweeperService.SCORE_CORRECT_FLAG);
                        }
                        else {
                            this.score(field.owner, MinesweeperService.SCORE_INCORRECT_FLAG);
                        }
                    }
                }
                this.lobby.gameOver();
            }
            score(client, score) {
                this.broadcast(new Minesweeper.ScoreMessage(client.id, score));
            }
            flag(client, fieldId, flag) {
                let field = this.minefield.get(fieldId);
                if (field.isRevealed) {
                    return;
                }
                field.hasFlag = flag;
                if (flag) {
                    field.owner = client;
                    this.broadcast(new Minesweeper.FlagMessage(client.id, fieldId, true));
                    if (field.hasMine) {
                        this.flaggedMines++;
                        this.checkGameOver();
                    }
                }
                else {
                    field.owner = undefined;
                    this.broadcast(new Minesweeper.FlagMessage(client.id, fieldId, false));
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
                let unknownFields = 0;
                this.minefield.forAdjacent(fieldId, (id) => {
                    let adjacentField = this.minefield.get(id);
                    if (adjacentField.hasFlag || (adjacentField.isRevealed && adjacentField.hasMine)) {
                        flags++;
                    }
                    if (!adjacentField.isRevealed && !adjacentField.hasFlag) {
                        unknownFields++;
                    }
                });
                if (flags == field.adjacentMines && unknownFields > 0) {
                    this.minefield.forAdjacent(fieldId, (id) => {
                        let adjacentField = this.minefield.get(id);
                        if (!adjacentField.isRevealed && !adjacentField.hasFlag) {
                            this.reveal(client, id);
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
                let oldOwner = field.owner;
                field.isRevealed = true;
                field.owner = client;
                field.hasFlag = false;
                this.broadcast(new Minesweeper.RevealMessage(client.id, fieldId, field.adjacentMines, field.hasMine));
                if (field.hasFlag) {
                    if (field.hasMine) {
                        this.score(oldOwner, MinesweeperService.SCORE_EXPLOSION);
                        this.score(field.owner, MinesweeperService.SCORE_CORRECT_DOUBT);
                        this.mines--;
                        this.checkGameOver();
                    }
                    else {
                        this.score(oldOwner, MinesweeperService.SCORE_CORRECT_FLAG);
                        this.score(field.owner, MinesweeperService.SCORE_INCORRECT_DOUBT);
                    }
                }
                else {
                    if (field.hasMine) {
                        this.score(field.owner, MinesweeperService.SCORE_EXPLOSION);
                        this.mines--;
                        this.checkGameOver();
                    }
                    else {
                        if (field.adjacentMines == 0) {
                            this.minefield.forAdjacent(fieldId, (id) => {
                                let adjacentField = this.minefield.get(id);
                                if (!adjacentField.hasMine && !adjacentField.isRevealed && !adjacentField.hasFlag) {
                                    this.reveal(client, id);
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
                if (!this.generated) {
                    this.generate(msg.fieldId);
                }
                this.reveal(client, msg.fieldId, msg.doubt);
            }
            generate(safeFieldId) {
                let result = this.minefield;
                for (let i = 0; i < result.width * result.height; i++) {
                    let field = new Minesweeper.Field();
                    field.hasMine = false;
                    field.owner = undefined;
                    result.fields.push(field);
                }
                let safePosition = { x: (safeFieldId % result.width) | 0, y: (safeFieldId / result.width) | 0 };
                let minesRemaining = this.mines;
                while (minesRemaining > 0) {
                    let fieldId = Math.floor(Math.random() * result.width * result.height);
                    let x = Math.floor(fieldId % result.width);
                    let y = Math.floor(fieldId / result.width);
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
                this.generated = true;
            }
        }
        MinesweeperService.SCORE_INCORRECT_FLAG = -500;
        MinesweeperService.SCORE_CORRECT_FLAG = 250;
        MinesweeperService.SCORE_CORRECT_DOUBT = 750;
        MinesweeperService.SCORE_INCORRECT_DOUBT = -1000;
        MinesweeperService.SCORE_EXPLOSION = -750;
        Server.MinesweeperService = MinesweeperService;
    })(Server = Minesweeper.Server || (Minesweeper.Server = {}));
})(Minesweeper || (Minesweeper = {}));
//# sourceMappingURL=MinesweeperService.js.map