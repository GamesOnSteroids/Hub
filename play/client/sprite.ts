module Play.Client {
    "use strict";

    export class Sprite {

        public positionX: number;
        public positionY: number;
        public image: HTMLImageElement;

        public frameCount: number;
        public frameSize: number;

        public time: number;
        public frameIndex: number;
        public duration: number;
        public isFinished: boolean;


        constructor(positionX: number, positionY: number, image: HTMLImageElement, frameSize: number, duration: number)
        {
            this.positionX = positionX;
            this.positionY = positionY;
            this.frameSize = frameSize;
            this.image = image;
            this.frameCount = image.width / frameSize;
            this.duration = duration / this.frameCount;
            this.frameIndex = 0;
            this.time = 0;
        }

        public update(delta: number) {
            this.time += delta;
            while (this.time > this.duration) {
                this.time -= this.duration;
                this.frameIndex++;

                if (this.frameIndex == this.frameCount) {
                    this.isFinished = true;
                    break;
                }
            }
        }

        public draw(ctx: CanvasRenderingContext2D, delta: number) {
            ctx.drawImage(this.image, this.frameIndex * this.frameSize, 0, this.frameSize, this.frameSize, this.positionX - this.frameSize / 2, this.positionY - this.frameSize / 2, this.frameSize, this.frameSize);
        }
    }
}