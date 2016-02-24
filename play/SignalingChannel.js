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
    "use strict";
    class FirebaseSignalingChannel {
        constructor(ref) {
            this.ref = ref;
        }
        send(data) {
            this.ref.push(data);
        }
        onReceive(handler) {
            this.ref.on("child_added", (snapshot) => {
                if (handler(snapshot.val())) {
                    snapshot.ref().remove();
                }
            });
        }
    }
    Play.FirebaseSignalingChannel = FirebaseSignalingChannel;
})(Play || (Play = {}));
//# sourceMappingURL=SignalingChannel.js.map