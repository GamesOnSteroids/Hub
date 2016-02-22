var Mahjong;
(function (Mahjong) {
    var Client;
    (function (Client) {
        "use strict";
        var ClientLobby = Play.Client.ClientLobby;
        class MahjongApp extends React.Component {
            constructor() {
                super();
                this.state = {
                    players: ClientLobby.current.players,
                };
            }
            componentDidMount() {
                console.log("MahjongApp.componentDidMount");
                let game = ClientLobby.current.game;
                game.initialize();
                this.stateChangeToken = game.changeListener.register((g) => {
                    console.log("MahjongApp.changeListener");
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
        Client.MahjongApp = MahjongApp;
    })(Client = Mahjong.Client || (Mahjong.Client = {}));
})(Mahjong || (Mahjong = {}));
//# sourceMappingURL=MahjongApp.js.map