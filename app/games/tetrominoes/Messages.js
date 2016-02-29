var Tetrominoes;
(function (Tetrominoes) {
    "use strict";
    var GameMessage = Play.GameMessage;
    Tetrominoes.DROP_GRAVITY = 1 / 16;
    (function (CellType) {
        CellType[CellType["Empty"] = 0] = "Empty";
        CellType[CellType["Full"] = 1] = "Full";
        CellType[CellType["PowerUpBomb"] = 2] = "PowerUpBomb";
    })(Tetrominoes.CellType || (Tetrominoes.CellType = {}));
    var CellType = Tetrominoes.CellType;
    class Cell {
        constructor() {
            this.owner = null;
            this.type = CellType.Empty;
        }
    }
    Tetrominoes.Cell = Cell;
    class Playfield {
        constructor(width, height, gravity) {
            this.width = width;
            this.height = height;
            this.gravity = gravity;
            this.tetrominoes = [];
            this.board = [];
            this.level = 1;
            for (let i = 0; i < this.width * this.height; i++) {
                this.board[i] = new Cell();
            }
        }
        collides(x, y, orientation, type) {
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
        set(x, y, owner, type) {
            this.board[x + y * this.width].owner = owner;
            this.board[x + y * this.width].type = type;
        }
    }
    Tetrominoes.Playfield = Playfield;
    (function (TetrominoType) {
        TetrominoType[TetrominoType["L"] = 0] = "L";
        TetrominoType[TetrominoType["Z"] = 1] = "Z";
        TetrominoType[TetrominoType["O"] = 2] = "O";
        TetrominoType[TetrominoType["S"] = 3] = "S";
        TetrominoType[TetrominoType["I"] = 4] = "I";
        TetrominoType[TetrominoType["J"] = 5] = "J";
        TetrominoType[TetrominoType["T"] = 6] = "T";
    })(Tetrominoes.TetrominoType || (Tetrominoes.TetrominoType = {}));
    var TetrominoType = Tetrominoes.TetrominoType;
    class Tetromino {
        constructor(type, owner, x, y, orientation, gravity) {
            this.type = type;
            this.owner = owner;
            this.x = x;
            this.y = y;
            this.orientation = orientation;
            this.gravity = gravity;
            this.timer = 0;
        }
        getShape() {
            return Tetromino.SHAPES.get(this.type)[this.orientation];
        }
    }
    Tetromino.SHAPES = new Map([
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
    ]);
    Tetrominoes.Tetromino = Tetromino;
    (function (MoveType) {
        MoveType[MoveType["Left"] = 0] = "Left";
        MoveType[MoveType["Right"] = 1] = "Right";
        MoveType[MoveType["RotateClockwise"] = 2] = "RotateClockwise";
        MoveType[MoveType["Drop"] = 3] = "Drop";
    })(Tetrominoes.MoveType || (Tetrominoes.MoveType = {}));
    var MoveType = Tetrominoes.MoveType;
    (function (MessageId) {
        MessageId[MessageId["SMSG_CREATE_TETROMINO"] = 0] = "SMSG_CREATE_TETROMINO";
        MessageId[MessageId["CMSG_MOVE_REQUEST"] = 1] = "CMSG_MOVE_REQUEST";
        MessageId[MessageId["SMSG_MOVE"] = 2] = "SMSG_MOVE";
        MessageId[MessageId["SMSG_DESTROY_TETROMINO"] = 3] = "SMSG_DESTROY_TETROMINO";
        MessageId[MessageId["SMSG_UPDATE_BOARD"] = 4] = "SMSG_UPDATE_BOARD";
        MessageId[MessageId["SMSG_SCORE"] = 5] = "SMSG_SCORE";
        MessageId[MessageId["SMSG_LEVEL_UP"] = 6] = "SMSG_LEVEL_UP";
    })(Tetrominoes.MessageId || (Tetrominoes.MessageId = {}));
    var MessageId = Tetrominoes.MessageId;
    class LevelUpMessage extends GameMessage {
        constructor(gravity) {
            super(MessageId.SMSG_LEVEL_UP);
            this.gravity = gravity;
        }
    }
    Tetrominoes.LevelUpMessage = LevelUpMessage;
    class ScoreMessage extends GameMessage {
        constructor(playerId, score) {
            super(MessageId.SMSG_SCORE);
            this.playerId = playerId;
            this.score = score;
        }
    }
    Tetrominoes.ScoreMessage = ScoreMessage;
    class MoveMessage extends GameMessage {
        constructor(playerId, type) {
            super(MessageId.SMSG_MOVE);
            this.playerId = playerId;
            this.type = type;
        }
    }
    Tetrominoes.MoveMessage = MoveMessage;
    class MoveRequestMessage extends GameMessage {
        constructor(type) {
            super(MessageId.CMSG_MOVE_REQUEST);
            this.type = type;
        }
    }
    Tetrominoes.MoveRequestMessage = MoveRequestMessage;
    class UpdateBoardMessage extends GameMessage {
        constructor(cells) {
            super(MessageId.SMSG_UPDATE_BOARD);
            this.cells = cells;
        }
    }
    Tetrominoes.UpdateBoardMessage = UpdateBoardMessage;
    class DestroyTetrominoMessage extends GameMessage {
        constructor(playerId) {
            super(MessageId.SMSG_DESTROY_TETROMINO);
            this.playerId = playerId;
        }
    }
    Tetrominoes.DestroyTetrominoMessage = DestroyTetrominoMessage;
    class CreateTetrominoMessage extends GameMessage {
        constructor(playerId, type, x) {
            super(MessageId.SMSG_CREATE_TETROMINO);
            this.playerId = playerId;
            this.type = type;
            this.x = x;
        }
    }
    Tetrominoes.CreateTetrominoMessage = CreateTetrominoMessage;
})(Tetrominoes || (Tetrominoes = {}));
