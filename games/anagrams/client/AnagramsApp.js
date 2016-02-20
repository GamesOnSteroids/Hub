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