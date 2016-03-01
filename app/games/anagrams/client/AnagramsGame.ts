namespace Anagrams.Client {
    "use strict";

    import Camera = Play.Client.Camera;
    import Game = Play.Client.Game;
    import ClientLobby = Play.Client.ClientLobby;

    export class AnagramsGame extends Game<IAnagramsVariant> {

        private camera: Camera;

        // private assets: any = {};

        private letters: string = "";
        private word: string = "";
        private locked: boolean = false;

        constructor(lobby: ClientLobby) {
            super(lobby);

            this.load();

            this.on(MessageId.SMSG_WORD, this.onWord.bind(this));
            this.on(MessageId.SMSG_INVALID_WORD, this.onInvalidWord.bind(this));
            this.on(MessageId.SMSG_LETTERS, this.onLetters.bind(this));
        }

        public initialize(): void {
            super.initialize();

            this.canvas.width = 640;
            this.canvas.height = 640;

            this.canvas.style.cursor = "pointer";

            this.camera = new Camera(this.canvas);


            this.emitChange();
        }

        protected update(delta: number): void {
            this.camera.update(delta);

        }

        protected onMouseDown(e: MouseEvent): void {

            // let position = this.camera.unproject(e.offsetX, e.offsetY);

        }

        protected onKeyPress(e: KeyboardEvent): void {
            console.log("press", e.charCode);
            let char = String.fromCharCode(e.charCode);

            let remainingLetters = this.remaningLetters(this.word, this.letters);
            if (remainingLetters.indexOf(char) != -1) {
                this.word += char;
            }

        }

        protected onKeyDown(e: KeyboardEvent): void {
            if (e.keyCode == 13) {
                if (this.word.length >= 2 && !this.locked) {
                    this.guessWord();
                }
            }
            if (e.keyCode == 8) {
                if (this.word.length > 0) {
                    this.word = this.word.substring(0, this.word.length - 1);
                }
                e.preventDefault();
            }
        }

        protected draw(delta: number): void {
            let ctx = this.context;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            ctx.setTransform(this.camera.scaleX, 0, 0, this.camera.scaleY, this.camera.translateX, this.camera.translateY);

            // let word = this.word;
            for (let i = 0; i < this.letters.length; i++) {
                ctx.font = "48px serif";
                let char = this.letters[i];
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

        private load(): void {
            // let root = "games/anagrams/assets/";
        }

        private onLetters(message: LettersMessage): void {
            console.log(message.letters);
            // this.remainingLetters = this.letters = message.letters;
        }

        private onWord(message: WordMessage): void {
            // todo: implement
        }

        private onInvalidWord(message: InvalidWordMessage): void {
            // todo: implement
        }


        private guessWord(): void {
            this.locked = true;
            console.log(this.word);
            this.word = "";
        }


        private remaningLetters(letters: string, sentence: string): string {
            let result = sentence;
            for (let i = 0; i < letters.length; i++) {
                let index = result.indexOf(letters[i]);
                result = result.slice(0, index) + result.slice(index + 1);
            }
            return result;
        }

    }

}