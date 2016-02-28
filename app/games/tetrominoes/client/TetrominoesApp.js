var Tetrominoes;
(function (Tetrominoes) {
    var Client;
    (function (Client) {
        "use strict";
        var ClientLobby = Play.Client.ClientLobby;
        class TetrominoesApp extends React.Component {
            constructor() {
                super();
                this.state = {
                    players: ClientLobby.current.players,
                };
            }
            componentDidMount() {
                console.log("TetrominoesApp.componentDidMount");
                let game = ClientLobby.current.game;
                game.initialize();
                this.stateChangeToken = game.changeListener.register((g) => {
                    console.log("TetrominoesApp.changeListener");
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
                return (React.createElement("div", {style: { position: "relative", textAlign: "center" }}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-xs-12 col-md-8"}, React.createElement("canvas", {id: "game-canvas", style: { borderImage: 'url("/app/games/tetrominoes/assets/images/border.png") 16 16 repeat' }})), React.createElement("div", {className: "col-xs-12 col-md-4"}, React.createElement(Client.TetrominoesScore, {players: this.state.players})), React.createElement("div", {className: "col-xs-12 col-md-4"}, React.createElement(Chat, null)))));
            }
        }
        Client.TetrominoesApp = TetrominoesApp;
    })(Client = Tetrominoes.Client || (Tetrominoes.Client = {}));
})(Tetrominoes || (Tetrominoes = {}));
