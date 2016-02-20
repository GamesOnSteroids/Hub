var Chess;
(function (Chess) {
    var Client;
    (function (Client) {
        "use strict";
        class ChessPiece {
            constructor(type, id, x, y, owner) {
                this.type = type;
                this.id = id;
                this.x = x;
                this.y = y;
                this.owner = owner;
                this.timer = 0;
                this.movementProgress = 0;
                this.goal = null;
                this.drawX = x;
                this.drawY = y;
            }
            addIfValid(result, board, x, y, onlyMove) {
                if (!board.isValidPosition(x, y)) {
                    return false;
                }
                let anotherPiece = board.pieces.find(p => p.x == x && p.y == y);
                if (anotherPiece != null) {
                    if (anotherPiece.owner.team == this.owner.team || onlyMove) {
                        return false;
                    }
                    else {
                        result.push({ x: x, y: y, constraints: MoveType.Capture });
                        return false;
                    }
                }
                result.push({ x: x, y: y, constraints: MoveType.Move });
                return true;
            }
        }
        Client.ChessPiece = ChessPiece;
        (function (MoveType) {
            MoveType[MoveType["Move"] = 0] = "Move";
            MoveType[MoveType["Capture"] = 1] = "Capture";
        })(Client.MoveType || (Client.MoveType = {}));
        var MoveType = Client.MoveType;
        class King extends ChessPiece {
            constructor(id, x, y, owner) {
                super(Chess.PieceType.King, id, x, y, owner);
            }
            getValidMoves(board) {
                let result = [];
                for (let x = this.x - 1; x <= this.x + 1; x++) {
                    for (let y = this.y - 1; y <= this.y + 1; y++) {
                        this.addIfValid(result, board, x, y);
                    }
                }
                return result;
            }
        }
        Client.King = King;
        class Knight extends ChessPiece {
            constructor(id, x, y, owner) {
                super(Chess.PieceType.Knight, id, x, y, owner);
            }
            getValidMoves(board) {
                let result = [];
                this.addIfValid(result, board, this.x - 1, this.y - 2);
                this.addIfValid(result, board, this.x + 1, this.y - 2);
                this.addIfValid(result, board, this.x - 2, this.y - 1);
                this.addIfValid(result, board, this.x + 2, this.y - 1);
                this.addIfValid(result, board, this.x - 1, this.y + 2);
                this.addIfValid(result, board, this.x + 1, this.y + 2);
                this.addIfValid(result, board, this.x - 2, this.y + 1);
                this.addIfValid(result, board, this.x + 2, this.y + 1);
                return result;
            }
        }
        Client.Knight = Knight;
        class Bishop extends ChessPiece {
            constructor(id, x, y, owner) {
                super(Chess.PieceType.Bishop, id, x, y, owner);
            }
            getValidMoves(board) {
                let result = [];
                for (let i = 1; i < board.size; i++) {
                    if (!this.addIfValid(result, board, this.x + i, this.y + i)) {
                        break;
                    }
                }
                for (let i = 1; i < board.size; i++) {
                    if (!this.addIfValid(result, board, this.x + i, this.y - i)) {
                        break;
                    }
                }
                for (let i = 1; i < board.size; i++) {
                    if (!this.addIfValid(result, board, this.x - i, this.y + i)) {
                        break;
                    }
                }
                for (let i = 1; i < board.size; i++) {
                    if (!this.addIfValid(result, board, this.x - i, this.y - i)) {
                        break;
                    }
                }
                return result;
            }
        }
        Client.Bishop = Bishop;
        class Rook extends ChessPiece {
            constructor(id, x, y, owner) {
                super(Chess.PieceType.Rook, id, x, y, owner);
            }
            getValidMoves(board) {
                let result = [];
                for (let x = this.x + 1; x < board.size; x++) {
                    if (!this.addIfValid(result, board, x, this.y)) {
                        break;
                    }
                }
                for (let y = this.y + 1; y < board.size; y++) {
                    if (!this.addIfValid(result, board, this.x, y)) {
                        break;
                    }
                }
                for (let x = this.x - 1; x >= 0; x--) {
                    if (!this.addIfValid(result, board, x, this.y)) {
                        break;
                    }
                }
                for (let y = this.y - 1; y >= 0; y--) {
                    if (!this.addIfValid(result, board, this.x, y)) {
                        break;
                    }
                }
                return result;
            }
        }
        Client.Rook = Rook;
        class Pawn extends ChessPiece {
            constructor(id, x, y, direction, owner) {
                super(Chess.PieceType.Pawn, id, x, y, owner);
                this.direction = direction;
            }
            getValidMoves(board) {
                let result = [];
                if (this.direction == Chess.Direction4.Up) {
                    let forward = this.addIfValid(result, board, this.x, this.y - 1, true);
                    if (forward && this.y == board.size - 2) {
                        this.addIfValid(result, board, this.x, this.y - 2);
                    }
                    {
                        let piece = board.pieces.find(p => p.x == this.x - 1 && p.y == this.y - 1);
                        if (piece != null && piece.owner.team != this.owner.team) {
                            this.addIfValid(result, board, this.x - 1, this.y - 1);
                        }
                    }
                    {
                        let piece = board.pieces.find(p => p.x == this.x + 1 && p.y == this.y - 1);
                        if (piece != null && piece.owner.team != this.owner.team) {
                            this.addIfValid(result, board, this.x + 1, this.y - 1);
                        }
                    }
                }
                else if (this.direction == Chess.Direction4.Down) {
                    let forward = this.addIfValid(result, board, this.x, this.y + 1, true);
                    if (forward && this.y == 1) {
                        this.addIfValid(result, board, this.x, this.y + 2);
                    }
                    {
                        let piece = board.pieces.find(p => p.x == this.x - 1 && p.y == this.y + 1);
                        if (piece != null && piece.owner.team != this.owner.team) {
                            this.addIfValid(result, board, this.x - 1, this.y + 1);
                        }
                    }
                    {
                        let piece = board.pieces.find(p => p.x == this.x + 1 && p.y == this.y + 1);
                        if (piece != null && piece.owner.team != this.owner.team) {
                            this.addIfValid(result, board, this.x + 1, this.y + 1);
                        }
                    }
                }
                return result;
            }
        }
        Client.Pawn = Pawn;
        class Queen extends ChessPiece {
            constructor(id, x, y, owner) {
                super(Chess.PieceType.Queen, id, x, y, owner);
            }
            getValidMoves(board) {
                let result = [];
                for (let x = this.x + 1; x < board.size; x++) {
                    if (!this.addIfValid(result, board, x, this.y)) {
                        break;
                    }
                }
                for (let y = this.y + 1; y < board.size; y++) {
                    if (!this.addIfValid(result, board, this.x, y)) {
                        break;
                    }
                }
                for (let x = this.x - 1; x >= 0; x--) {
                    if (!this.addIfValid(result, board, x, this.y)) {
                        break;
                    }
                }
                for (let y = this.y - 1; y >= 0; y--) {
                    if (!this.addIfValid(result, board, this.x, y)) {
                        break;
                    }
                }
                for (let i = 1; i < board.size; i++) {
                    if (!this.addIfValid(result, board, this.x + i, this.y + i)) {
                        break;
                    }
                }
                for (let i = 1; i < board.size; i++) {
                    if (!this.addIfValid(result, board, this.x + i, this.y - i)) {
                        break;
                    }
                }
                for (let i = 1; i < board.size; i++) {
                    if (!this.addIfValid(result, board, this.x - i, this.y + i)) {
                        break;
                    }
                }
                for (let i = 1; i < board.size; i++) {
                    if (!this.addIfValid(result, board, this.x - i, this.y - i)) {
                        break;
                    }
                }
                return result;
            }
        }
        Client.Queen = Queen;
        class ChessBoard {
            constructor() {
                this.pieces = [];
                this.size = 8;
            }
            isValidPosition(x, y) {
                if (x < 0 || y < 0 || x >= 8 || y >= 8) {
                    return false;
                }
                return true;
            }
        }
        Client.ChessBoard = ChessBoard;
    })(Client = Chess.Client || (Chess.Client = {}));
})(Chess || (Chess = {}));
//# sourceMappingURL=ChessBoard.js.map