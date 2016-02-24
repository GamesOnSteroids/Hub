var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
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
//# sourceMappingURL=Sprite.js.map