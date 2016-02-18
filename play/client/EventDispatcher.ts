module Play.Client {
    "use strict";


    export class EventDispatcher<T> {

        private lastId = 0;
        private callbacks = new Map<number, ((value:T, completed?:()=>void)=>void)>();

        register(callback:(value:T, completed?:()=>void)=>void): number {
            this.lastId++;
            this.callbacks.set(this.lastId, callback);
            return this.lastId;
        }

        unregister(dispatchToken: number) {
            this.callbacks.delete(dispatchToken);
        }

        dispatch(payload: T, completed?: () => void) {
            for (let callback of this.callbacks.values()) {
                callback(payload, completed);
            }
        }
    }
}