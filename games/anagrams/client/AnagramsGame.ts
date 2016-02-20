module Anagrams.Client {
    "use strict";

    import EventDispatcher = Play.Client.EventDispatcher;
    import Camera = Play.Client.Camera;
    import Game = Play.Client.Game;
    import Mouse = Play.Client.Mouse;
    import Sprite = Play.Client.Sprite;
    import ClientLobby = Play.Client.ClientLobby;

    export class AnagramsGame extends Game {

        private camera:Camera;

        private assets:any = {};

        private letters: string = "";
        private word: string = "";
        private locked: boolean = false;

        constructor(lobby:ClientLobby) {
            super(lobby);

            this.load();

            this.on(MessageId.SMSG_WORD, this.onWord.bind(this));
            this.on(MessageId.SMSG_INVALID_WORD, this.onInvalidWord.bind(this));
            this.on(MessageId.SMSG_LETTERS, this.onLetters.bind(this));
        }

        initialize() {
            super.initialize();

            this.canvas.width = 640;
            this.canvas.height = 640;

            this.canvas.style.cursor = "pointer";

            this.camera = new Camera(this.canvas);


            this.emitChange();
        }

        load() {
            let root = "games/anagrams/assets/";
        }

        onLetters(message: LettersMessage) {
            console.log(message.letters);
            this.remainingLetters = this.letters = message.letters;
        }

        onWord(message:WordMessage) {

        }

        onInvalidWord(message:InvalidWordMessage) {

        }


        update(delta:number) {
            this.camera.update(delta);

        }

        onMouseDown(e:MouseEvent) {

            let position = this.camera.unproject(e.offsetX, e.offsetY);

        }

        guessWord() {
            this.locked = true;
            console.log(this.word);
            this.word = "";
        }


        remaningLetters(letters: string, sentence: string) {
            let result = sentence;
            for (let i = 0; i < letters.length; i++) {
                let index = result.indexOf(letters[i]);
                result = result.slice(0, index) + result.slice(index + 1);
            }
            return result;
        }

        onKeyPress(e: KeyboardEvent) {
            console.log("press", e.charCode);
            let char = String.fromCharCode(e.charCode);

            let remainingLetters = this.remaningLetters(this.word, this.letters);
            if (remainingLetters.indexOf(char) != -1) {
                this.word += char;
            }

        }

        onKeyDown(e: KeyboardEvent) {
            if (e.keyCode == 13) {
                if (this.word.length >= 2 && !this.locked) {
                    this.guessWord();
                }
            }
            if (e.keyCode == 8) {
                if (this.word.length > 0) {
                    this.word = this.word.substring(0, this.word.length-1);
                }
                e.preventDefault();
            }
        }

        draw(delta:number):void {
            var ctx = this.context;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            ctx.setTransform(this.camera.scaleX, 0, 0, this.camera.scaleY, this.camera.translateX, this.camera.translateY);

            let word = this.word;
            for (let i = 0; i < this.letters.length; i++) {
                ctx.font = "48px serif";
                var char = this.letters[i];
                if (this.word.indexOf(char) != -1) {
                    ctx.fillStyle = "#FF0000";
                } else {
                    ctx.fillStyle = "#000000";
                }
                ctx.fillText(char, 55 * i, 55);
            }
            ctx.fillStyle = "#000000";
            ctx.fillText(this.word, 0, 100);

        }
    }

}