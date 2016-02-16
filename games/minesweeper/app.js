var ClientLobby = Play.ClientLobby;
"use strict";
class MinesweeperScore extends React.Component {
}
class MinesweeperGameOver extends React.Component {
    backToLobby() {
        console.log("again");
    }
    render() {
        var overlayStyle = {
            position: "absolute",
            right: 0,
            bottom: 0,
            left: 0,
            top: 0,
            background: "rgba(1,1,1,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
            textAlign: "center"
        };
        return (React.createElement("div", {"style": overlayStyle}, React.createElement("div", null, React.createElement("h2", null, "GAME OVER"), React.createElement("br", null), React.createElement("button", {"className": "btn btn-default", "type": "submit", "onClick": this.backToLobby}, "Back to Lobby"))));
    }
}
class MinesweeperApp extends React.Component {
    constructor() {
        super();
        this.state = { isGameOver: false };
    }
    componentDidMount() {
        ClientLobby.current.game = new Minesweeper.Game.MinesweeperGame(ClientLobby.current, ClientLobby.current.configuration);
        ClientLobby.current.game.start();
        ClientLobby.current.game.onGameOverCallback = () => {
            this.setState({ isGameOver: true });
        };
    }
    render() {
        var gameStyle = { position: "relative", textAlign: "center" };
        return (React.createElement("div", {"style": gameStyle}, React.createElement("h3", null, "Minesweeper"), React.createElement("canvas", {"id": "game-canvas"}), this.state.isGameOver ? React.createElement(MinesweeperGameOver, null) : null));
    }
}
//# sourceMappingURL=app.js.map