namespace Play {
    "use strict";

    export interface ISignalingChannel {
        send(data: any): void;
        onReceive(handler: (data: any) => boolean): void;
    }

    export class FirebaseSignalingChannel {
        private ref: Firebase;

        constructor(ref: Firebase) {
            this.ref = ref;
        }

        public send(data: any): void {
            this.ref.push(data);
        }

        public onReceive(handler: (data: any) => boolean): void {
            this.ref.on("child_added", (snapshot: FirebaseDataSnapshot) => {
                if (handler(snapshot.val())) {
                    snapshot.ref().remove();
                }
            });
        }
    }


}