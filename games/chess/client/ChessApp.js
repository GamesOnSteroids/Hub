var Chess;
(function (Chess) {
    var Client;
    (function (Client) {
        "use strict";
        var ClientLobby = Play.Client.ClientLobby;
        class ChessApp extends React.Component {
            constructor() {
                super();
                this.state = {
                    players: ClientLobby.current.players,
                };
            }
            componentDidMount() {
                console.log("ChessApp.componentDidMount");
                let game = ClientLobby.current.game;
                game.initialize();
                this.stateChangeToken = game.changeListener.register((game) => {
                    console.log("ChessApp.changeListener");
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
                return (React.createElement("div", {"style": { position: "relative", textAlign: "center" }}, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-xs-12 col-md-8"}, React.createElement("canvas", {"id": "game-canvas"})), React.createElement("div", {"className": "col-xs-12 col-md-4"}, React.createElement(Chess.Client.ChessScore, {"players": this.state.players})), React.createElement("div", {"className": "col-xs-12 col-md-4"}, React.createElement(Chat, null)))));
            }
        }
        Client.ChessApp = ChessApp;
    })(Client = Chess.Client || (Chess.Client = {}));
})(Chess || (Chess = {}));
//# sourceMappingURL=ChessApp.js.map