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
        class Camera {
            constructor(canvas) {
                this.scaleX = 1;
                this.scaleY = 1;
                this.translateX = 0;
                this.translateY = 0;
                this.shakeDuration = 0;
                this.canvas = canvas;
            }
            unproject(x, y) {
                x = x * this.canvas.width / this.canvas.clientWidth;
                y = y * this.canvas.height / this.canvas.clientHeight;
                return { x: (x - this.translateX) / this.scaleX, y: (y - this.translateY) / this.scaleY };
            }
            update(delta) {
                if (this.shakeDuration > 0) {
                    this.shakeTimer += delta;
                    let x = Math.random() * 2 - 1;
                    let y = Math.random() * 2 - 1;
                    x *= this.shakeMagnitude;
                    y *= this.shakeMagnitude;
                    this.translateX += x;
                    this.translateY += y;
                    if (this.shakeTimer > this.shakeDuration) {
                        this.translateX = this.originalPositionX;
                        this.translateY = this.originalPositionY;
                        this.shakeDuration = 0;
                    }
                }
            }
            shake(magnitude, duration) {
                if (this.shakeDuration != 0) {
                    return;
                }
                this.shakeMagnitude = magnitude;
                this.shakeDuration = duration;
                this.shakeTimer = 0;
                this.originalPositionX = this.translateX;
                this.originalPositionY = this.translateY;
            }
        }
        Client.Camera = Camera;
    })(Client = Play.Client || (Play.Client = {}));
})(Play || (Play = {}));
//# sourceMappingURL=Camera.js.map