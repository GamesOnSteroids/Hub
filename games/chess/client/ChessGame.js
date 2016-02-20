var Chess;
(function (Chess) {
    var Client;
    (function (Client) {
        "use strict";
        var Camera = Play.Client.Camera;
        var Game = Play.Client.Game;
        var Mouse = Play.Client.Mouse;
        const TILE_WIDTH = 52;
        const TILE_HEIGHT = 42;
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
        }
        var MoveConstraints;
        (function (MoveConstraints) {
            MoveConstraints[MoveConstraints["Move"] = 0] = "Move";
            MoveConstraints[MoveConstraints["Fly"] = 1] = "Fly";
            MoveConstraints[MoveConstraints["Attack"] = 2] = "Attack";
        })(MoveConstraints || (MoveConstraints = {}));
        class Queen extends ChessPiece {
            constructor(id, x, y, owner) {
                super(Chess.PieceType.Queen, id, x, y, owner);
            }
            addIfValid(result, board, x, y) {
                if (!board.isValidPosition(x, y)) {
                    return false;
                }
                let anotherPiece = board.pieces.find(p => p.x == x && p.y == y);
                if (anotherPiece != null) {
                    if (anotherPiece.owner.team == this.owner.team) {
                        return false;
                    }
                    else {
                        result.push({ x: x, y: y, constraints: MoveConstraints.Attack });
                        return false;
                    }
                }
                result.push({ x: x, y: y, constraints: MoveConstraints.Move });
                return true;
            }
            getValidMoves(board) {
                let result = [];
                for (let x = this.x + 1; x < board.width; x++) {
                    if (!this.addIfValid(result, board, x, this.y)) {
                        break;
                    }
                }
                for (let y = this.y + 1; y < board.height; y++) {
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
                for (let i = 1; i < board.width; i++) {
                    if (!this.addIfValid(result, board, this.x + i, this.y + i)) {
                        break;
                    }
                }
                for (let i = 1; i < board.width; i++) {
                    if (!this.addIfValid(result, board, this.x + i, this.y - i)) {
                        break;
                    }
                }
                for (let i = 1; i < board.width; i++) {
                    if (!this.addIfValid(result, board, this.x - i, this.y + i)) {
                        break;
                    }
                }
                for (let i = 1; i < board.width; i++) {
                    if (!this.addIfValid(result, board, this.x - i, this.y - i)) {
                        break;
                    }
                }
                return result;
            }
        }
        class ChessBoard {
            constructor() {
                this.pieces = [];
                this.width = 8;
                this.height = 8;
            }
            isValidPosition(x, y) {
                if (x < 0 || y < 0 || x >= 8 || y >= 8) {
                    return false;
                }
                return true;
            }
            getValidMoves(piece) {
                let validMoves = piece.getValidMoves(this);
                return validMoves;
            }
            isMoveValid(piece, x, y) {
            }
        }
        class ChessGame extends Game {
            constructor(lobby) {
                super(lobby);
                this.assets = {};
                this.selectedPiece = null;
                this.load();
                this.on(Chess.MessageId.SMSG_CREATE_PIECE, this.onCreatePiece.bind(this));
                this.on(Chess.MessageId.SMSG_MOVE_PIECE, this.onMovePiece.bind(this));
                this.on(Chess.MessageId.SMSG_DESTROY_PIECE, this.onDestroyPiece.bind(this));
                this.chessBoard = new ChessBoard();
            }
            initialize() {
                super.initialize();
                this.canvas.width = 8 * TILE_WIDTH + TILE_WIDTH * 2;
                this.canvas.height = 8 * TILE_HEIGHT + TILE_HEIGHT * 2;
                this.canvas.style.cursor = "pointer";
                this.camera = new Camera(this.canvas);
                this.camera.translateX = TILE_WIDTH;
                this.camera.translateY = TILE_HEIGHT;
                this.emitChange();
            }
            load() {
                let root = "games/chess/assets/";
                this.assets[Chess.PieceType.Queen] = [];
                this.assets[Chess.PieceType.Queen][0] = new Image();
                this.assets[Chess.PieceType.Queen][0].src = root + "images/queen-white.png";
                this.assets[Chess.PieceType.Queen][1] = new Image();
                this.assets[Chess.PieceType.Queen][1].src = root + "images/queen-black.png";
            }
            onMovePiece(message) {
                console.log("ChessGame.onMovePiece", message);
                let piece = this.chessBoard.pieces.find(p => p.id == message.pieceId);
                piece.goal = { x: message.to.x, y: message.to.y };
            }
            onDestroyPiece(message) {
                console.log("ChessGame.onDestroyPiece", message);
            }
            onCreatePiece(message) {
                let player = this.players.find(p => p.id == message.playerId);
                if (message.type == Chess.PieceType.Queen) {
                    this.chessBoard.pieces.push(new Queen(message.pieceId, message.x, message.y, player));
                }
                else {
                    throw "Unknown piece";
                }
            }
            lerp(v0, v1, t) {
                return (1 - t) * v0 + t * v1;
            }
            length(x0, y0, x1, y1) {
                return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
            }
            update(delta) {
                this.camera.update(delta);
                let speed = 1 / (1000 * 0.5);
                for (let piece of this.chessBoard.pieces) {
                    if (piece.goal != null) {
                        let length = this.length(piece.x, piece.y, piece.goal.x, piece.goal.y);
                        piece.movementProgress += (delta * speed) / length;
                        if (piece.movementProgress > 1) {
                            piece.movementProgress = 1;
                        }
                        piece.drawX = this.lerp(piece.x, piece.goal.x, piece.movementProgress);
                        piece.drawY = this.lerp(piece.y, piece.goal.y, piece.movementProgress);
                        if (piece.movementProgress == 1) {
                            piece.x = piece.goal.x;
                            piece.y = piece.goal.y;
                            piece.goal = null;
                            piece.movementProgress = 0;
                        }
                    }
                }
            }
            movePiece(piece, x, y) {
                console.log("ChessGame.movePiece", Chess.PieceType[piece.type], x, y);
                this.send({
                    id: Chess.MessageId.CMSG_MOVE_PIECE_REQUEST,
                    pieceId: piece.id,
                    to: { x: x, y: y }
                });
            }
            onMouseDown(e) {
                let position = this.camera.unproject(e.offsetX, e.offsetY);
                let x = (position.x / TILE_WIDTH) | 0;
                let y = (position.y / TILE_HEIGHT) | 0;
                if (Mouse.button == 1) {
                    if (this.selectedPiece != null) {
                        console.log("MoveTo", Chess.PieceType[this.selectedPiece.type], x, y);
                        this.movePiece(this.selectedPiece, x, y);
                        this.selectedPiece = null;
                    }
                    if (Mouse.button == 1) {
                        let piece = this.chessBoard.pieces.find(p => p.x == x && p.y == y);
                        if (piece != null) {
                            if (piece.owner.id == this.localPlayer.id) {
                                console.log("Select", Chess.PieceType[piece.type], x, y);
                                this.selectedPiece = piece;
                            }
                        }
                    }
                }
                else if (Mouse.button == 2) {
                    console.log("Deselect");
                    this.selectedPiece = null;
                }
            }
            draw(delta) {
                var ctx = this.context;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.setTransform(this.camera.scaleX, 0, 0, this.camera.scaleY, this.camera.translateX, this.camera.translateY);
                ctx.globalAlpha = 1;
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 1;
                ctx.strokeRect(0, 0, 8 * TILE_WIDTH, 8 * TILE_HEIGHT);
                for (let y = 0; y < 8; y++) {
                    for (let x = 0; x < 8; x++) {
                        if ((x % 2) == (y % 2)) {
                            ctx.fillStyle = "#000000";
                            ctx.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
                        }
                        else {
                            ctx.fillStyle = "#FFFFFF";
                            ctx.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
                        }
                    }
                }
                if (this.selectedPiece != null) {
                    ctx.fillStyle = "#FFCC00";
                    ctx.fillRect(this.selectedPiece.x * TILE_WIDTH, this.selectedPiece.y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
                    ctx.globalAlpha = 0.6;
                    let validMoves = this.chessBoard.getValidMoves(this.selectedPiece);
                    for (let validMove of validMoves) {
                        if (validMove.constraints == MoveConstraints.Attack) {
                            ctx.fillStyle = "#FF3B30";
                        }
                        else {
                            ctx.fillStyle = "#4CD964";
                        }
                        ctx.fillRect(validMove.x * TILE_WIDTH, validMove.y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
                    }
                }
                ctx.globalAlpha = 1;
                for (let piece of this.chessBoard.pieces.sort((a, b) => b.y - a.y)) {
                    this.drawPiece(ctx, piece);
                }
            }
            drawPiece(ctx, piece) {
                let image = this.assets[piece.type][piece.owner.team];
                let x = piece.drawX;
                let y = piece.drawY;
                ctx.drawImage(image, 0, 0, image.width, image.height, x * TILE_WIDTH - image.width / 2 + TILE_WIDTH / 2, y * TILE_HEIGHT + TILE_HEIGHT - image.width - TILE_HEIGHT / 4, image.width, image.height);
            }
        }
        Client.ChessGame = ChessGame;
    })(Client = Chess.Client || (Chess.Client = {}));
})(Chess || (Chess = {}));
//# sourceMappingURL=ChessGame.js.map