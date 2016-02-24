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
var Anagrams;
(function (Anagrams) {
    var Client;
    (function (Client) {
        "use strict";
        var ClientLobby = Play.Client.ClientLobby;
        class AnagramsApp extends React.Component {
            constructor() {
                super();
                let game = ClientLobby.current.game;
                this.state = {
                    players: ClientLobby.current.players,
                };
            }
            componentDidMount() {
                console.log("AnagramsApp.componentDidMount");
                let game = ClientLobby.current.game;
                game.initialize();
                this.stateChangeToken = game.changeListener.register((game) => {
                    console.log("AnagramsApp.changeListener");
                    this.setState({
                        players: ClientLobby.current.players
                    });
                });
            }
            componentWillUnmount() {
                let game = ClientLobby.current.game;
                game.changeListener.unregister(this.stateChangeToken);
            }
            render() {
                return (React.createElement("div", {"style": { position: "relative", textAlign: "center" }}, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-xs-12 col-md-8"}, React.createElement("canvas", {"id": "game-canvas"})), React.createElement("div", {"className": "col-xs-12 col-md-4"}), React.createElement("div", {"className": "col-xs-12 col-md-4"}, React.createElement(Chat, null)))));
            }
        }
        Client.AnagramsApp = AnagramsApp;
    })(Client = Anagrams.Client || (Anagrams.Client = {}));
})(Anagrams || (Anagrams = {}));
//# sourceMappingURL=AnagramsApp.js.map