namespace Tetrominoes {
    "use strict";

    import GameMessage = Play.GameMessage;
    import IGameVariant = Play.IGameVariant;

    export interface ITetrominoesVariant extends IGameVariant {
        width: number;
        height: number;
        gravity: number;
    }

    export var DROP_GRAVITY = 1 / 16;

    export enum CellType {
        Empty,
        Full,
        PowerUpBomb,
    }

    export class Cell {
        public owner: PlayerInfo = null;
        public type: CellType = CellType.Empty;
    }

    export class Playfield {
        public tetrominoes: Tetromino[] = [];
        public board: Cell[] = [];
        public level: number = 1;
        public lines: number = 0;

        constructor(public width: number, public height: number, public gravity: number) {

            for (let i = 0; i < this.width * this.height; i++) {
                this.board[i] = new Cell();
            }
        }

        public collides(x: number, y: number, orientation: number, type: TetrominoType): boolean {
            let shape = Tetromino.SHAPES.get(type)[orientation];
            for (let shapeY = 0; shapeY < shape.length; shapeY++) {
                for (let shapeX = 0; shapeX < shape[shapeY].length; shapeX++) {
                    if (shape[shapeY][shapeX]) {
                        if ((y + shapeY == this.height) || (x + shapeX < 0) || (x + shapeX >= this.width) || (this.board[x + shapeX + (y + shapeY) * this.width].type != CellType.Empty)) {
                            return true;
                        }
                    }
                }
            }
        }

        public set(x: number, y: number, owner: PlayerInfo, type: CellType) {
            this.board[x + y * this.width].owner = owner;
            this.board[x + y * this.width].type = type;
        }

    }


    export enum TetrominoType {
        L,
        Z,
        O,
        S,
        I,
        J,
        T
    }

    export class Tetromino {
        public static SHAPES = new Map<TetrominoType, boolean[][][]>(
            [
                [
                    TetrominoType.S,
                    [
                        [
                            [false, true, true],
                            [true, true, false],
                            [false, false, false]
                        ],
                        [
                            [false, true, false],
                            [false, true, true],
                            [false, false, true],
                        ],
                        [
                            [false, false, false],
                            [false, true, true],
                            [true, true, false],
                        ],
                        [
                            [true, false, false],
                            [true, true, false],
                            [false, true, false],
                        ],
                    ]
                ],
                [
                    TetrominoType.Z,
                    [
                        [
                            [true, true, false],
                            [false, true, true],
                            [false, false, false]
                        ],
                        [
                            [false, false, true],
                            [false, true, true],
                            [false, true, false],
                        ],
                        [
                            [false, false, false],
                            [true, true, false],
                            [false, true, true],
                        ],
                        [
                            [false, true, false],
                            [true, true, false],
                            [true, false, false],
                        ],
                    ]
                ],
                [
                    TetrominoType.O,
                    [
                        [
                            [true, true],
                            [true, true],
                        ],
                        [
                            [true, true],
                            [true, true],
                        ],
                        [
                            [true, true],
                            [true, true],
                        ],
                        [
                            [true, true],
                            [true, true],
                        ],
                    ]
                ],
                [
                    TetrominoType.J,
                    [
                        [
                            [false, true, false],
                            [false, true, false],
                            [true, true, false],
                        ],
                        [
                            [true, false, false],
                            [true, true, true],
                            [false, false, false],
                        ],
                        [
                            [false, true, true],
                            [false, true, false],
                            [false, true, false],
                        ],
                        [
                            [false, false, false],
                            [true, true, true],
                            [false, false, true],
                        ],
                    ]
                ],
                [
                    TetrominoType.L,
                    [
                        [
                            [false, true, false],
                            [false, true, false],
                            [false, true, true],
                        ],
                        [
                            [false, false, false],
                            [true, true, true],
                            [true, false, false],
                        ],
                        [
                            [true, true, false],
                            [false, true, false],
                            [false, true, false],
                        ],
                        [
                            [false, false, true],
                            [true, true, true],
                            [false, false, false],
                        ],
                    ]
                ],
                [
                    TetrominoType.T,
                    [
                        [
                            [false, true, false],
                            [true, true, true],
                            [false, false, false],
                        ],
                        [
                            [false, true, false],
                            [false, true, true],
                            [false, true, false],
                        ],
                        [
                            [false, false, false],
                            [true, true, true],
                            [false, true, false],
                        ],
                        [
                            [false, true, false],
                            [true, true, false],
                            [false, true, false],
                        ]
                    ]
                ],
                [
                    TetrominoType.I,
                    [
                        [
                            [false, true, false, false],
                            [false, true, false, false],
                            [false, true, false, false],
                            [false, true, false, false],
                        ],
                        [
                            [false, false, false, false],
                            [true, true, true, true],
                            [false, false, false, false],
                            [false, false, false, false],
                        ],
                        [
                            [false, false, true, false],
                            [false, false, true, false],
                            [false, false, true, false],
                            [false, false, true, false],
                        ],
                        [
                            [false, false, false, false],
                            [false, false, false, false],
                            [true, true, true, true],
                            [false, false, false, false],
                        ],
                    ]
                ]
            ]
        );

        public timer: number = 0;

        constructor(public type: TetrominoType, public owner: PlayerInfo, public x: number, public y: number, public orientation: number, public gravity: number) {

        }

        public getShape(): boolean[][] {
            return Tetromino.SHAPES.get(this.type)[this.orientation];
        }

    }


    export enum MoveType {
        Left,
        Right,
        RotateClockwise,
        Drop
    }


    export enum MessageId {
        SMSG_CREATE_TETROMINO,
        CMSG_MOVE_REQUEST,
        SMSG_MOVE,
        SMSG_DESTROY_TETROMINO,
        SMSG_UPDATE_BOARD,
        SMSG_SCORE,
        SMSG_LEVEL_UP,
    }

    export class LevelUpMessage extends GameMessage {
        constructor(public gravity: number) {
            super(MessageId.SMSG_LEVEL_UP);
        }
    }

    export class ScoreMessage extends GameMessage {
        constructor(public playerId: string, public score: number) {
            super(MessageId.SMSG_SCORE);
        }
    }

    export class MoveMessage extends GameMessage {
        constructor(public playerId: string, public type: MoveType) {
            super(MessageId.SMSG_MOVE);
        }
    }

    export class MoveRequestMessage extends GameMessage {
        constructor(public type: MoveType) {
            super(MessageId.CMSG_MOVE_REQUEST);
        }
    }

    export class UpdateBoardMessage extends GameMessage {
        constructor(public cells: {playerId?: string, type: CellType}[]) {
            super(MessageId.SMSG_UPDATE_BOARD);
        }
    }

    export class DestroyTetrominoMessage extends GameMessage {
        constructor(public playerId: string) {
            super(MessageId.SMSG_DESTROY_TETROMINO);
        }
    }

    export class CreateTetrominoMessage extends GameMessage {
        constructor(public playerId: string, public type: TetrominoType, public x: number) {
            super(MessageId.SMSG_CREATE_TETROMINO);
        }
    }


}