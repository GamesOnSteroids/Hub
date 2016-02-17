var MinesweeperGame = Minesweeper.Game.MinesweeperGame;
"use strict";
var ClientLobby = Play.ClientLobby;
class MinesweeperScore extends React.Component {
    render() {
        var totalFlags = 0;
        for (let player of this.props.players) {
            totalFlags += player.gameData.flags;
        }
        return (React.createElement("div", null, React.createElement("div", null, totalFlags, " / ", this.props.mines), this.props.players.map(p => {
            return React.createElement("div", {"key": p.id}, p.name, ": ", p.gameData.score);
        })));
    }
}
class MinesweeperApp extends React.Component {
    constructor() {
        super();
        this.state = {
            players: ClientLobby.current.players
        };
    }
    componentDidMount() {
        console.log("MinesweeperApp.componentDidMount");
        let game = ClientLobby.current.game;
        game.initialize();
        game.changeListener = (game) => {
            console.log("MinesweeperApp.changeListener");
            this.setState({
                players: ClientLobby.current.players
            });
        };
    }
    render() {
        return (React.createElement("div", {"style": { position: "relative", textAlign: "center" }}, React.createElement(MinesweeperScore, {"players": this.state.players, "mines": ClientLobby.current.configuration.mines}), React.createElement("canvas", {"id": "game-canvas"})));
    }
}
//# sourceMappingURL=minesweeperapp.js.map