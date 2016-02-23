namespace Chess {
    "use strict";

    import IPlayerInfo = Play.IPlayerInfo;

    export abstract class ChessPiece {
        public timer: number = 0;
        public movementProgress: number = 0;
        public start: {x: number, y: number};
        public goal: {x: number, y: number} = null;

        constructor(public type: PieceType, public id: number, public x: number, public y: number, public owner: IPlayerInfo) {
        }

        goTo(x: number, y: number) {
            this.start = {x: this.x, y: this.y};
            this.goal = {x: x, y: y};
        }

        abstract getValidMoves(board: ChessBoard): IMove[];


        protected addIfValid(result: IMove[], board: ChessBoard, x: number, y: number, onlyMove?: boolean): boolean {
            if (!board.isValidPosition(x, y)) {
                return false;
            }
            let anotherPiece = board.pieces.find(p=>p.x == x && p.y == y);
            if (anotherPiece != null) {
                if (anotherPiece.owner.team == this.owner.team || onlyMove) {
                    return false;
                } else {
                    result.push({x: x, y: y, constraints: MoveType.Capture});
                    return false;
                }
            }
            result.push({x: x, y: y, constraints: MoveType.Move});
            return true;
        }
    }


    export enum MoveType {
        Move,
        Capture,
    }

    interface IMove {
        x: number;
        y: number;
        constraints: MoveType
    }

    export class King extends ChessPiece {
        constructor(id: number, x: number, y: number, owner: IPlayerInfo) {
            super(PieceType.King, id, x, y, owner);
        }

        getValidMoves(board: ChessBoard): IMove[] {
            let result: IMove[] = [];
            for (let x = this.x - 1; x <= this.x + 1; x++) {
                for (let y = this.y - 1; y <= this.y + 1; y++) {
                    this.addIfValid(result, board, x, y);
                }
            }
            return result;
        }
    }

    export class Knight extends ChessPiece {
        constructor(id: number, x: number, y: number, owner: IPlayerInfo) {
            super(PieceType.Knight, id, x, y, owner);
        }

        getValidMoves(board: ChessBoard): IMove[] {
            let result: IMove[] = [];
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

    export class Bishop extends ChessPiece {
        constructor(id: number, x: number, y: number, owner: IPlayerInfo) {
            super(PieceType.Bishop, id, x, y, owner);
        }

        getValidMoves(board: ChessBoard): IMove[] {
            let result: IMove[] = [];
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

    export class Rook extends ChessPiece {
        constructor(id: number, x: number, y: number, owner: IPlayerInfo) {
            super(PieceType.Rook, id, x, y, owner);
        }

        getValidMoves(board: ChessBoard): IMove[] {
            let result: IMove[] = [];

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

    export class Pawn extends ChessPiece {
        constructor(id: number, x: number, y: number, public direction: Direction4, owner: IPlayerInfo) {
            super(PieceType.Pawn, id, x, y, owner);
        }

        getValidMoves(board: ChessBoard): IMove[] {
            let result: IMove[] = [];

            let dir: number;
            if (this.direction == Direction4.Left || this.direction == Direction4.Up) {
                dir = -1;
            } else {
                dir = 1;
            }

            if (this.direction == Direction4.Up || this.direction == Direction4.Down) {
                let forward = this.addIfValid(result, board, this.x, this.y + dir, true);
                if (forward && ((this.direction == Direction4.Up && this.y == board.size - 2) || (this.direction == Direction4.Down && this.y == 1))) {
                    this.addIfValid(result, board, this.x, this.y + 2 * dir, true);
                }
                {
                    let piece = board.pieces.find(p=>p.x == this.x - 1 && p.y == this.y + dir);
                    if (piece != null && piece.owner.team != this.owner.team) {
                        this.addIfValid(result, board, this.x - 1, this.y + dir);
                    }
                }
                {
                    let piece = board.pieces.find(p=>p.x == this.x + 1 && p.y == this.y + dir);
                    if (piece != null && piece.owner.team != this.owner.team) {
                        this.addIfValid(result, board, this.x + 1, this.y + dir);
                    }
                }
            } else if (this.direction == Direction4.Left || this.direction == Direction4.Right) {

                let forward = this.addIfValid(result, board, this.x + dir, this.y, true);
                if (forward && ((this.direction == Direction4.Left && this.x == board.size - 2) || (this.direction == Direction4.Right && this.x == 1))) {
                    this.addIfValid(result, board, this.x + 2 * dir, this.y, true);
                }
                {
                    let piece = board.pieces.find(p=>p.x == this.x + dir && p.y == this.y - 1);
                    if (piece != null && piece.owner.team != this.owner.team) {
                        this.addIfValid(result, board, this.x + dir, this.y - 1);
                    }
                }
                {
                    let piece = board.pieces.find(p=>p.x == this.x + dir && p.y == this.y + 1);
                    if (piece != null && piece.owner.team != this.owner.team) {
                        this.addIfValid(result, board, this.x + dir, this.y + 1);
                    }
                }
            }


            return result;
        }
    }

    export class Queen extends ChessPiece {
        constructor(id: number, x: number, y: number, owner: IPlayerInfo) {
            super(PieceType.Queen, id, x, y, owner);
        }

        getValidMoves(board: ChessBoard): IMove[] {
            let result: IMove[] = [];
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

    export abstract class ChessBoard {
        public pieces: ChessPiece[] = [];

        constructor(public size: number) {

        }

        abstract isValidPosition(x: number, y: number): boolean;

        abstract initialize(players: IPlayerInfo[]): void;
    }

    export class TwoPlayerChessBoard extends ChessBoard {

        constructor() {
            super(8);
        }

        isValidPosition(x: number, y: number): boolean {
            if (x < 0 || y < 0 || x >= this.size || y >= this.size) {
                return false;
            }

            return true;
        }

        initialize(players: IPlayerInfo[]) {
            for (let i = 0; i < 8; i++) {
                this.pieces.push(new Pawn(this.pieces.length, i, 6, Direction4.Up, players[0]));
                this.pieces.push(new Pawn(this.pieces.length, i, 1, Direction4.Down, players[1]));
            }
            for (let i = 0; i < 2; i++) {
                let row: number;
                if (i == 0) {
                    row = 7;
                } else {
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

    export class FourPlayerChessBoard extends ChessBoard {

        constructor() {
            super(14);
        }

        isValidPosition(x: number, y: number): boolean {
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

        initialize(players: IPlayerInfo[]) {
            for (let i = 0; i < 8; i++) {
                this.pieces.push(new Pawn(this.pieces.length, 3 + i, 12, Direction4.Up, players[0]));
                this.pieces.push(new Pawn(this.pieces.length, 3 + i, 1, Direction4.Down, players[1]));
                this.pieces.push(new Pawn(this.pieces.length, 12, 3 + i, Direction4.Left, players[2]));
                this.pieces.push(new Pawn(this.pieces.length, 1, 3 + i, Direction4.Right, players[3]));
            }
            for (let i = 0; i < 2; i++) {
                let row: number;
                if (i == 0) {
                    row = 13;
                } else {
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

}