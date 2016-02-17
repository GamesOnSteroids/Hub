"use strict";
var ClientLobby = Play.ClientLobby;
class MinesweeperApp extends React.Component {
    constructor() {
        super();
        this.state = { isGameOver: false };
    }
    componentDidMount() {
        console.log("MinesweeperApp.componentDidMount");
        ClientLobby.current.game = new Minesweeper.Game.MinesweeperGame(ClientLobby.current, ClientLobby.current.configuration);
    }
    render() {
        return (React.createElement("div", {"style": { position: "relative", textAlign: "center" }}, React.createElement("h3", null, "Minesweeper"), React.createElement("canvas", {"id": "game-canvas"})));
    }
}
//# sourceMappingURL=app.js.map