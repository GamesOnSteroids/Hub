namespace Play.Client {
    "use strict";


    export class EventDispatcher<T> {

        private lastId = 0;
        private callbacks = new Map<number, ((value: T, completed?: () => void) => void)>();

        public register(callback: (value: T, completed?: () => void) => void): number {
            this.lastId++;
            this.callbacks.set(this.lastId, callback);
            return this.lastId;
        }

        public unregister(dispatchToken: number): void {
            this.callbacks.delete(dispatchToken);
        }

        public dispatch(payload: T, completed?: () => void): void {
            for (let callback of this.callbacks.values()) {
                callback(payload, completed);
            }
        }
    }
}