var Play;
(function (Play) {
    var Client;
    (function (Client) {
        "use strict";
        class EventDispatcher {
            constructor() {
                this.lastId = 0;
                this.callbacks = new Map();
            }
            register(callback) {
                this.lastId++;
                this.callbacks.set(this.lastId, callback);
                return this.lastId;
            }
            unregister(dispatchToken) {
                this.callbacks.delete(dispatchToken);
            }
            dispatch(payload, completed) {
                for (let callback of this.callbacks.values()) {
                    callback(payload, completed);
                }
            }
        }
        Client.EventDispatcher = EventDispatcher;
    })(Client = Play.Client || (Play.Client = {}));
})(Play || (Play = {}));
//# sourceMappingURL=EventDispatcher.js.map