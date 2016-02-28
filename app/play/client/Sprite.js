var Play;
(function (Play) {
    var Client;
    (function (Client) {
        "use strict";
        class Sprite {
            constructor(positionX, positionY, image, frameSize, duration) {
                this.positionX = positionX;
                this.positionY = positionY;
                this.frameSize = frameSize;
                this.image = image;
                this.frameCount = image.width / frameSize;
                this.duration = duration / this.frameCount;
                this.frameIndex = 0;
                this.time = 0;
            }
            update(delta) {
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
            draw(ctx, delta) {
                ctx.drawImage(this.image, this.frameIndex * this.frameSize, 0, this.frameSize, this.frameSize, this.positionX - this.frameSize / 2, this.positionY - this.frameSize / 2, this.frameSize, this.frameSize);
            }
        }
        Client.Sprite = Sprite;
    })(Client = Play.Client || (Play.Client = {}));
})(Play || (Play = {}));
