class LobbyComponent extends React.Component {
    constructor() {
        super();
        this.state = { gameRunning: Play.ClientLobby.current.gameStarted };
        Play.ClientLobby.current.gameStartedCallback = () => {
            this.setState({ gameRunning: true });
        };
    }
    render() {
        if (!this.state.gameRunning) {
            return (React.createElement("div", null, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-md-8"}, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-md-12"}, React.createElement("div", {"className": "progress"}, React.createElement("div", {"className": "progress-bar progress-bar-striped active", "role": "progressbar", "style": { width: "100%" }}, React.createElement("span", null, "Searching for players"))))), React.createElement("div", null, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-md-12"}, React.createElement("div", null, "Player 1"), React.createElement("div", null, "Player 2"))))), React.createElement("div", {"className": "col-md-4"}, React.createElement(Chat, null)))));
        }
        else {
            var game = React.createElement(MinesweeperApp);
            return (React.createElement("div", null, game));
        }
    }
}
//# sourceMappingURL=lobbycomponent.js.map