module Play.Client {
    "use strict";


    export class EventDispatcher<T> {

        private callbacks:((value:T, completed?:()=>void)=>void)[] = [];

        register(callback:(value:T, completed?:()=>void)=>void) {
            this.callbacks.push(callback);
        }

        fire(value: T, completed?: () => void) {
            this.callbacks.forEach( c => c(value, completed));
        }
    }
}