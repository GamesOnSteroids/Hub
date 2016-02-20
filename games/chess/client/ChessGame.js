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
        class ChessGame extends Game {
            constructor(lobby) {
                super(lobby);
                this.assets = {};
                this.selectedPiece = null;
                this.load();
                this.on(Chess.MessageId.SMSG_CREATE_PIECE, this.onCreatePiece.bind(this));
                this.on(Chess.MessageId.SMSG_MOVE_PIECE, this.onMovePiece.bind(this));
                this.on(Chess.MessageId.SMSG_DESTROY_PIECE, this.onDestroyPiece.bind(this));
                this.chessBoard = new Client.ChessBoard();
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
                for (let pieceType = 1; pieceType <= 6; pieceType++) {
                    this.assets[pieceType] = [];
                    for (let team = 0; team < 2; team++) {
                        this.assets[pieceType][team] = new Image();
                        this.assets[pieceType][team].src = `${root}images/${pieceType}-${team}.png`;
                    }
                }
            }
            onMovePiece(message) {
                console.log("ChessGame.onMovePiece", message);
                let piece = this.chessBoard.pieces.find(p => p.id == message.pieceId);
                piece.goal = { x: message.to.x, y: message.to.y };
            }
            onDestroyPiece(message) {
                console.log("ChessGame.onDestroyPiece", message);
                let piece = this.chessBoard.pieces.find(p => p.id == message.pieceId);
                if (this.selectedPiece == piece) {
                    this.selectedPiece = null;
                }
                this.chessBoard.pieces.splice(this.chessBoard.pieces.indexOf(piece), 1);
            }
            onCreatePiece(message) {
                console.log("ChessGame.onCreatePiece", message.pieceId, Chess.PieceType[message.type], message.x, message.y);
                let player = this.players.find(p => p.id == message.playerId);
                if (message.type == Chess.PieceType.Queen) {
                    this.chessBoard.pieces.push(new Client.Queen(message.pieceId, message.x, message.y, player));
                }
                else if (message.type == Chess.PieceType.King) {
                    this.chessBoard.pieces.push(new Client.King(message.pieceId, message.x, message.y, player));
                }
                else if (message.type == Chess.PieceType.Knight) {
                    this.chessBoard.pieces.push(new Client.Knight(message.pieceId, message.x, message.y, player));
                }
                else if (message.type == Chess.PieceType.Bishop) {
                    this.chessBoard.pieces.push(new Client.Bishop(message.pieceId, message.x, message.y, player));
                }
                else if (message.type == Chess.PieceType.Rook) {
                    this.chessBoard.pieces.push(new Client.Rook(message.pieceId, message.x, message.y, player));
                }
                else if (message.type == Chess.PieceType.Pawn) {
                    let direction;
                    if (player.team == 0)
                        direction = Chess.Direction4.Up;
                    else if (player.team == 1)
                        direction = Chess.Direction4.Down;
                    else if (player.team == 2)
                        direction = Chess.Direction4.Right;
                    else if (player.team == 3)
                        direction = Chess.Direction4.Left;
                    this.chessBoard.pieces.push(new Client.Pawn(message.pieceId, message.x, message.y, direction, player));
                }
            }
            update(delta) {
                this.camera.update(delta);
                for (let piece of this.chessBoard.pieces) {
                    if (piece.goal != null) {
                        let length = Math.length(piece.x, piece.y, piece.goal.x, piece.goal.y);
                        piece.movementProgress += (delta * Chess.MOVEMENT_SPEED) / length;
                        if (piece.movementProgress > 1) {
                            piece.movementProgress = 1;
                        }
                        piece.drawX = Math.lerp(piece.x, piece.goal.x, piece.movementProgress);
                        piece.drawY = Math.lerp(piece.y, piece.goal.y, piece.movementProgress);
                        if (piece.movementProgress == 1) {
                            piece.x = piece.goal.x;
                            piece.y = piece.goal.y;
                            piece.goal = null;
                            piece.movementProgress = 0;
                            piece.timer = Chess.LOCK_TIMER;
                        }
                    }
                    if (piece.timer > 0) {
                        piece.timer -= delta * (1 / 1000);
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
                    let piece = this.chessBoard.pieces.find(p => p.x == x && p.y == y);
                    if (piece != null && piece.timer <= 0 && piece.movementProgress == 0 && piece.owner.id == this.localPlayer.id) {
                        console.log("Select", Chess.PieceType[piece.type], x, y);
                        this.selectedPiece = piece;
                    }
                    else if (this.selectedPiece != null) {
                        console.log("MoveTo", Chess.PieceType[this.selectedPiece.type], x, y);
                        let validMoves = this.selectedPiece.getValidMoves(this.chessBoard);
                        if (validMoves.find(m => m.x == x && m.y == y) != null) {
                            this.movePiece(this.selectedPiece, x, y);
                            this.selectedPiece = null;
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
                    let validMoves = this.selectedPiece.getValidMoves(this.chessBoard);
                    for (let validMove of validMoves) {
                        if (validMove.constraints == Client.MoveType.Capture) {
                            ctx.fillStyle = "#FF3B30";
                        }
                        else {
                            ctx.fillStyle = "#4CD964";
                        }
                        ctx.fillRect(validMove.x * TILE_WIDTH, validMove.y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
                    }
                }
                for (let piece of this.chessBoard.pieces.sort((a, b) => a.drawY - b.drawY)) {
                    this.drawPiece(ctx, piece);
                }
            }
            drawPiece(ctx, piece) {
                let image = this.assets[piece.type][piece.owner.team];
                let x = piece.drawX * TILE_WIDTH;
                let y = piece.drawY * TILE_HEIGHT;
                ctx.globalAlpha = 1;
                ctx.drawImage(image, 0, 0, image.width, image.height, x - image.width / 2 + TILE_WIDTH / 2, y + TILE_HEIGHT - image.width - TILE_HEIGHT / 4, image.width, image.height);
                if (piece.timer > 0) {
                    ctx.globalAlpha = 0.9;
                    ctx.fillStyle = "#FF0000";
                    ctx.beginPath();
                    let progress = (piece.timer * Math.PI * 2) / Chess.LOCK_TIMER;
                    ctx.moveTo(x + TILE_WIDTH / 2, y + TILE_HEIGHT / 2);
                    ctx.arc(x + TILE_WIDTH / 2, y + TILE_HEIGHT / 2, TILE_WIDTH / 3, 0, progress);
                    ctx.fill();
                }
            }
        }
        Client.ChessGame = ChessGame;
    })(Client = Chess.Client || (Chess.Client = {}));
})(Chess || (Chess = {}));
//# sourceMappingURL=ChessGame.js.map