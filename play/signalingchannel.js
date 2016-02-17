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
//# sourceMappingURL=signalingchannel.js.map