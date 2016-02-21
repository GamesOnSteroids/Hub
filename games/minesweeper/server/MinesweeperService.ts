module Minesweeper.Server {
    "use strict";

    import Client = Play.Server.Client;
    import GameService = Play.Server.GameService;
    import ServerLobby = Play.Server.ServerLobby;
    import IPlayerInfo = Play.IPlayerInfo;

    export class MinesweeperService extends GameService {

        static SCORE_INCORRECT_FLAG = -500;
        static SCORE_CORRECT_FLAG = 250;
        static SCORE_CORRECT_DOUBT = 750;
        static SCORE_INCORRECT_DOUBT = -1000;
        static SCORE_EXPLOSION = -750;

        private minefield:Minefield;
        private mines:number;
        private flaggedMines:number;

        constructor(lobby:ServerLobby) {
            super(lobby);

            this.on(MessageId.CMSG_REVEAL_REQUEST, this.onRevealRequest.bind(this));
            this.on(MessageId.CMSG_FLAG_REQUEST, this.onFlagRequest.bind(this));
            this.on(MessageId.CMSG_MASS_REVEAL_REQUEST, this.onMassRevealRequest.bind(this));

            let configuration = this.lobby.configuration.gameConfiguration;

            this.minefield = new Minefield(configuration.width, configuration.height);
            this.mines = configuration.mines;
            this.flaggedMines = 0;
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
                    } else {
                        this.score(field.owner, MinesweeperService.SCORE_INCORRECT_FLAG);
                    }
                }
            }
            this.lobby.gameOver();
        }


        score(client:IPlayerInfo, score:number) {
            this.broadcast<ScoreMessage>({
                id: MessageId.SMSG_SCORE,
                playerId: client.id,
                score: score
            })
        }


        flag(client:Client, fieldId:number, flag:boolean) {
            let field = this.minefield.get(fieldId);
            if (field.isRevealed) {
                return;
            }

            field.hasFlag = flag;
            if (flag) {
                field.owner = client;
                this.broadcast<FlagMessage>({
                    id: MessageId.SMSG_FLAG,
                    playerId: client.id,
                    fieldId: fieldId,
                    flag: true
                });
                if (field.hasMine) {
                    this.flaggedMines++;
                    this.checkGameOver();
                }
            } else {
                field.owner = null;
                this.broadcast<FlagMessage>({
                    id: MessageId.SMSG_FLAG,
                    playerId: client.id,
                    fieldId: fieldId,
                    flag: false
                });
                if (field.hasMine) {
                    this.flaggedMines--;
                    this.checkGameOver();
                }
            }


        }

        massReveal(client:Client, fieldId:number) {

            let field = this.minefield.get(fieldId);
            if (!field.isRevealed || field.adjacentMines == 0 || field.hasMine) {
                return;
            }


            let flags = 0;
            let unknownFields = 0;
            this.minefield.forAdjacent(fieldId, (fieldId) => {
                let field = this.minefield.get(fieldId);
                if (field.hasFlag || (field.isRevealed && field.hasMine)) {
                    flags++;
                }
                if (!field.isRevealed && !field.hasFlag) { // are there any unrevealed unflagged fields left?
                    unknownFields++;
                }
            });

            if (flags == field.adjacentMines && unknownFields > 0) {
                this.minefield.forAdjacent(fieldId, (fieldId) => {
                    let field = this.minefield.get(fieldId);
                    if (!field.isRevealed && !field.hasFlag) { // reveal all non flagged
                        this.reveal(client, fieldId);
                    }
                });
            }

        }


        reveal(client:Client, fieldId:number, doubt?:boolean) {

            let field = this.minefield.get(fieldId);
            if (field.isRevealed) {
                return;
            }
            if (field.hasFlag) {
                // Can not reveal your own flags
                if (field.owner.team == client.team) {
                    return;
                }
                // can only doubt flags of other players
                if (!doubt) {
                    return;
                }
            }

            let oldOwner = field.owner;
            field.isRevealed = true;
            field.owner = client;
            field.hasFlag = false;

            this.broadcast<RevealMessage>({
                id: <number>MessageId.SMSG_REVEAL,
                playerId: client.id,
                fieldId: fieldId,
                adjacentMines: field.adjacentMines,
                hasMine: field.hasMine
            });

            if (field.hasFlag) {
                if (field.hasMine) { // doubt mine
                    this.score(oldOwner, MinesweeperService.SCORE_EXPLOSION);
                    this.score(field.owner, MinesweeperService.SCORE_CORRECT_DOUBT);
                    this.mines--;
                    this.checkGameOver();
                } else { // doubt empty field
                    this.score(oldOwner, MinesweeperService.SCORE_CORRECT_FLAG);
                    this.score(field.owner, MinesweeperService.SCORE_INCORRECT_DOUBT);
                }
            } else {
                if (field.hasMine) { // reveal mine
                    this.score(field.owner, MinesweeperService.SCORE_EXPLOSION);
                    this.mines--;
                    this.checkGameOver();
                } else { // reveal empty field
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

        onFlagRequest(client:Client, msg:FlagRequestMessage) {
            this.flag(client, msg.fieldId, msg.flag);
        }

        onMassRevealRequest(client:Client, msg:MassRevealRequestMessage) {

            this.massReveal(client, msg.fieldId);
        }

        onRevealRequest(client:Client, msg:RevealRequestMessage) {
            //todo: sanitize input

            if (!this.minefield.generated) {
                this.generate(msg.fieldId)
            }

            this.reveal(client, msg.fieldId, msg.doubt);

        }

        generate(safeFieldId:number) {

            let result = this.minefield;

            let safePosition = {x: (safeFieldId % result.width) | 0, y: (safeFieldId / result.width) | 0}

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
                    })
                }
            }

            result.generated = true;
        }
    }

}