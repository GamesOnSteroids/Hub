module Chess.Client {
    "use strict";

    export abstract class ChessPiece {
        public timer:number = 0;
        public movementProgress:number = 0;
        public drawX:number;
        public drawY:number;
        public goal:{x: number, y: number} = null;

        constructor(public type:PieceType, public id:number, public x:number, public y:number, public owner:PlayerInfo) {
            this.drawX = x;
            this.drawY = y;
        }

        abstract getValidMoves(board:ChessBoard):IMove[];


        protected addIfValid(result:IMove[], board:ChessBoard, x:number, y:number, onlyMove?: boolean):boolean {
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
        constructor(id:number, x:number, y:number, owner:PlayerInfo) {
            super(PieceType.King, id, x, y, owner);
        }

        getValidMoves(board:ChessBoard):IMove[] {
            let result:IMove[] = [];
            for (let x = this.x - 1; x <= this.x + 1; x++) {
                for (let y = this.y - 1; y <= this.y + 1; y++) {
                    this.addIfValid(result, board, x, y);
                }
            }
            return result;
        }
    }

    export class Knight extends ChessPiece {
        constructor(id:number, x:number, y:number, owner:PlayerInfo) {
            super(PieceType.Knight, id, x, y, owner);
        }

        getValidMoves(board:ChessBoard):IMove[] {
            let result:IMove[] = [];
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
        constructor(id:number, x:number, y:number, owner:PlayerInfo) {
            super(PieceType.Bishop, id, x, y, owner);
        }

        getValidMoves(board:ChessBoard):IMove[] {
            let result:IMove[] = [];
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
        constructor(id:number, x:number, y:number, owner:PlayerInfo) {
            super(PieceType.Rook, id, x, y, owner);
        }

        getValidMoves(board:ChessBoard):IMove[] {
            let result:IMove[] = [];

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
        constructor(id:number, x:number, y:number, public direction:Direction4, owner:PlayerInfo) {
            super(PieceType.Pawn, id, x, y, owner);
        }

        getValidMoves(board:ChessBoard):IMove[] {
            let result:IMove[] = [];

            if (this.direction == Direction4.Up) {

                let forward = this.addIfValid(result, board, this.x, this.y - 1, true);
                if (forward && this.y == board.size - 2) {
                    this.addIfValid(result, board, this.x, this.y - 2);
                }
                {
                    let piece = board.pieces.find(p=>p.x == this.x - 1 && p.y == this.y - 1);
                    if (piece != null && piece.owner.team != this.owner.team) {
                        this.addIfValid(result, board, this.x - 1, this.y - 1);
                    }
                }
                {
                    let piece = board.pieces.find(p=>p.x == this.x + 1 && p.y == this.y - 1);
                    if (piece != null && piece.owner.team != this.owner.team) {
                        this.addIfValid(result, board, this.x + 1, this.y - 1);
                    }
                }
            } else if (this.direction == Direction4.Down) {

                let forward = this.addIfValid(result, board, this.x, this.y + 1, true);
                if (forward && this.y == 1) {
                    this.addIfValid(result, board, this.x, this.y + 2);
                }
                {
                    let piece = board.pieces.find(p=>p.x == this.x - 1 && p.y == this.y + 1);
                    if (piece != null && piece.owner.team != this.owner.team) {
                        this.addIfValid(result, board, this.x - 1, this.y + 1);
                    }
                }
                {
                    let piece = board.pieces.find(p=>p.x == this.x + 1 && p.y == this.y + 1);
                    if (piece != null && piece.owner.team != this.owner.team) {
                        this.addIfValid(result, board, this.x + 1, this.y + 1);
                    }
                }
            }


            return result;
        }
    }

    export class Queen extends ChessPiece {
        constructor(id:number, x:number, y:number, owner:PlayerInfo) {
            super(PieceType.Queen, id, x, y, owner);
        }

        getValidMoves(board:ChessBoard):IMove[] {
            let result:IMove[] = [];
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

    export class ChessBoard {
        public pieces:ChessPiece[] = [];
        public size:number = 8;

        isValidPosition(x:number, y:number):boolean {
            if (x < 0 || y < 0 || x >= 8 || y >= 8) {
                return false;
            }

            return true;
        }

    }
}