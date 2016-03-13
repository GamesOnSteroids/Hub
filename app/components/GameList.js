"use strict";
var FirebaseLobbyService = Play.FirebaseLobbyService;
class GameList extends React.Component {
    constructor() {
        super();
        this.state = {
            lobbies: []
        };
    }
    componentDidMount() {
        let lobbyService = new FirebaseLobbyService();
        lobbyService.getLobbyList().then((lobbies) => {
            this.setState({
                lobbies: lobbies
            });
        });
    }
    render() {
        let gameCounts = new Map();
        for (let lobby of this.state.lobbies) {
            let count = gameCounts.get(lobby.gameId);
            if (count == null) {
                count = 1;
            }
            else {
                count++;
            }
            gameCounts.set(lobby.gameId, count);
        }
        return (React.createElement("div", {className: "row"}, gamesConfiguration
            .filter(g => g.development != true || environment == EnvironmentType.Development)
            .map((gameConfiguration, index) => {
            let result = [];
            index++;
            result.push(React.createElement("div", {className: "col-lg-3 col-md-4 col-sm-6 col-xs-12"}, React.createElement(GameDescription, {gameConfiguration: gameConfiguration, gameCount: gameCounts.get(gameConfiguration.id)})));
            if (index % 4 == 0) {
                result.push(React.createElement("div", {className: "visible-lg clearfix divider"}));
            }
            if (index % 3 == 0) {
                result.push(React.createElement("div", {className: "visible-md clearfix divider"}));
            }
            if (index % 2 == 0) {
                result.push(React.createElement("div", {className: "visible-sm clearfix divider"}));
            }
            result.push(React.createElement("div", {className: "visible-xs clearfix divider"}));
            return result;
        })));
    }
}
