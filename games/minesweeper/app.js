"use strict";
class MinesweeperScore extends React.Component {
}
class MinesweeperGameOver extends React.Component {
    playAgain() {
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
        return (React.createElement("div", {"style": overlayStyle}, React.createElement("div", null, React.createElement("h2", null, "GAME OVER"), React.createElement("br", null), React.createElement("button", {"className": "btn btn-default", "onClick": this.playAgain}, "Play again"))));
    }
}
class MinesweeperApp extends React.Component {
    constructor() {
        super();
        this.state = { isGameOver: false };
    }
    componentDidMount() {
        Lobby.current.game = new Minesweeper.Game.MinesweeperGame(Lobby.current, Lobby.current.configuration);
        Lobby.current.game.onGameOverCallback = () => {
            this.setState({ isGameOver: true });
        };
    }
    render() {
        var gameStyle = { position: "relative", textAlign: "center" };
        return (React.createElement("div", {"style": gameStyle}, React.createElement("h3", null, "Minesweeper"), React.createElement("canvas", {"id": "game-canvas"}), this.state.isGameOver ? React.createElement(MinesweeperGameOver, null) : null));
    }
}
//# sourceMappingURL=app.js.map