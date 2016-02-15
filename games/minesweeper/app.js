"use strict";
class MinesweeperScore extends React.Component {
}
class MinesweeperGameOver extends React.Component {
    render() {
        return (React.createElement("div", null, React.createElement("p", null, "GAME OVER")));
    }
}
class MinesweeperApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isGameOver: false };
    }
    componentDidMount() {
        Lobby.current.game = new Minesweeper.Game.MinesweeperGame(Lobby.current, Lobby.current.configuration);
        Lobby.current.game.onGameOverCallback = () => {
            this.setState({ isGameOver: true });
        };
    }
    render() {
        return (React.createElement("div", null, React.createElement("p", null, "\"MinesweeperApp\""), React.createElement("canvas", {"id": "game-canvas"}), this.state.isGameOver ? React.createElement(MinesweeperGameOver, null) : null));
    }
}
//# sourceMappingURL=app.js.map