module Play.Client {
    "use strict";

    export class Camera {
        public scaleX = 1;
        public scaleY = 1;
        public translateX = 0;
        public translateY = 0;

        private shakeMagnitude: number;
        private shakeDuration: number = 0;
        private shakeTimer: number;
        private originalPositionX: number;
        private originalPositionY: number;

        private canvas: HTMLCanvasElement;

        constructor(canvas: HTMLCanvasElement) {
            this.canvas = canvas;
        }

        unproject(x: number, y: number): {x: number, y: number} {
            x = x * this.canvas.width / this.canvas.clientWidth;
            y = y * this.canvas.height / this.canvas.clientHeight;
            return {x: (x - this.translateX) / this.scaleX, y: (y - this.translateY) / this.scaleY};
        }

        update(delta: number) {

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

        shake(magnitude: number, duration: number) {
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
}