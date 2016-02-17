var Play;
(function (Play) {
    var Client;
    (function (Client) {
        "use strict";
        class EventDispatcher {
            constructor() {
                this.callbacks = [];
            }
            register(callback) {
                this.callbacks.push(callback);
            }
            fire(value, completed) {
                this.callbacks.forEach(c => c(value, completed));
            }
        }
        Client.EventDispatcher = EventDispatcher;
    })(Client = Play.Client || (Play.Client = {}));
})(Play || (Play = {}));
//# sourceMappingURL=EventDispatcher.js.map