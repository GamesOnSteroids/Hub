var Chess;
(function (Chess) {
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
        }
        goTo(x, y) {
            this.start = { x: this.x, y: this.y };
            this.goal = { x: x, y: y };
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
    Chess.ChessPiece = ChessPiece;
    (function (MoveType) {
        MoveType[MoveType["Move"] = 0] = "Move";
        MoveType[MoveType["Capture"] = 1] = "Capture";
    })(Chess.MoveType || (Chess.MoveType = {}));
    var MoveType = Chess.MoveType;
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
    Chess.King = King;
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
    Chess.Knight = Knight;
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
    Chess.Bishop = Bishop;
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
    Chess.Rook = Rook;
    class Pawn extends ChessPiece {
        constructor(id, x, y, direction, owner) {
            super(Chess.PieceType.Pawn, id, x, y, owner);
            this.direction = direction;
        }
        getValidMoves(board) {
            let result = [];
            let dir;
            if (this.direction == Chess.Direction4.Left || this.direction == Chess.Direction4.Up) {
                dir = -1;
            }
            else {
                dir = 1;
            }
            if (this.direction == Chess.Direction4.Up || this.direction == Chess.Direction4.Down) {
                let forward = this.addIfValid(result, board, this.x, this.y + dir, true);
                if (forward && ((this.direction == Chess.Direction4.Up && this.y == board.size - 2) || (this.direction == Chess.Direction4.Down && this.y == 1))) {
                    this.addIfValid(result, board, this.x, this.y + 2 * dir, true);
                }
                {
                    let piece = board.pieces.find(p => p.x == this.x - 1 && p.y == this.y + dir);
                    if (piece != null && piece.owner.team != this.owner.team) {
                        this.addIfValid(result, board, this.x - 1, this.y + dir);
                    }
                }
                {
                    let piece = board.pieces.find(p => p.x == this.x + 1 && p.y == this.y + dir);
                    if (piece != null && piece.owner.team != this.owner.team) {
                        this.addIfValid(result, board, this.x + 1, this.y + dir);
                    }
                }
            }
            else if (this.direction == Chess.Direction4.Left || this.direction == Chess.Direction4.Right) {
                let forward = this.addIfValid(result, board, this.x + dir, this.y, true);
                if (forward && ((this.direction == Chess.Direction4.Left && this.x == board.size - 2) || (this.direction == Chess.Direction4.Right && this.x == 1))) {
                    this.addIfValid(result, board, this.x + 2 * dir, this.y, true);
                }
                {
                    let piece = board.pieces.find(p => p.x == this.x + dir && p.y == this.y - 1);
                    if (piece != null && piece.owner.team != this.owner.team) {
                        this.addIfValid(result, board, this.x + dir, this.y - 1);
                    }
                }
                {
                    let piece = board.pieces.find(p => p.x == this.x + dir && p.y == this.y + 1);
                    if (piece != null && piece.owner.team != this.owner.team) {
                        this.addIfValid(result, board, this.x + dir, this.y + 1);
                    }
                }
            }
            return result;
        }
    }
    Chess.Pawn = Pawn;
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
    Chess.Queen = Queen;
    class ChessBoard {
        constructor(size) {
            this.size = size;
            this.pieces = [];
        }
    }
    Chess.ChessBoard = ChessBoard;
    class TwoPlayerChessBoard extends ChessBoard {
        constructor() {
            super(8);
        }
        isValidPosition(x, y) {
            if (x < 0 || y < 0 || x >= this.size || y >= this.size) {
                return false;
            }
            return true;
        }
        initialize(players) {
            for (let i = 0; i < 8; i++) {
                this.pieces.push(new Pawn(this.pieces.length, i, 6, Chess.Direction4.Up, players[0]));
                this.pieces.push(new Pawn(this.pieces.length, i, 1, Chess.Direction4.Down, players[1]));
            }
            for (let i = 0; i < 2; i++) {
                let row;
                if (i == 0) {
                    row = 7;
                }
                else {
                    row = 0;
                }
                this.pieces.push(new Rook(this.pieces.length, 0, row, players[i]));
                this.pieces.push(new Knight(this.pieces.length, 1, row, players[i]));
                this.pieces.push(new Bishop(this.pieces.length, 2, row, players[i]));
                this.pieces.push(new King(this.pieces.length, 3, row, players[i]));
                this.pieces.push(new Queen(this.pieces.length, 4, row, players[i]));
                this.pieces.push(new Bishop(this.pieces.length, 5, row, players[i]));
                this.pieces.push(new Knight(this.pieces.length, 6, row, players[i]));
                this.pieces.push(new Rook(this.pieces.length, 7, row, players[i]));
            }
        }
    }
    Chess.TwoPlayerChessBoard = TwoPlayerChessBoard;
    class FourPlayerChessBoard extends ChessBoard {
        constructor() {
            super(14);
        }
        isValidPosition(x, y) {
            if (x < 0 || y < 0 || x >= this.size || y >= this.size) {
                return false;
            }
            if (x < 3 && y < 3) {
                return false;
            }
            if (x < 3 && y >= this.size - 3) {
                return false;
            }
            if (x >= this.size - 3 && y >= this.size - 3) {
                return false;
            }
            if (x >= this.size - 3 && y < 3) {
                return false;
            }
            return true;
        }
        initialize(players) {
            for (let i = 0; i < 8; i++) {
                this.pieces.push(new Pawn(this.pieces.length, 3 + i, 12, Chess.Direction4.Up, players[0]));
                this.pieces.push(new Pawn(this.pieces.length, 3 + i, 1, Chess.Direction4.Down, players[1]));
                this.pieces.push(new Pawn(this.pieces.length, 12, 3 + i, Chess.Direction4.Left, players[2]));
                this.pieces.push(new Pawn(this.pieces.length, 1, 3 + i, Chess.Direction4.Right, players[3]));
            }
            for (let i = 0; i < 2; i++) {
                let row;
                if (i == 0) {
                    row = 13;
                }
                else {
                    row = 0;
                }
                this.pieces.push(new Rook(this.pieces.length, 3, row, players[i]));
                this.pieces.push(new Knight(this.pieces.length, 4, row, players[i]));
                this.pieces.push(new Bishop(this.pieces.length, 5, row, players[i]));
                this.pieces.push(new King(this.pieces.length, 6, row, players[i]));
                this.pieces.push(new Queen(this.pieces.length, 7, row, players[i]));
                this.pieces.push(new Bishop(this.pieces.length, 8, row, players[i]));
                this.pieces.push(new Knight(this.pieces.length, 9, row, players[i]));
                this.pieces.push(new Rook(this.pieces.length, 10, row, players[i]));
                this.pieces.push(new Rook(this.pieces.length, row, 3, players[i + 2]));
                this.pieces.push(new Knight(this.pieces.length, row, 4, players[i + 2]));
                this.pieces.push(new Bishop(this.pieces.length, row, 5, players[i + 2]));
                this.pieces.push(new King(this.pieces.length, row, 6, players[i + 2]));
                this.pieces.push(new Queen(this.pieces.length, row, 7, players[i + 2]));
                this.pieces.push(new Bishop(this.pieces.length, row, 8, players[i + 2]));
                this.pieces.push(new Knight(this.pieces.length, row, 9, players[i + 2]));
                this.pieces.push(new Rook(this.pieces.length, row, 10, players[i + 2]));
            }
        }
    }
    Chess.FourPlayerChessBoard = FourPlayerChessBoard;
})(Chess || (Chess = {}));
//# sourceMappingURL=ChessBoard.js.map