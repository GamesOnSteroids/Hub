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
    var Server;
    (function (Server) {
        "use strict";
        class GameService extends Server.Service {
            constructor(lobby) {
                super(lobby);
                this.tick = this.tick.bind(this);
                this.lastFrame = performance.now();
            }
            start() {
            }
            get players() {
                return this.lobby.clients;
            }
            on(id, handler) {
                this.lobby.on(Play.ServiceType.Game, id, handler);
            }
            update(delta) {
            }
            tick(time) {
                let delta = time - this.lastFrame;
                this.update(delta);
                this.lastFrame = time;
                window.requestAnimationFrame(this.tick);
            }
        }
        Server.GameService = GameService;
    })(Server = Play.Server || (Play.Server = {}));
})(Play || (Play = {}));
//# sourceMappingURL=GameService.js.map