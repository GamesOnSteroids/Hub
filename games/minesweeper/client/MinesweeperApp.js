var Minesweeper;
(function (Minesweeper) {
    var Client;
    (function (Client) {
        "use strict";
        var ClientLobby = Play.Client.ClientLobby;
        class MinesweeperApp extends React.Component {
            constructor() {
                super();
                let game = ClientLobby.current.game;
                this.state = {
                    players: ClientLobby.current.players,
                    remainingMines: game.remainingMines
                };
            }
            componentDidMount() {
                console.log("MinesweeperApp.componentDidMount");
                let game = ClientLobby.current.game;
                game.initialize();
                this.stateChangeToken = game.changeListener.register((game) => {
                    console.log("MinesweeperApp.changeListener");
                    this.setState({
                        players: ClientLobby.current.players,
                        remainingMines: game.remainingMines
                    });
                });
            }
            componentWillUnmount() {
                let game = ClientLobby.current.game;
                game.changeListener.unregister(this.stateChangeToken);
            }
            render() {
                return (React.createElement("div", {"style": { position: "relative", textAlign: "center" }}, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-xs-12 col-md-8"}, React.createElement("canvas", {"id": "game-canvas"})), React.createElement("div", {"className": "col-xs-12 col-md-4"}, React.createElement(Client.MinesweeperScore, {"players": this.state.players, "remainingMines": this.state.remainingMines})), React.createElement("div", {"className": "col-xs-12 col-md-4"}, React.createElement(Chat, null)))));
            }
        }
        Client.MinesweeperApp = MinesweeperApp;
    })(Client = Minesweeper.Client || (Minesweeper.Client = {}));
})(Minesweeper || (Minesweeper = {}));
//# sourceMappingURL=MinesweeperApp.js.map